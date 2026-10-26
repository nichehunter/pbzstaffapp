import { useEffect, useMemo, useState } from "react";
import { Modal, Message, useToaster } from "rsuite";

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

import { Rate } from "antd";

import { selector } from "../../../api";
import { char, number } from "../../../utils";
import { hrmsCRUD } from "../../../actions/hrms";

import "../style/item.css";

export const SupervisorKPIItem = ({ open, setOpen, kpi, setIndex }) => {
  const user = selector.User();
  const staff = selector.Staff();
  const [originalSections, setOriginalSections] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const toaster = useToaster();
  const [data, setData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [comment, setComment] = useState("");

  const canEdit = useMemo(() => {
    return data?.period?.status === "submitted";
  }, [data]);

  useEffect(() => {
    if (!open || !kpi?.id) return;

    loadData();
  }, [open, kpi?.id]);

  const loadData = async () => {
    setLoading(true);
    setComment("");

    try {
      const response = await hrmsCRUD.loadStaffKPIItem(kpi.id);

      const result = response?.data || response;

      setData(result);

      const builtSections = buildSections(result).map((section) =>
        recalculateSectionWeightings(section),
      );

      setSections(builtSections);
      setOriginalSections(structuredClone(builtSections));
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to load KPI item:", error);

      toaster.push(
        <Message showIcon type="error">
          Failed to load KPI assessment.
        </Message>,
        {
          placement: "topEnd",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const buildSections = (result) => {
    if (!result?.sections) return [];

    return result.sections.map((section) => {
      const rows = [];

      section.key_results?.forEach((keyResult) => {
        keyResult.measures?.forEach((measure) => {
          if (!measure.saved_item) return;

          const savedItem = measure.saved_item;

          rows.push({
            performanceId: measure.id,
            keyResultId: keyResult.id,

            keyResult: keyResult.title,
            performanceMeasure: measure.description,
            unitOfMeasure: measure.unit_of_measure,

            savedItem,

            itemId: savedItem.id,

            targetValue: savedItem.target_value ?? "",
            actualValue: savedItem.actual_value ?? "",

            weighting: 0,
            rating: savedItem.rating ?? 0,
            weightingRating: savedItem.weighting_rating ?? 0,

            existing: true,
          });
        });
      });

      return {
        id: section.id,
        code: section.code,
        name: section.title,
        description: section.description,
        weight: section.weight,
        rows,
      };
    });
  };

  const checkForChanges = (updatedSections) => {
    return updatedSections.some((section, sectionIndex) => {
      const originalSection = originalSections[sectionIndex];

      if (!originalSection) return false;

      return section.rows.some((row, rowIndex) => {
        const originalRow = originalSection.rows[rowIndex];

        if (!originalRow) return false;

        return (
          String(row.targetValue ?? "") !==
            String(originalRow.targetValue ?? "") ||
          String(row.actualValue ?? "") !==
            String(originalRow.actualValue ?? "")
        );
      });
    });
  };

  const getStarRating = (actual) => {
    const value = Number(actual);

    if (!Number.isFinite(value) || value <= 0) {
      return 0;
    }

    if (value < 50) return 1;
    if (value < 80) return 2;
    if (value < 100) return 3;
    if (value < 120) return 4;

    return 5;
  };

  const getWeightingRating = (weighting, rating) => {
    const weight = Number(weighting || 0);
    const rate = Number(rating || 0);

    if (!weight || !rate) {
      return 0;
    }

    return (weight * rate) / 5;
  };

  const recalculateSectionWeightings = (section) => {
    const totalWeight = Number(section.weight || 0);

    const totalMeasures = section.rows.filter(
      (row) => row.performanceId,
    ).length;

    if (!totalMeasures) {
      return {
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          weighting: 0,
          weightingRating: 0,
        })),
      };
    }

    const weighting = totalWeight / totalMeasures;

    return {
      ...section,
      rows: section.rows.map((row) => ({
        ...row,

        weighting: row.performanceId ? weighting : 0,

        weightingRating: row.performanceId
          ? getWeightingRating(weighting, row.rating)
          : 0,
      })),
    };
  };

  const getSectionTotalWeighting = (section) => {
    return section.rows.reduce(
      (total, row) => total + Number(row.weighting || 0),
      0,
    );
  };

  const getSectionTotalWeightedRating = (section) => {
    return section.rows.reduce(
      (total, row) => total + Number(row.weightingRating || 0),
      0,
    );
  };

  const handleTargetChange = (sectionId, rowIndex, value) => {
    if (!canEdit) return;

    setSections((current) => {
      const updatedSections = current.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        const rows = [...section.rows];

        rows[rowIndex] = {
          ...rows[rowIndex],
          targetValue: value,
        };

        return {
          ...section,
          rows,
        };
      });

      setHasChanges(checkForChanges(updatedSections));

      return updatedSections;
    });
  };

  const handleActualChange = (sectionId, rowIndex, value) => {
    if (!canEdit) return;

    setSections((current) => {
      const updatedSections = current.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        const rows = [...section.rows];

        const actualValue = value === "" ? "" : Number(value);

        const rating = getStarRating(actualValue);

        const totalWeight = Number(section.weight || 0);

        const totalMeasures = rows.filter((row) => row.performanceId).length;

        const weighting =
          totalWeight > 0 && totalMeasures > 0
            ? totalWeight / totalMeasures
            : 0;

        const weightingRating = getWeightingRating(weighting, rating);

        rows[rowIndex] = {
          ...rows[rowIndex],
          actualValue,
          rating,
          weighting,
          weightingRating,
        };

        return {
          ...section,
          rows,
        };
      });

      setHasChanges(checkForChanges(updatedSections));

      return updatedSections;
    });
  };

  const getItemsPayload = () => {
    return sections.flatMap((section) =>
      section.rows
        .filter((row) => row.performanceId)
        .map((row) => ({
          section_id: section.id,
          key_result_id: row.keyResultId,
          performance_measure_id: row.performanceId,

          target_value: String(row.targetValue ?? "0"),
          actual_value: String(row.actualValue ?? "0"),

          weighting: String(row.weighting ?? "0"),
          rating: String(row.rating ?? "0"),
          weighting_rating: String(row.weightingRating ?? "0"),
        })),
    );
  };

  const saveChanges = async () => {
    if (!kpi?.id) return false;

    const items = getItemsPayload();

    await hrmsCRUD.addStaffKPI(kpi.id, {
      submit: true,
      items,
    });

    return true;
  };

  const handleApprove = async () => {
    if (!kpi?.id || !canEdit) return;
    if (!comment) {
      toaster.push(
        <Message showIcon type="warning">
          Failed to approve KPI. Please provide a comment.
        </Message>,
        {
          placement: "topEnd",
        },
      );
      return;
    }

    setSaving(true);

    try {
      if (hasChanges) {
        await saveChanges();
      }

      await hrmsCRUD.approveStaffKPI({
        kpi_period_id: kpi.id,
        supervisor_id: staff?.id,
        comments: comment,
      });

      toaster.push(
        <Message showIcon type="success">
          KPI approved successfully.
        </Message>,
        {
          placement: "topEnd",
        },
      );
      setIndex((prev) => prev + 1);
      setComment("");
      setOpen(false);
    } catch (error) {
      toaster.push(
        <Message showIcon type="error">
          Failed to approve KPI.
        </Message>,
        {
          placement: "topEnd",
        },
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!kpi?.id || !canEdit) return;
    if (!comment) {
      toaster.push(
        <Message showIcon type="warning">
          Failed to reject KPI. Please provide a comment.
        </Message>,
        {
          placement: "topEnd",
        },
      );
      return;
    }

    setSaving(true);

    try {
      if (hasChanges) {
        await saveChanges();
      }

      await hrmsCRUD.rejectStaffKPI({
        kpi_period_id: kpi.id,
        supervisor_id: staff?.id,
        comments: comment,
      });

      toaster.push(
        <Message showIcon type="success">
          KPI rejected successfully.
        </Message>,
        {
          placement: "topEnd",
        },
      );

      setIndex((prev) => prev + 1);
      setComment("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to reject KPI:", error);

      toaster.push(
        <Message showIcon type="error">
          Failed to reject KPI.
        </Message>,
        {
          placement: "topEnd",
        },
      );
    } finally {
      setSaving(false);
    }
  };

  const renderPerformanceMeasure = (value) => {
    if (!value) {
      return <span className="pbz-kpi-muted-value">—</span>;
    }

    const lines = String(value)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const bulletPattern = /^[-•*▪◦●○]\s*/;

    const hasBullets = lines.some((line) => bulletPattern.test(line));

    if (!hasBullets) {
      return <span className="pbz-kpi-performance-name">{value}</span>;
    }

    return (
      <div className="pbz-kpi-performance-bullets">
        {lines.map((line, index) => {
          const isBullet = bulletPattern.test(line);

          const text = line.replace(bulletPattern, "");

          if (!isBullet) {
            return (
              <div
                key={`${text}-${index}`}
                className="pbz-kpi-performance-bullet"
              >
                <span className="pbz-kpi-performance-bullet-text">{text}</span>
              </div>
            );
          }

          return (
            <div
              key={`${text}-${index}`}
              className="pbz-kpi-performance-bullet"
            >
              <span className="pbz-kpi-bullet" />

              <span className="pbz-kpi-performance-bullet-text">{text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const getKeyResultRowSpan = (rows, rowIndex) => {
    const currentKeyResult = rows[rowIndex]?.keyResult;

    if (!currentKeyResult) {
      return 1;
    }

    if (rowIndex > 0 && rows[rowIndex - 1]?.keyResult === currentKeyResult) {
      return 0;
    }

    let rowSpan = 1;

    for (let index = rowIndex + 1; index < rows.length; index++) {
      if (rows[index]?.keyResult !== currentKeyResult) {
        break;
      }

      rowSpan++;
    }

    return rowSpan;
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          if (!saving) {
            setOpen(false);
          }
        }}
        size="full"
        className="pbz-kpi-entry-modal"
        backdrop="static"
      >
        <Modal.Header>
          <div className="pbz-kpi-modal-title">
            <div className="pbz-kpi-modal-title-content">
              <div className="pbz-kpi-modal-eyebrow">
                {char.toUpperCase(data?.period?.window_code)}
              </div>

              <h4>{char.toUpperCase(data?.period?.window_title)}</h4>

              <p>
                {`${data?.period?.staff_opf} : ${char.toTitleCase(data?.period?.staff_name)}`}
              </p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="pbz-kpi-entry-body">
            {loading ? (
              <div className="pbz-kpi-entry-loading">
                <span>Loading KPI assessment...</span>
              </div>
            ) : (
              <>
                {sections.map((section) => (
                  <div key={section.id} className="pbz-kpi-section-card">
                    <div className="pbz-kpi-section-table-header">
                      <div className="pbz-kpi-section-table-header-left">
                        <h5 className="text-white">
                          {`${char.toUpperCase(
                            section.code,
                          )} : ${char.toTitleCase(section.name)}`}
                        </h5>
                      </div>
                    </div>

                    {section.rows.length === 0 ? (
                      <div className="pbz-kpi-empty-section">
                        <strong>No performance measures selected</strong>

                        <span>
                          There are no saved performance measures for this
                          section.
                        </span>
                      </div>
                    ) : (
                      <div className="pbz-kpi-entry-table-wrapper">
                        <table className="pbz-kpi-entry-table">
                          <thead>
                            <tr>
                              <th>Key Result Area</th>
                              <th>Performance Measure</th>

                              <th className="text-center">FY Target</th>

                              <th className="text-center">Actual</th>

                              <th className="text-center">Rating</th>

                              <th className="text-center">Weighting</th>

                              <th className="text-center">Weighted Rating</th>
                            </tr>
                          </thead>

                          <tbody>
                            {section.rows.map((row, rowIndex) => {
                              const keyResultRowSpan = getKeyResultRowSpan(
                                section.rows,
                                rowIndex,
                              );

                              return (
                                <tr key={`${section.id}-${rowIndex}`}>
                                  {keyResultRowSpan > 0 && (
                                    <td
                                      rowSpan={keyResultRowSpan}
                                      className="pbz-kpi-key-result-cell"
                                    >
                                      {row.keyResult ? (
                                        <span className="pbz-kpi-result-name">
                                          {char.toUpperCaseFirst
                                            ? char.toUpperCaseFirst(
                                                row.keyResult,
                                              )
                                            : row.keyResult}
                                        </span>
                                      ) : (
                                        <span className="pbz-kpi-placeholder">
                                          —
                                        </span>
                                      )}
                                    </td>
                                  )}

                                  <td>
                                    {renderPerformanceMeasure(
                                      row.performanceMeasure,
                                    )}
                                  </td>

                                  {/* TARGET */}
                                  <td className="text-center">
                                    {canEdit ? (
                                      <input
                                        type="text"
                                        value={row.targetValue ?? ""}
                                        onChange={(e) =>
                                          handleTargetChange(
                                            section.id,
                                            rowIndex,
                                            e.target.value,
                                          )
                                        }
                                        disabled={saving}
                                        className="form-control form-control-sm pbz-kpi-number-input"
                                        placeholder="Enter target"
                                      />
                                    ) : (
                                      <span className="pbz-kpi-muted-value">
                                        {row.targetValue || "0"}
                                      </span>
                                    )}
                                  </td>

                                  {/* ACTUAL */}
                                  <td className="text-center">
                                    {canEdit ? (
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={row.actualValue ?? ""}
                                        onChange={(e) =>
                                          handleActualChange(
                                            section.id,
                                            rowIndex,
                                            e.target.value,
                                          )
                                        }
                                        disabled={saving}
                                        className="form-control form-control-sm pbz-kpi-number-input"
                                        placeholder="0"
                                      />
                                    ) : (
                                      <span className="pbz-kpi-muted-value">
                                        {row.actualValue !== null &&
                                        row.actualValue !== undefined &&
                                        row.actualValue !== ""
                                          ? number.fPercent(row.actualValue)
                                          : "0"}
                                      </span>
                                    )}
                                  </td>

                                  {/* RATING */}
                                  <td className="text-center">
                                    <Rate
                                      disabled
                                      allowHalf
                                      value={Number(row.rating || 0)}
                                      style={{
                                        fontSize: 13,
                                      }}
                                    />
                                  </td>

                                  {/* WEIGHTING */}
                                  <td className="text-center">
                                    <span className="pbz-kpi-weight">
                                      {number.fPercent(row.weighting || 0)}
                                    </span>
                                  </td>

                                  {/* WEIGHTED RATING */}
                                  <td className="text-center">
                                    <span className="pbz-kpi-weighted-rating">
                                      {number.fPercent(
                                        row.weightingRating || 0,
                                      )}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}

                            {/* TOTAL */}
                            <tr className="pbz-kpi-section-total-row">
                              <td
                                colSpan={5}
                                className="pbz-kpi-section-total-label"
                              >
                                Total
                              </td>

                              <td className="text-center">
                                <span className="pbz-kpi-section-total-weight">
                                  {number.fPercent(
                                    getSectionTotalWeighting(section),
                                  )}
                                </span>
                              </td>

                              <td className="text-center">
                                <span className="pbz-kpi-section-total-rating">
                                  {number.fPercent(
                                    getSectionTotalWeightedRating(section),
                                  )}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="pbz-kpi-modal-footer">
            {/* CANCEL */}
            <button
              type="button"
              className="pbz-app-btn pbz-btn-delete"
              disabled={saving}
              onClick={() => setOpen(false)}
            >
              <CloseOutlined />
              Cancel
            </button>

            {/* REJECT */}
            {canEdit && (
              <button
                type="button"
                className="pbz-app-btn pbz-btn-warning "
                disabled={saving}
                onClick={() => setRejectConfirmOpen(true)}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <CloseOutlined />
                )}

                {saving ? "Rejecting..." : "Reject"}
              </button>
            )}

            {/* APPROVE */}
            {canEdit && (
              <button
                type="button"
                className="pbz-app-btn pbz-btn-submit"
                disabled={saving}
                onClick={() => setApproveConfirmOpen(true)}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <CheckOutlined />
                )}

                {saving ? "Approving..." : "Approve"}
              </button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
      <ApproveConfirm
        approveConfirmOpen={approveConfirmOpen}
        setApproveConfirmOpen={setApproveConfirmOpen}
        saving={saving}
        handleApprove={handleApprove}
        comment={comment}
        setComment={setComment}
      />
      <RejectConfirm
        rejectConfirmOpen={rejectConfirmOpen}
        setRejectConfirmOpen={setRejectConfirmOpen}
        saving={saving}
        handleReject={handleReject}
        comment={comment}
        setComment={setComment}
      />
    </>
  );
};

const ApproveConfirm = ({
  approveConfirmOpen,
  setApproveConfirmOpen,
  saving,
  handleApprove,
  comment,
  setComment,
}) => {
  return (
    <Modal
      open={approveConfirmOpen}
      onClose={() => setApproveConfirmOpen(false)}
      size="xs"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>Approve KPI</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-2">
          <label className="form-label">
            Comment <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={saving}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="pbz-app-btn pbz-btn-delete me-2"
          disabled={saving}
          onClick={() => {
            setApproveConfirmOpen(false);
            setComment("");
          }}
        >
          <CloseOutlined /> Cancel
        </button>

        <button
          type="button"
          className="pbz-app-btn pbz-btn-submit"
          disabled={saving}
          onClick={async () => {
            setApproveConfirmOpen(false);
            await handleApprove(comment);
          }}
        >
          {saving ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <CheckOutlined />
          )}

          {saving ? "Approving..." : "Approve"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

const RejectConfirm = ({
  rejectConfirmOpen,
  setRejectConfirmOpen,
  saving,
  handleReject,
  comment,
  setComment,
}) => {
  return (
    <Modal
      open={rejectConfirmOpen}
      onClose={() => setRejectConfirmOpen(false)}
      size="xs"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>Reject KPI</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-2">
          <label className="form-label">
            Comment <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={saving}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="pbz-app-btn pbz-btn-delete me-2"
          disabled={saving}
          onClick={() => {
            setRejectConfirmOpen(false);
            setComment("");
          }}
        >
          <CloseOutlined /> Cancel
        </button>

        <button
          type="button"
          className="pbz-app-btn pbz-btn-submit"
          disabled={saving}
          onClick={async () => {
            setRejectConfirmOpen(false);
            await handleReject(comment);
          }}
        >
          {saving ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <CheckOutlined />
          )}

          {saving ? "Rejecting..." : "Reject"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};
