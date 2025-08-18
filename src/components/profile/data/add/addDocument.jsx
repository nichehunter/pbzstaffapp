import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Message,
  Modal,
  SelectPicker,
  useToaster,
} from "rsuite";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import * as Yup from "yup";
import { char } from "../../../../utils";
import { ErrorMessage, FieldArray, Formik, Form, getIn, Field } from "formik";
import { useDropzone } from "react-dropzone";

import { selector } from "../../../../api";
import { hrmsCRUD } from "../../../../actions/hrms";

const initialValues = {
  documents: [
    {
      document_type: "",
      document_file: "",
      document_name: "",
    },
  ],
};

const documentSchema = Yup.object().shape({
  documents: Yup.array().of(
    Yup.object().shape({
      document_type: Yup.string().required("This field is required"),
      document_file: Yup.string().required("This field is required"),
    })
  ),
});

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const StaffDocumentAdd = (props) => {
  const { open, setOpen, dataId, index, setIndex } = props;

  const toaster = useToaster();
  const user = selector.User();

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState([]);
  const [value, setValue] = useState("");
  const [staffDocuments] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      hrmsCRUD
        .loadDictionaryData(15, 0, value, 9)
        .then((resp) => {
          setType(resp.data.results);
        })
        .finally(() => {});
    }, 500);
  }, [value]);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      const { documents } = values;

      for (let i = 0; i < documents.length; i++) {
        const data = {
          document_file: documents[i].document_file,
          document_name: documents[i].document_name,
          document_type: documents[i].document_type,
          staff: dataId,
          recorded_by: user.username,
        };
        staffDocuments.push(data);
      }

      hrmsCRUD
        .addStaffDocument(staffDocuments)
        .then(() => {
          toaster.push(
            <Message type="success" showIcon header={"Success"} closable>
              <p className="h6">
                <p className="fw-bold fs-14">Thank you...!</p>
                <p className="text-dark fs-12">
                  Your document has been added successfully.
                </p>
              </p>
            </Message>,
            { placement: "topEnd", duration: 7000 }
          );

          setIndex(index + 1);
          setLoading(false);
          setOpen(false);
        })
        .catch((error) => {
          setLoading(false);
          toaster.push(
            <Message type="error" showIcon header={"Error"} closable>
              <p className="h6">
                <p className="fw-bold fs-14">Oooh Sorry...!</p>
                <p className="text-dark fs-12">{error}.</p>
              </p>
            </Message>,
            { placement: "topEnd", duration: 7000 }
          );
        });
    }, 500);
  };

  const DropzoneField = ({ field, form }) => {
    const onDrop = async (acceptedFiles) => {
      setLoading(true);
      const filteredFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      if (filteredFiles.length !== acceptedFiles.length) {
        toaster.push(
          <Message type="error" showIcon header={"Error"} closable>
            <p className="h6">
              <p className="fw-bold fs-14">Oooh Sorry...!</p>
              <p className="text-dark fs-12">
                {"Only PDF Doc is accepted here"}.
              </p>
            </p>
          </Message>,
          { placement: "topEnd", duration: 7000 }
        );
        setLoading(false);
      } else {
        const file = acceptedFiles[0];
        const base64File = await toBase64(file);
        form.setFieldValue(field.name, base64File);
        form.setFieldValue(
          `${field.name.replace("document_file", "document_name")}`,
          file.name
        );
        form.setFieldValue(`${field.name}_name`, file.name);
        setLoading(false);
      }
    };

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      maxFiles: 1,
    });

    const error = getIn(form.errors, field.name);
    const touch = getIn(form.touched, field.name);

    return (
      <>
        <div {...getRootProps()} style={dropzoneStyles}>
          <input {...getInputProps()} />
          {getIn(form.values, `${field.name}_name`) ? (
            <p>{getIn(form.values, `${field.name}_name`)}</p>
          ) : (
            <p>Drop a file, or click to select </p>
          )}
        </div>
        {error && touch && (
          <div role="alert" className="text-danger mt-2">
            {error}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} size="lg">
        <Modal.Header>
          <Modal.Title>New Document</Modal.Title>
        </Modal.Header>
        <Divider />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={documentSchema}
        >
          {({ setFieldValue, resetForm, isSubmitting, values }) => (
            <Form>
              <Modal.Body>
                <div className="container">
                  <div className="row mb-2">
                    <div className="col-12">
                      <div className="modal-body" style={{ marginTop: 1 }}>
                        <FieldArray name="documents">
                          {({ remove, push }) => (
                            <div>
                              <div className="row mb-2">
                                <div className="col-12 text-end">
                                  <Button
                                    type="button"
                                    size="sm"
                                    appearance="primary"
                                    color="blue"
                                    startIcon={<AddOutlineIcon />}
                                    onClick={() =>
                                      push({
                                        document_type: "",
                                        document_file: "",
                                        document_name: "",
                                      })
                                    }
                                  >
                                    <span>add row</span>
                                  </Button>
                                  <hr />
                                </div>
                              </div>

                              {values.documents.length > 0 &&
                                values.documents.map((_, i) => (
                                  <>
                                    <div key={i} className="mb-3">
                                      <div className="row mb-2">
                                        <div
                                          className={
                                            values.documents.length > 1
                                              ? "form-group col-md-5 col-sm-12"
                                              : "form-group col-md-6 col-sm-12"
                                          }
                                        >
                                          <label className="form-label mb-2">
                                            Document type{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="input-field">
                                            <SelectPicker
                                              data={type?.map((dt) => ({
                                                value: dt.id,
                                                label: char.toTitleCase(
                                                  dt.dictionary_item_name
                                                ),
                                              }))}
                                              placeholder="Select field"
                                              onChange={(e) =>
                                                setFieldValue(
                                                  `documents.${i}.document_type`,
                                                  e
                                                )
                                              }
                                              onSearch={(e) => {
                                                setValue(e);
                                              }}
                                              block={true}
                                            />
                                          </div>
                                          <div className="fv-plugins-message-container mt-2">
                                            <span
                                              role="alert"
                                              className="text-danger"
                                            >
                                              <ErrorMessage
                                                name={`documents.${i}.document_type`}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                        <div
                                          className={
                                            values.documents.length > 1
                                              ? "form-group col-md-6 col-sm-12"
                                              : "form-group col-md-6 col-sm-12"
                                          }
                                        >
                                          <label className="form-label mb-2">
                                            Document PDF{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <Field
                                            name={`documents.${i}.document_file`}
                                            component={DropzoneField}
                                          />
                                        </div>

                                        <div
                                          className="col-md-1 text-right"
                                          style={{ marginTop: 28 }}
                                        >
                                          {values.documents.length > 1 && (
                                            <>
                                              <button
                                                type="button"
                                                className="btn btn-soft-danger btn-block mt-2"
                                                onClick={() => remove(i)}
                                              >
                                                <i className="bi bi-dash-circle la-lg"></i>
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ))}
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Divider style={{ marginTop: -10 }} />
              <Modal.Footer>
                <div className="container">
                  <div className="row">
                    <div className="col-md-6 col-sm-12 d-flex justify-content-start">
                      <span className="fs-18 text-danger"> * &nbsp;</span>{" "}
                      Reuired field
                    </div>
                    <div className="col-md-6 col-sm-12 d-flex justify-content-end">
                      <button
                        onClick={() => setOpen(false)}
                        className="btn btn-soft-danger me-3"
                      >
                        <span className="bi bi-slash-circle"></span> Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-soft-success"
                        disabled={isSubmitting || loading}
                      >
                        {!loading && (
                          <span className="indicator-label">
                            <span className="bi bi-check-circle"></span> Save
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
                    </div>
                  </div>
                </div>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

const dropzoneStyles = {
  border: "1px dashed #e3f3fb",
  borderRadius: "5px",
  padding: "9px",
  textAlign: "center",
  cursor: "pointer",
};
