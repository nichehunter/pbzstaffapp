import { useEffect, useState } from "react";
import { Message, useToaster } from "rsuite";
import { char, number, PDFPreviewer } from "../../../utils";
import moment from "moment";
import { TableShared } from "../../../shared";
import { hrmsCRUD } from "../../../actions/hrms";
import { StaffQualificationAdd } from "./add/addQualification";
import { StaffDocumentAdd } from "./add/addDocument";

export const DocumentInfo = (props) => {
  const { dataId } = props;
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [postsPerPage, setePostPerPage] = useState(10);
  const [nextPage, setNextPage] = useState(0);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dataId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffDocument(postsPerPage, nextPage, dataId, "", value, "-id")
          .then((resp) => {
            setData(resp.data.results);
            setCount(resp.data.count);
          })
          .catch((error) => {
            toaster.push(
              <Message showIcon type={"error"} closable>
                {error.message}
              </Message>,
              { placement: "topCenter", duration: 7000 },
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    }
  }, [postsPerPage, nextPage, dataId, value, index]);

  const defaultColumns = [
    {
      key: "sn",
      title: "#",
      dataIndex: "sn",
      fixed: true,
      width: 70,
    },
    {
      key: "file",
      title: "File",
      dataIndex: "file",
      sortable: true,
      width: 150,
    },
    {
      key: "document_type",
      title: "Document Type",
      dataIndex: "document_type",
      fullText: true,
      flexGrow: 1,
    },
    {
      key: "document_name",
      title: "Name",
      dataIndex: "document_name",
      fullText: true,
      flexGrow: 1,
    },
  ];

  const dataItem = data?.map((dt, i) => ({
    id: dt.id,
    sn: i + 1,
    file: dt.document_file ? (
      <PDFPreviewer base64Data={dt.document_file} />
    ) : (
      "N/A"
    ),
    document_type: dt.document_type
      ? char.toTitleCase(dt.document_type.dictionary_item_name)
      : "N/A",
    document_name: dt.document_name
      ? char.toTitleCase(dt.document_name)
      : "N/A",
  }));

  const button = (
    <>
      <button className="pbz-app-btn pbz-btn-add" onClick={() => setOpen(true)}>
        <span className="bi bi-plus-circle la-lg"></span> &nbsp; New Document
      </button>
    </>
  );

  return (
    <>
      <StaffDocumentAdd
        open={open}
        setOpen={setOpen}
        index={index}
        setIndex={setIndex}
        dataId={dataId}
      />
      <TableShared
        setOpen={null}
        data={dataItem}
        loading={loading}
        setData={setData}
        page={page}
        setPage={setPage}
        count={count}
        postsPerPage={postsPerPage}
        setePostPerPage={setePostPerPage}
        setNextPage={setNextPage}
        value={value}
        setValue={setValue}
        defaultColumns={defaultColumns}
        button={button}
        link={"#"}
        showButton={true}
        setLoading={setLoading}
        scroll={1000}
      />
    </>
  );
};
