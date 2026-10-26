import { useEffect, useState } from "react";
import { Message, useToaster } from "rsuite";
import { char, number, PDFPreviewer } from "../../../utils";
import moment from "moment";
import { TableShared } from "../../../shared";
import { hrmsCRUD } from "../../../actions/hrms";
import { StaffQualificationAdd } from "./add/addQualification";

export const QualificationInfo = (props) => {
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
          .loadStaffQualification(
            postsPerPage,
            nextPage,
            dataId,
            "",
            value,
            "-id",
          )
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
      key: "doc",
      title: "Document",
      dataIndex: "doc",
      fullText: true,
      width: 120,
    },
    {
      key: "qualification_type",
      title: "Qualification Type",
      dataIndex: "qualification_type",
      fullText: true,
      flexGrow: 1,
    },
    {
      key: "name",
      title: "Qualification Name",
      dataIndex: "name",
      fullText: true,
      flexGrow: 1,
    },
    {
      key: "ended_year",
      title: "End Year",
      dataIndex: "ended_year",
      fullText: true,
      width: 120,
    },
  ];

  const dataItem = data?.map((dt, i) => ({
    id: dt.id,
    sn: i + 1,
    doc: dt.qualification_doc ? (
      <PDFPreviewer base64Data={dt.qualification_doc} />
    ) : (
      "N/A"
    ),
    qualification_type: dt.qualification_type
      ? char.toTitleCase(dt.qualification_type.dictionary_item_name)
      : "N/A",
    name: dt.name ? char.toTitleCase(dt.name) : "N/A",
    ended_year: dt.ended_year ? dt.ended_year : "N/A",
  }));

  const button = (
    <>
      <button className="pbz-app-btn pbz-btn-add" onClick={() => setOpen(true)}>
        <span className="bi bi-plus-circle la-lg"></span> &nbsp; New
        Qualification
      </button>
    </>
  );

  return (
    <>
      <StaffQualificationAdd
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
