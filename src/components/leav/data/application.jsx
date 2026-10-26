import { useEffect, useState } from "react";
import { Message, useToaster } from "rsuite";
import { char, number } from "../../../utils";
import moment from "moment";
import { TableShared } from "../../../shared";
import { hrmsCRUD } from "../../../actions/hrms";
import { LeaveApplicationAdd } from "./add";
import { selector } from "../../../api";
import { Button, Dropdown, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { LeaveApplicationEdit } from "./add/applicationEdit";
import { LeaveApplicationPrint } from "./add/applicationPrint";

export const LeaveApplication = (props) => {
  const { dataId } = props;
  const toaster = useToaster();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [leaveId, setLeaveId] = useState(null);
  const [countLeave, setCountLeave] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [postsPerPage, setePostPerPage] = useState(10);
  const [nextPage, setNextPage] = useState(0);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);
  const roles = selector.Roles();

  useEffect(() => {
    if (dataId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadLeaveApplication(
            postsPerPage,
            nextPage,
            dataId,
            "",
            value,
            "-year",
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
  }, [index, postsPerPage, nextPage, dataId, value]);

  useEffect(() => {
    if (dataId) {
      setTimeout(() => {
        hrmsCRUD
          .loadLeaveApplication(2, 0, dataId, true, value, "-year")
          .then((resp) => {
            setCountLeave(resp.data.count);
          })
          .catch((error) => {});
      }, 500);
    }
  }, [dataId, index]);

  const defaultColumns = [
    {
      key: "sn",
      title: "#",
      dataIndex: "sn",
      fixed: true,
      width: 50,
    },
    {
      key: "leave_type",
      title: "Leave Type",
      dataIndex: "leave_type",
      fullText: true,
      width: 130,
    },
    {
      key: "start_date",
      title: "Start Date",
      dataIndex: "start_date",
      fullText: true,
      width: 80,
    },
    {
      key: "end_date",
      title: "End Date",
      dataIndex: "end_date",
      fullText: true,
      width: 80,
    },
    {
      key: "return_date",
      title: "Return Date",
      dataIndex: "return_date",
      fullText: true,
      width: 80,
    },
    {
      key: "working_days",
      title: "Working Days",
      dataIndex: "working_days",
      fullText: true,
      width: 70,
    },
    {
      key: "total_days",
      title: "Total Days",
      dataIndex: "total_days",
      fullText: true,
      width: 60,
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      sortable: true,
      width: 50,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      align: "center",
      width: 50,
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              record.sts === 46 && {
                label: "Edit",
                key: "edit",
                icon: <i className="bi bi-pencil-square fs-5"></i>,
              },
              record.sts === 48 && {
                label: "Print",
                key: "print",
                icon: <i className="bi bi-printer fs-5"></i>,
              },
            ],
            onClick: (event) => {
              switch (event.key) {
                case "edit":
                  setOpenEdit(true);
                  setLeaveId(record.id);
                  break;
                case "print":
                  setOpenPrint(true);
                  setLeaveId(record.id);
                  break;
                default:
              }
            },
          }}
          trigger={["click"]}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Space>
            <Button type="dashed" icon={<MoreOutlined />} size={"small"} />
          </Space>
        </Dropdown>
      ),
    },
  ];

  const dataItem = data?.map((dt, i) => ({
    id: dt.id,
    sts: dt.status ? dt.status.id : 0,
    sn: i + 1,
    leave_type: dt.leave_type ? char.toTitleCase(dt.leave_type.name) : "N/A",
    start_date: dt.start_date
      ? moment(dt.start_date).format("ddd. DD MMM YYYY")
      : "N/A",
    end_date: dt.end_date
      ? moment(dt.end_date).format("ddd. DD MMM YYYY")
      : "N/A",
    return_date: dt.return_date
      ? moment(dt.return_date).format("ddd. DD MMM YYYY")
      : "N/A",
    working_days: dt.working_days ? number.fNumber(dt.working_days) : "N/A",
    total_days: dt.total_days ? number.fNumber(dt.total_days) : "N/A",
    status: dt.status ? (
      dt.status.id === 53 ? (
        <span class="badge bg-info ">
          {char.toTitleCase(dt.status.dictionary_item_name)}
        </span>
      ) : dt.status.id === 47 ? (
        <span class="badge bg-success ">
          {char.toTitleCase(dt.status.dictionary_item_name)}
        </span>
      ) : (
        <span class="badge bg-warning ">
          {char.toTitleCase(dt.status.dictionary_item_name)}
        </span>
      )
    ) : (
      <span class="badge bg-danger ">{"Unknown"}</span>
    ),
  }));

  const button = roles.includes("can_add_leave") ? (
    <>
      <button className="pbz-app-btn pbz-btn-add" onClick={() => setOpen(true)}>
        <span className="bi bi-plus-circle"></span> &nbsp; New Application
      </button>
    </>
  ) : null;

  return (
    <>
      <LeaveApplicationAdd
        open={open}
        setOpen={setOpen}
        index={index}
        setIndex={setIndex}
        dataId={dataId}
      />
      <LeaveApplicationEdit
        open={openEdit}
        setOpen={setOpenEdit}
        index={index}
        setIndex={setIndex}
        dataId={leaveId}
      />
      <LeaveApplicationPrint
        open={openPrint}
        setOpen={setOpenPrint}
        dataId={leaveId}
      />
      <TableShared
        setOpen={null}
        loading={loading}
        data={dataItem}
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
        button={!countLeave ? button : null}
        link={"#"}
        showButton={true}
        setLoading={setLoading}
        scroll={1000}
      />
    </>
  );
};
