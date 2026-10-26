"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, SelectPicker, IconButton, Message, useToaster } from "rsuite";

import {
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";

import { Rate } from "antd";

import { selector } from "../../../api";
import { char, number } from "../../../utils";
import { hrmsCRUD } from "../../../actions/hrms";

import "../style/item.css";

export const StaffKPIItem = ({ open, setOpen, kpi }) => {
  const toaster = useToaster();

  const [data, setData] = useState(null);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [mode, setMode] = useState("all");

  const canEdit = useMemo(() => {
    if (!data?.period) return false;

    return (
      data.period.window_status === "open" &&
      ["draft", "rejected"].includes(data.period.status)
    );
  }, [data]);

  useEffect(() => {
    if (!open || !kpi?.id) return;

    loadData();
  }, [open, kpi?.id]);

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await hrmsCRUD.loadStaffKPIItem(kpi.id);

      const result = response?.data || response;

      setData(result);

      const editable =
        result?.period?.window_status === "open" &&
        ["draft", "rejected"].includes(result?.period?.status);

      setMode(editable ? "all" : "saved_only");

      setSections(
        buildSections(result).map((section) =>
          recalculateSectionWeightings(section),
        ),
      );
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

            targetValue: savedItem.target_value,
            actualValue: savedItem.actual_value,
            weighting: 0,
            rating: savedItem.rating,
            weightingRating: savedItem.weighting_rating,

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

  const getPerformanceOptions = (sectionId) => {
    const section = data?.sections?.find((item) => item.id === sectionId);

    if (!section) return [];

    const options = [];

    section.key_results?.forEach((keyResult) => {
      keyResult.measures?.forEach((measure) => {
        options.push({
          label: measure.description,
          value: measure.id,

          keyResultId: keyResult.id,
          keyResult: keyResult.title,

          performanceMeasure: measure.description,
          unitOfMeasure: measure.unit_of_measure,

          savedItem: measure.saved_item,
        });
      });
    });

    return options;
  };

  const handleAddPerformance = (sectionId) => {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          rows: [
            ...section.rows,
            {
              performanceId: null,
              keyResultId: null,

              keyResult: "",
              performanceMeasure: "",
              unitOfMeasure: "",

              savedItem: null,
              itemId: null,

              targetValue: "",
              actualValue: "",
              weighting: "",
              rating: "",
              weightingRating: "",

              existing: false,
            },
          ],
        };
      }),
    );
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

  const handlePerformanceChange = (sectionId, rowIndex, performanceId) => {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) return section;

        const options = getPerformanceOptions(sectionId);

        const selected = options.find(
          (option) => option.value === performanceId,
        );

        if (!selected) return section;

        const duplicate = section.rows.some(
          (row, index) =>
            index !== rowIndex && row.performanceId === performanceId,
        );

        if (duplicate) {
          toaster.push(
            <Message showIcon type="warning">
              This performance measure has already been selected.
            </Message>,
            {
              placement: "topEnd",
            },
          );

          return section;
        }

        const rows = [...section.rows];

        rows[rowIndex] = {
          ...rows[rowIndex],

          performanceId: selected.value,
          keyResultId: selected.keyResultId,

          keyResult: selected.keyResult,
          performanceMeasure: selected.performanceMeasure,
          unitOfMeasure: selected.unitOfMeasure,

          savedItem: selected.savedItem || null,

          itemId: selected.savedItem?.id || null,

          targetValue: selected.savedItem?.target_value ?? "",
          actualValue: selected.savedItem?.actual_value ?? "",
          weighting: selected.savedItem?.weighting ?? "",
          rating: selected.savedItem?.rating ?? "",
          weightingRating: selected.savedItem?.weighting_rating ?? "",

          existing: !!selected.savedItem,
        };

        return recalculateSectionWeightings({
          ...section,
          rows,
        });
      }),
    );
  };

  const handleRemovePerformance = (sectionId, rowIndex) => {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) return section;

        return recalculateSectionWeightings({
          ...section,
          rows: section.rows.filter((_, index) => index !== rowIndex),
        });
      }),
    );
  };

  const handleActualChange = (sectionId, rowIndex, value) => {
    setSections((current) =>
      current.map((section) => {
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
      }),
    );
  };

  const handleTargetChange = (sectionId, rowIndex, value) => {
    setSections((current) =>
      current.map((section) => {
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
      }),
    );
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleSave = async (submit = false) => {
    if (!kpi?.id) return;

    const items = sections.flatMap((section) =>
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

    const payload = {
      submit,
      items,
    };

    setSaving(true);

    try {
      await hrmsCRUD.addStaffKPI(kpi.id, payload);

      toaster.push(
        <Message showIcon type="success">
          {submit ? "KPI submitted successfully." : "KPI saved successfully."}
        </Message>,
        {
          placement: "topEnd",
        },
      );

      await loadData();

      if (submit) {
        setOpen(false);
      }
    } catch (error) {
      toaster.push(
        <Message showIcon type="error">
          {submit ? "Failed to submit KPI." : "Failed to save KPI."}
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

  const getVisibleRows = (section) => {
    if (!section?.rows) return [];

    return section.rows
      .map((row, originalIndex) => ({
        row,
        originalIndex,
      }))
      .filter(({ row }) => mode !== "saved_only" || row.existing);
  };

  const getKeyResultRowSpan = (rows, rowIndex) => {
    const currentKeyResult = rows[rowIndex]?.keyResult;

    if (!currentKeyResult) {
      return 1;
    }

    // Same Key Result as previous row:
    // don't render another cell.
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

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => {
      if (kpi?.id) {
        hrmsCRUD
          .submitStaffKPI(kpi.id)
          .then(() => {
            setSaving(false);
            setOpen(false);
            toaster.push(
              <Message showIcon type="success">
                {"KPI submitted successfully."}
              </Message>,
              {
                placement: "topEnd",
              },
            );
          })
          .catch((error) => {
            toaster.push(
              <Message showIcon type="error">
                {"Failed to submit KPI."}
              </Message>,
              {
                placement: "topEnd",
              },
            );
          })
          .finally(() => {
            setSaving(false);
          });
      } else {
        setSaving(false);
      }
    }, 2000);
  };

  return (
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
            <div className="pbz-kpi-modal-eyebrow">{`${char.toUpperCase(kpi?.code)}`}</div>

            <h4>{`${char.toUpperCase(kpi?.title)}`}</h4>

            <p>{`${data?.period?.staff_opf} : ${char.toTitleCase(data?.period?.staff_name)}`}</p>
          </div>

          {canEdit && !saving && (
            <div className="pbz-kpi-mode-switch" title="Change view mode">
              <button
                type="button"
                className={`pbz-kpi-mode-btn ${mode === "all" ? "active" : ""}`}
                onClick={() => handleModeChange("all")}
                title="Edit mode"
                aria-label="Edit mode"
                disabled={saving}
              >
                <EditOutlined />
              </button>

              <button
                type="button"
                className={`pbz-kpi-mode-btn ${
                  mode === "saved_only" ? "active" : ""
                }`}
                onClick={() => handleModeChange("saved_only")}
                title="Saved items"
                aria-label="Saved items"
                disabled={saving}
              >
                <EyeOutlined />
              </button>
            </div>
          )}
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
                        {`${char.toUpperCase(section.code)} : ${char.toTitleCase(section.name)}`}
                      </h5>
                    </div>

                    {canEdit && mode === "all" && (
                      <button
                        type="button"
                        className="pbz-kpi-add-btn"
                        onClick={() => handleAddPerformance(section.id)}
                        disabled={saving}
                      >
                        <PlusOutlined />
                        Add Item
                      </button>
                    )}
                  </div>

                  {section.rows.length === 0 ? (
                    <div className="pbz-kpi-empty-section">
                      <div className="pbz-kpi-empty-icon">
                        <PlusOutlined />
                      </div>

                      <strong>No performance measures selected</strong>

                      <span>
                        {mode === "saved_only"
                          ? "There are no saved performance measures for this section."
                          : "Select a performance measure to add it to this section."}
                      </span>

                      {canEdit && mode === "all" && (
                        <button
                          type="button"
                          className="pbz-kpi-select-btn"
                          onClick={() => handleAddPerformance(section.id)}
                          disabled={saving}
                        >
                          <PlusOutlined />
                          <span>Select Performance</span>
                        </button>
                      )}
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

                            {mode === "all" && (
                              <th className="text-center">Action</th>
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {(() => {
                            const visibleRows = getVisibleRows(section);
                            const rows = visibleRows.map((item) => item.row);

                            return (
                              <>
                                {visibleRows.map(
                                  ({ row, originalIndex }, visibleIndex) => {
                                    const keyResultRowSpan =
                                      getKeyResultRowSpan(rows, visibleIndex);

                                    return (
                                      <tr
                                        key={`${section.id}-${originalIndex}`}
                                      >
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
                                                Select performance
                                              </span>
                                            )}
                                          </td>
                                        )}

                                        <td>
                                          {canEdit && mode === "all" ? (
                                            <SelectPicker
                                              block
                                              searchable
                                              placement="autoVerticalStart"
                                              cleanable={false}
                                              placeholder="Select performance measure"
                                              data={getPerformanceOptions(
                                                section.id,
                                              )}
                                              value={row.performanceId || null}
                                              onChange={(value) =>
                                                handlePerformanceChange(
                                                  section.id,
                                                  originalIndex,
                                                  value,
                                                )
                                              }
                                              disabled={saving}
                                              className="pbz-kpi-performance-select"
                                            />
                                          ) : (
                                            renderPerformanceMeasure(
                                              row.performanceMeasure,
                                            )
                                          )}
                                        </td>

                                        <td className="text-center">
                                          {canEdit && mode === "all" ? (
                                            <input
                                              type="text"
                                              value={row.targetValue ?? ""}
                                              onChange={(e) =>
                                                handleTargetChange(
                                                  section.id,
                                                  originalIndex,
                                                  e.target.value,
                                                )
                                              }
                                              disabled={saving}
                                              className="form-control form-control-sm pbz-kpi-number-input"
                                              placeholder="Enter target"
                                            />
                                          ) : (
                                            <span className="pbz-kpi-muted-value">
                                              {row.savedItem
                                                ? row.targetValue
                                                : "0"}
                                            </span>
                                          )}
                                        </td>

                                        <td className="text-center">
                                          {canEdit && mode === "all" ? (
                                            <input
                                              type="number"
                                              min="0"
                                              step="0.01"
                                              value={row.actualValue ?? ""}
                                              onChange={(e) =>
                                                handleActualChange(
                                                  section.id,
                                                  originalIndex,
                                                  e.target.value,
                                                )
                                              }
                                              disabled={saving}
                                              className="form-control form-control-sm pbz-kpi-number-input"
                                              placeholder="0"
                                            />
                                          ) : (
                                            <span className="pbz-kpi-muted-value">
                                              {row.savedItem
                                                ? number.fPercent(
                                                    row.actualValue,
                                                  )
                                                : "0"}
                                            </span>
                                          )}
                                        </td>

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

                                        <td className="text-center">
                                          <span className="pbz-kpi-weight">
                                            {row.savedItem || row.weighting
                                              ? number.fPercent(row.weighting)
                                              : "0"}
                                          </span>
                                        </td>

                                        <td className="text-center">
                                          <span className="pbz-kpi-weighted-rating">
                                            {number.fPercent(
                                              row.weightingRating || 0,
                                            )}
                                          </span>
                                        </td>

                                        {mode === "all" && (
                                          <td className="pbz-kpi-action-cell text-center">
                                            {canEdit && (
                                              <IconButton
                                                icon={<DeleteOutlined />}
                                                appearance="subtle"
                                                color="red"
                                                size="sm"
                                                circle
                                                title="Remove item"
                                                onClick={() =>
                                                  handleRemovePerformance(
                                                    section.id,
                                                    originalIndex,
                                                  )
                                                }
                                                disabled={saving}
                                              />
                                            )}
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  },
                                )}

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

                                  {mode === "all" && <td />}
                                </tr>
                              </>
                            );
                          })()}
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
          <button
            type="button"
            className="pbz-app-btn pbz-btn-cancel"
            disabled={saving}
            onClick={() => setOpen(false)}
          >
            <CloseOutlined />
            Cancel
          </button>

          {canEdit && mode === "all" && (
            <button
              type="button"
              className="pbz-app-btn pbz-btn-submit"
              disabled={saving}
              onClick={() => handleSave(false)}
            >
              {saving ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <SaveOutlined />
              )}
              {saving ? "Saving..." : "Save"}
            </button>
          )}

          {canEdit && mode !== "all" && (
            <button
              type="button"
              className="pbz-app-btn pbz-btn-submit"
              disabled={saving}
              onClick={() => handleSubmit()}
            >
              {saving ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <SendOutlined />
              )}
              {saving ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};
