import { useEffect, useState } from "react";
import {
  DatePicker,
  Input,
  Loader,
  MaskedInput,
  Message,
  SelectPicker,
  useToaster,
} from "rsuite";
import moment from "moment";
import isAfter from "date-fns/isAfter";
import "../styles/staff.css";
import { char } from "../../../utils";
import { hrmsCRUD } from "../../../actions/hrms";

export const StaffInfo = ({ dataId }) => {
  const toaster = useToaster();

  const [isEdit, setIsEdit] = useState(false);
  const [gender, setGender] = useState([]);
  const [title, setTitle] = useState([]);
  const [status, setStatus] = useState([]);

  const [errorEmail, setErrorEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [data, setData] = useState({});

  const [dataSave, setDataSave] = useState({
    code: "",
    full_name: "",
    dob: "",
    gender: "",
    address: "",
    phone_number: "",
    email: "",
    zanid: "",
    nida: "",
    next_keen: "",
    keen_number: "",
    personal_email: "",
    employment_status: "",
    job_title: "",
    doh: "",
  });

  const phoneNumberMask = [
    /[2]/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      hrmsCRUD
        .loadDictionaryData(5, 0, "", 1)
        .then((resp) => setGender(resp.data.results))
        .catch(() => {});

      hrmsCRUD
        .loadDictionaryData(20, 0, "", 6)
        .then((resp) => setTitle(resp.data.results))
        .catch(() => {});

      hrmsCRUD
        .loadDictionaryData(20, 0, "", 7)
        .then((resp) => setStatus(resp.data.results))
        .catch(() => {});
    }, 300);

    return () => clearTimeout(timer);
  }, [dataId]);

  useEffect(() => {
    if (!dataId) return;

    setLoading(true);

    const timer = setTimeout(() => {
      hrmsCRUD
        .loadStaffDetails(dataId)
        .then((resp) => {
          const staff = resp.data;

          setData(staff);

          setDataSave({
            code: staff.code || "",
            full_name: staff.full_name || "",
            dob: staff.dob || "",
            gender: staff.gender?.id || "",
            address: staff.address || "",
            phone_number: staff.phone_number || "",
            email: staff.email || "",
            zanid: staff.zanid?.id || staff.zanid || "",
            nida: staff.nida || "",
            next_keen: staff.next_keen || "",
            keen_number: staff.keen_number || "",
            personal_email: staff.personal_email || "",
            employment_status: staff.employment_status?.id || "",
            job_title: staff.job_title?.id || "",
            doh: staff.doh || "",
          });
        })
        .catch((error) => {
          toaster.push(
            <Message showIcon type="error" closable>
              {error.message}
            </Message>,
            {
              placement: "topCenter",
              duration: 7000,
            },
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [dataId, index, toaster]);

  const handleChange = (field, value) => {
    setDataSave((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setErrorEmail(Boolean(value && !emailRegex.test(value)));
  };

  const handleCancel = () => {
    setIsEdit(false);
    setErrorEmail(false);

    setDataSave({
      code: data.code || "",
      full_name: data.full_name || "",
      dob: data.dob || "",
      gender: data.gender?.id || "",
      address: data.address || "",
      phone_number: data.phone_number || "",
      email: data.email || "",
      zanid: data.zanid?.id || data.zanid || "",
      nida: data.nida || "",
      next_keen: data.next_keen || "",
      keen_number: data.keen_number || "",
      personal_email: data.personal_email || "",
      employment_status: data.employment_status?.id || "",
      job_title: data.job_title?.id || "",
      doh: data.doh || "",
    });
  };

  const handleSave = () => {
    if (errorEmail) return;

    setLoading(true);

    setTimeout(() => {
      hrmsCRUD
        .updateStaff(dataId, dataSave)
        .then(() => {
          toaster.push(
            <Message type="success" showIcon closable header="Profile Updated">
              Staff information has been updated successfully.
            </Message>,
            {
              placement: "topEnd",
              duration: 5000,
            },
          );

          setIsEdit(false);
          setIndex((prev) => prev + 1);
        })
        .catch((error) => {
          toaster.push(
            <Message type="error" showIcon closable header="Update Failed">
              {error?.message || "Unable to update staff information."}
            </Message>,
            {
              placement: "topEnd",
              duration: 7000,
            },
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);
  };

  const displayValue = (value, fallback = "Not provided") => value || fallback;

  const getFullName = () => {
    if (!data.full_name) return "Staff Member";

    return `${char.toTitleCase(data.code || "")} ${char.toUpperCase(
      data.full_name,
    )}`.trim();
  };

  const InfoItem = ({ label, value, icon, children, className = "" }) => (
    <div className={`pbz-staff-info-item ${className}`}>
      <div className="pbz-staff-info-label">
        <span className="pbz-staff-info-icon">
          <i className={icon} />
        </span>
        <span>{label}</span>
      </div>

      <div className="pbz-staff-info-value">
        {children || displayValue(value)}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="pbz-staff-loading">
        <Loader backdrop size="md" speed="slow" content="Please wait..." />
      </div>
    );
  }

  return (
    <div className="pbz-staff-info">
      {/* HEADER */}
      <div className="pbz-staff-profile-header">
        <div className="pbz-staff-profile-identity">
          <div className="pbz-staff-profile-avatar">
            {data.full_name ? data.full_name.charAt(0).toUpperCase() : "S"}
          </div>

          <div className="pbz-staff-profile-name">
            <span>EMPLOYEE INFORMATION</span>

            <h2>{getFullName()}</h2>

            <div className="pbz-staff-profile-meta">
              <span>
                <i className="bi bi-person-badge" />
                {displayValue(data.staff_opf, "OPF unavailable")}
              </span>

              <span>
                <i className="bi bi-briefcase" />
                {data.job_title
                  ? char.toTitleCase(data.job_title.dictionary_item_name)
                  : "Position not provided"}
              </span>
            </div>
          </div>
        </div>

        <div className="pbz-staff-profile-actions">
          {!isEdit ? (
            <button
              type="button"
              className="pbz-staff-edit-button"
              onClick={() => setIsEdit(true)}
            >
              <i className="bi bi-pencil-square" />
              Edit Information
            </button>
          ) : (
            <div className="pbz-staff-edit-actions">
              <button
                type="button"
                className="pbz-staff-cancel-button"
                onClick={handleCancel}
              >
                <i className="bi bi-x-lg" />
                Cancel
              </button>

              <button
                type="button"
                className="pbz-staff-save-button"
                onClick={handleSave}
                disabled={loading || errorEmail}
              >
                <i className="bi bi-check-lg" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STATUS STRIP */}
      <div className="pbz-staff-status-strip">
        <div className="pbz-staff-status">
          <span className="pbz-staff-status-dot" />
          <div>
            <strong>
              {data.employment_status
                ? char.toTitleCase(data.employment_status.dictionary_item_name)
                : "Employment status unavailable"}
            </strong>
            <span>Current employment status</span>
          </div>
        </div>

        <div className="pbz-staff-status-item">
          <span>Hire Date</span>
          <strong>
            {data.doh ? moment(data.doh).format("DD MMM YYYY") : "Not provided"}
          </strong>
        </div>

        <div className="pbz-staff-status-item">
          <span>OPF Number</span>
          <strong>{displayValue(data.staff_opf)}</strong>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <section className="pbz-staff-section">
        <div className="pbz-staff-section-header">
          <div>
            <span>01</span>
            <div>
              <h3>Personal Information</h3>
              <p>Basic personal details and identification information.</p>
            </div>
          </div>
        </div>

        <div className="pbz-staff-grid">
          <InfoItem label="Full Name" value={getFullName()} icon="bi bi-person">
            {isEdit ? (
              <div className="pbz-staff-inline-fields">
                <SelectPicker
                  data={[
                    { value: "prof.", label: "Prof" },
                    { value: "dr.", label: "Dr" },
                    { value: "eng.", label: "Eng" },
                    { value: "mr.", label: "Mr" },
                    { value: "mrs.", label: "Mrs" },
                    { value: "ms.", label: "Ms" },
                  ]}
                  value={dataSave.code}
                  placeholder="Title"
                  cleanable
                  searchable={false}
                  onChange={(value) => handleChange("code", value)}
                />

                <Input
                  value={dataSave.full_name}
                  placeholder="Full name"
                  onChange={(value) => handleChange("full_name", value)}
                />
              </div>
            ) : null}
          </InfoItem>

          <InfoItem
            label="Date of Birth"
            value={
              data.dob ? moment(data.dob).format("ddd, DD MMM YYYY") : null
            }
            icon="bi bi-calendar3"
          >
            {isEdit ? (
              <DatePicker
                value={dataSave.dob ? new Date(dataSave.dob) : null}
                size="md"
                oneTap
                block
                shouldDisableDate={(date) => isAfter(date, new Date())}
                onChange={(value) =>
                  handleChange(
                    "dob",
                    value ? moment(value).format("YYYY-MM-DD") : "",
                  )
                }
              />
            ) : null}
          </InfoItem>

          <InfoItem
            label="Gender"
            value={
              data.gender
                ? char.toTitleCase(data.gender.dictionary_item_name)
                : null
            }
            icon="bi bi-gender-ambiguous"
          >
            {isEdit ? (
              <SelectPicker
                data={gender.map((item) => ({
                  value: item.id,
                  label: char.toTitleCase(item.dictionary_item_name),
                }))}
                value={dataSave.gender}
                placeholder="Select gender"
                block
                cleanable
                onChange={(value) => handleChange("gender", value)}
              />
            ) : null}
          </InfoItem>

          <InfoItem
            label="Address"
            value={data.address ? char.toTitleCase(data.address) : null}
            icon="bi bi-geo-alt"
          >
            {isEdit ? (
              <Input
                value={dataSave.address}
                placeholder="Residential address"
                onChange={(value) => handleChange("address", value)}
              />
            ) : null}
          </InfoItem>
        </div>
      </section>

      {/* CONTACT INFORMATION */}
      <section className="pbz-staff-section">
        <div className="pbz-staff-section-header">
          <div>
            <span>02</span>
            <div>
              <h3>Contact Information</h3>
              <p>How the organisation can reach you.</p>
            </div>
          </div>
        </div>

        <div className="pbz-staff-grid">
          <InfoItem
            label="Phone Number"
            value={data.phone_number}
            icon="bi bi-telephone"
          >
            {isEdit ? (
              <MaskedInput
                mask={phoneNumberMask}
                guide
                keepCharPositions
                value={dataSave.phone_number}
                placeholder="255 774 873-887"
                block
                onChange={(value) => handleChange("phone_number", value)}
              />
            ) : null}
          </InfoItem>

          <InfoItem
            label="Official Email"
            value={data.email}
            icon="bi bi-envelope"
          >
            {isEdit ? (
              <>
                <Input
                  type="email"
                  value={dataSave.email}
                  placeholder="official@email.com"
                  onChange={(value) => {
                    handleChange("email", value);
                    validateEmail(value);
                  }}
                />

                {errorEmail && (
                  <small className="pbz-staff-field-error">
                    Invalid email address
                  </small>
                )}
              </>
            ) : null}
          </InfoItem>

          <InfoItem
            label="Personal Email"
            value={data.personal_email}
            icon="bi bi-envelope-at"
          >
            {isEdit ? (
              <>
                <Input
                  type="email"
                  value={dataSave.personal_email}
                  placeholder="personal@email.com"
                  onChange={(value) => {
                    handleChange("personal_email", value);
                    validateEmail(value);
                  }}
                />

                {errorEmail && (
                  <small className="pbz-staff-field-error">
                    Invalid email address
                  </small>
                )}
              </>
            ) : null}
          </InfoItem>
        </div>
      </section>

      {/* IDENTIFICATION */}
      <section className="pbz-staff-section">
        <div className="pbz-staff-section-header">
          <div>
            <span>03</span>
            <div>
              <h3>Identification</h3>
              <p>Government and employee identification details.</p>
            </div>
          </div>
        </div>

        <div className="pbz-staff-grid">
          <InfoItem
            label="OPF Number"
            value={data.staff_opf}
            icon="bi bi-person-vcard"
          />

          <InfoItem label="ZanID" value={data.zanid} icon="bi bi-card-text">
            {isEdit ? (
              <Input
                value={dataSave.zanid}
                placeholder="ZanID number"
                onChange={(value) => handleChange("zanid", value)}
              />
            ) : null}
          </InfoItem>

          <InfoItem
            label="NIDA Number"
            value={data.nida}
            icon="bi bi-credit-card-2-front"
          >
            {isEdit ? (
              <Input
                value={dataSave.nida}
                placeholder="NIDA number"
                onChange={(value) => handleChange("nida", value)}
              />
            ) : null}
          </InfoItem>
        </div>
      </section>

      {/* NEXT OF KIN */}
      <section className="pbz-staff-section">
        <div className="pbz-staff-section-header">
          <div>
            <span>04</span>
            <div>
              <h3>Next of Kin</h3>
              <p>Emergency contact information.</p>
            </div>
          </div>
        </div>

        <div className="pbz-staff-grid">
          <InfoItem
            label="Next of Kin"
            value={data.next_keen ? char.toTitleCase(data.next_keen) : null}
            icon="bi bi-people"
          >
            {isEdit ? (
              <Input
                value={dataSave.next_keen}
                placeholder="Full name"
                onChange={(value) => handleChange("next_keen", value)}
              />
            ) : null}
          </InfoItem>

          <InfoItem
            label="Contact Number"
            value={data.keen_number}
            icon="bi bi-telephone-forward"
          >
            {isEdit ? (
              <MaskedInput
                mask={phoneNumberMask}
                guide
                keepCharPositions
                value={dataSave.keen_number}
                placeholder="255 774 873-887"
                block
                onChange={(value) => handleChange("keen_number", value)}
              />
            ) : null}
          </InfoItem>
        </div>
      </section>

      {/* EMPLOYMENT */}
      <section className="pbz-staff-section pbz-staff-section-last">
        <div className="pbz-staff-section-header">
          <div>
            <span>05</span>
            <div>
              <h3>Employment Information</h3>
              <p>Your current employment details.</p>
            </div>
          </div>
        </div>

        <div className="pbz-staff-grid">
          <InfoItem
            label="Employment Status"
            value={
              data.employment_status
                ? char.toTitleCase(data.employment_status.dictionary_item_name)
                : null
            }
            icon="bi bi-person-check"
          />

          <InfoItem
            label="Job Title"
            value={
              data.job_title
                ? char.toTitleCase(data.job_title.dictionary_item_name)
                : null
            }
            icon="bi bi-briefcase"
          />

          <InfoItem
            label="Hire Date"
            value={
              data.doh ? moment(data.doh).format("ddd, DD MMM YYYY") : null
            }
            icon="bi bi-calendar-check"
          />
        </div>
      </section>
    </div>
  );
};
