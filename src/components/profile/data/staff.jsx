import { useEffect, useState } from "react";
import { DatePicker, Input, Loader, MaskedInput, Message, SelectPicker, useToaster } from "rsuite";
import { char } from "../../../utils";
import moment from "moment";
import isAfter from "date-fns/isAfter";
import { hrmsCRUD } from "../../../actions/hrms";


export const StaffInfo = (props) => {
  const { dataId } = props;
  const toaster = useToaster();
  const [isEdit, setIsEdit] = useState(false);
  const [gender, setGender] = useState([]);
  const [idType, setIdType] = useState([]);
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
    id_type: "",
    id_number: "",
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
    setTimeout(() => {
      hrmsCRUD
        .loadDictionaryData(5, 0, "", 1)
        .then((resp) => {
          setGender(resp.data.results);
        })
        .catch(() => ({}));
      hrmsCRUD
        .loadDictionaryData(10, 0, "", 5)
        .then((resp) => {
          setIdType(resp.data.results);
        })
        .catch(() => ({}));
      hrmsCRUD
        .loadDictionaryData(20, 0, "", 6)
        .then((resp) => {
          setTitle(resp.data.results);
        })
        .catch(() => ({}));
      hrmsCRUD
        .loadDictionaryData(20, 0, "", 7)
        .then((resp) => {
          setStatus(resp.data.results);
        })
        .catch(() => ({}));
    }, 500);
  }, [dataId]);

  useEffect(() => {
    if (dataId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffDetails(dataId)
          .then((resp) => {
            setData(resp.data);
            setDataSave({
              code: resp.data.code || "",
              full_name: resp.data.full_name || "",
              dob: resp.data.dob || "",
              gender: resp.data.gender ? resp.data.gender.id : "",
              address: resp.data.address || "",
              phone_number: resp.data.phone_number || "",
              email: resp.data.email || "",
              zanid: resp.data.zanid ? resp.data.zanid.id : "",
              nida: resp.data.nida ? resp.data.nida : "",
              next_keen: resp.data.next_keen || "",
              keen_number: resp.data.keen_number || "",
              personal_email: resp.data.personal_email || "",
              employment_status: resp.data.employment_status
                ? resp.data.employment_status.id
                : "",
              job_title: resp.data.job_title ? resp.data.job_title.id : "",
              doh: resp.data.doh || "",
            });
          })
          .catch((error) => {
            toaster.push(
              <Message showIcon type={"error"} closable>
                {error.message}
              </Message>,
              { placement: "topCenter", duration: 7000 }
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    }
  }, [dataId, index]);

  const handleChange = (field, value) => {
    setDataSave((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      hrmsCRUD
        .updateStaff(dataId, dataSave)
        .then(() => {
          toaster.push(
            <Message type="success" showIcon header={"Success"} closable>
              <p className="h6">
                <p className="fw-bold fs-14">Thank you...!</p>
                <p className="text-dark fs-12">
                  Staff has been updated successfully.
                </p>
              </p>
            </Message>,
            { placement: "topEnd", duration: 7000 }
          );
          setIsEdit(false);
          setIndex(index + 1);
        })
        .catch((error) => {
          toaster.push(
            <Message type="error" showIcon header={"Error"} closable>
              <p className="h6">
                <p className="fw-bold fs-14">Oooh Sorry...!</p>
                <p className="text-dark fs-12">{error}.</p>
              </p>
            </Message>,
            { placement: "topEnd", duration: 7000 }
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };
  return (
    <>
      {loading ? (
        <Loader
          backdrop
          size="md"
          speed="slow"
          content="Please wait..."
          className="p-5"
        />
      ) : (
        <>
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">OPF</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.staff_opf ? data.staff_opf : "N/A"}
            </div>
            <div className="col-md-5 col-sm-2 ps-5">
              {!isEdit ? (
                <button
                  className="btn btn-light"
                  onClick={() => setIsEdit(!isEdit)}
                >
                  <i className="bi bi-pencil-square" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEdit(!isEdit)}
                    type="button"
                    className="btn btn-soft-danger btn-label waves-effect waves-light rounded-pill me-3"
                  >
                    <i class="ri-forbid-line label-icon align-middle rounded-pill fs-16 me-2"></i>{" "}
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    type="button"
                    className="btn btn-soft-success btn-label waves-effect waves-light rounded-pill"
                    disabled={loading || errorEmail}
                  >
                    {!loading && (
                      <span className="indicator-label">
                        <i class="ri-check-double-line label-icon align-middle rounded-pill fs-16 me-2"></i>{" "}
                        Save
                      </span>
                    )}
                    {loading && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        Please wait...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Full Name</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-5">
              {data.full_name
                ? char.toTitleCase(data.code) +
                  " " +
                  char.toUpperCase(data.full_name)
                : "N/A"}
            </div>
            {isEdit && (
              <>
                <div className="col-md-1 col-sm-1">
                  <SelectPicker
                    data={[
                      { value: "prof.", label: "Prof" },
                      { value: "dr.", label: "Dr" },
                      { value: "eng.", label: "Eng" },
                      { value: "mr.", label: "Mr" },
                      { value: "mrs.", label: "Mrs" },
                      { value: "ms.", label: "Ms" },
                    ]}
                    placeholder="Select code"
                    onChange={(e) => handleChange("code", e)}
                    block={true}
                  />
                </div>
                <div className="col-md-3 col-sm-2">
                  <Input
                    onChange={(e) => handleChange("full_name", e)}
                    placeholder="Full Name"
                    type="text"
                  />
                </div>
              </>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Birth Date</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.dob ? moment(data.dob).format("ddd DD MMM YYYY") : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <DatePicker
                  type="text"
                  size="md"
                  className="w-100"
                  oneTap
                  onChange={(e) =>
                    handleChange("dob", moment(e).format("YYYY-MM-DD"))
                  }
                  shouldDisableDate={(date) => isAfter(date, new Date())}
                />
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Gender</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.gender
                ? char.toUpperCase(data.gender.dictionary_item_name)
                : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <SelectPicker
                  data={gender?.map((dt) => ({
                    value: dt.id,
                    label: char.toTitleCase(dt.dictionary_item_name),
                  }))}
                  placeholder="Select gender"
                  onChange={(e) => handleChange("gender", e)}
                  block={true}
                />
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Address</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.address ? char.toUpperCase(data.address) : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <Input
                  onChange={(e) => handleChange("address", e)}
                  placeholder="Address"
                  type="text"
                  className="form-control form-control-sm"
                />
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Phone Number</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.phone_number ? data.phone_number : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <MaskedInput
                  mask={phoneNumberMask}
                  guide={true}
                  keepCharPositions={true}
                  placeholder={"255 774 873-887"}
                  block={true}
                  onChange={(e) => handleChange("phone_number", e)}
                />
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Email address</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.email ? data.email : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <Input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="email@email.email"
                  onChange={(e) => {
                    handleChange("email", e);
                    validateEmail(e);
                  }}
                />
                {errorEmail && (
                  <div className="">
                    <span
                      role="alert"
                      className="text-danger fs-12 fw-light h6"
                    >
                      Invalid email address
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Personal Email</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.personal_email ? data.personal_email : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <Input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="email@email.email"
                  onChange={(e) => {
                    handleChange("personal_email", e);
                    validateEmail(e);
                  }}
                />
                {errorEmail && (
                  <div className="">
                    <span
                      role="alert"
                      className="text-danger fs-12 fw-light h6"
                    >
                      Invalid email address
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">ZanID</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.zanid ? data.zanid : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <Input
                  onChange={(e) => handleChange("zanid", e)}
                  placeholder="ZanID Number"
                  type="text"
                  className="form-control form-control-sm"
                />
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Nida</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.nida ? data.nida : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <Input
                  onChange={(e) => handleChange("nida", e)}
                  placeholder="Nida Number"
                  type="text"
                  className="form-control form-control-sm"
                />
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Next of Keen</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.next_keen ? char.toUpperCase(data.next_keen) : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <Input
                  onChange={(e) => handleChange("next_keen", e)}
                  placeholder="Next of Keen"
                  type="text"
                  className="form-control form-control-sm"
                />
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Next of Keen Phone</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.keen_number ? char.toUpperCase(data.keen_number) : "N/A"}
            </div>
            {isEdit && (
              <div className="col-md-4 col-sm-2">
                <MaskedInput
                  mask={phoneNumberMask}
                  guide={true}
                  keepCharPositions={true}
                  placeholder={"255 774 873-887"}
                  block={true}
                  onChange={(e) => handleChange("keen_number", e)}
                />
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Employment Status</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.employment_status
                ? char.toUpperCase(data.employment_status.dictionary_item_name)
                : "N/A"}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Job Title</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.job_title
                ? char.toUpperCase(data.job_title.dictionary_item_name)
                : "N/A"}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-2 col-sm-3">
              <span className="fw-bold">Hire Date</span>
            </div>
            <div className="col-md-1 col-sm-1">
              <span className="fw-bold">:</span>
            </div>
            <div className="col-md-4 col-sm-6">
              {data.dob ? moment(data.doh).format("ddd DD MMM YYYY") : "N/A"}
            </div>
          </div>
        </>
      )}
    </>
  );
};
