import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { selector } from "../../../api";
import { TableShared } from "../../../shared";
import moment from "moment";
import { Message, useToaster } from "rsuite";
import { char, number } from "../../../utils";
import { hrmsCRUD } from "../../../actions/hrms";
import { LeaveApprove, LeaveReject } from "./add";
import { LeaveAssignment } from "./add";
import { Button, Dropdown, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { LeaveApplicationEdit } from "./add/applicationEdit";



export const LeaveSupervise = (props) => {
  const { prof, branchId, departmentId } = props;
  const user = selector.User();
  const staff = selector.Staff();




  const toaster = useToaster();

  const [assignOpen, setAssignOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staffId] = useState([]);
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState("");
  const [dataInfo, setDataInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [postsPerPage, setePostPerPage] = useState(13);
  const [nextPage, setNextPage] = useState(0);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (staff.id) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadLeaveAssignment(postsPerPage, nextPage, staff.id, value, "-year")
          .then((resp) => {
            setData(resp.data.results);
            setCount(resp.data.count);
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
  }, [staff, postsPerPage, nextPage, page, value, index]);


  const defaultColumns = [
    {
      key: "sn",
      title: "#",
      dataIndex: "sn",
      fixed: true,
      width: 30,
    },
    {
      key: "leave_type",
      title: "Leave Type",
      dataIndex: "leave_type",
      fullText: true,
      width: 100,
    },
    {
      key: "assigned",
      title: "Assigned By",
      dataIndex: "assigned",
      fullText: true,
      width: 120,
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
      title: "Leave Days",
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
              record.sts === 46 && {
                label: "Approve",
                key: "approve",
                icon: <i className="bi bi-check-all fs-5"></i>,
              },
              record.sts === 46 && {
                label: "Assign",
                key: "assign",
                icon: <i className="bi bi-caret-right fs-5"></i>,
              },
              record.sts === 46 && {
                label: "Reject",
                key: "reject",
                icon: <i className="bi bi-caret-left fs-5"></i>,
              },
              record.sts === 48 && {
                label: "Cancel",
                key: "cancel",
                icon: <i className="bi bi-x-circle fs-5"></i>,
              },
            ],
            onClick: (event) => {
              switch (event.key) {
                case "approve":
                  setApproveOpen(true);
                  setDataId(record.id);
                  setDataInfo(record.info);
                  break;
                case "assign":
                  setAssignOpen(true);
                  setDataId(record.id);
                  setDataInfo(record.info);
                  break;
                case "reject":
                  setRejectOpen(true);
                  setDataId(record.id);
                  setDataInfo(record.info);
                  break;
                case "edit":
                  setOpenEdit(true);
                  setDataId(record.id);
                  setDataInfo(record.info);
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
    id: dt.leave?.id,
    info: dt,
    sts: dt.leave?.status ? dt.leave?.status.id : 0,
    sn: i + 1,
    statusId: dt.status && dt.status.id,
    leave_type: dt.leave?.leave_type
      ? char.toTitleCase(dt.leave?.leave_type.name)
      : "N/A",
    assigned: dt?.assigned_by
      ? char.toTitleCase(dt.assigned_by?.full_name)
      : "N/A",
    start_date: dt.leave?.start_date
      ? moment(dt.leave?.start_date).format("ddd. DD MMM YYYY")
      : "N/A",
    end_date: dt.leave?.end_date
      ? moment(dt.leave?.end_date).format("ddd. DD MMM YYYY")
      : "N/A",
    return_date: dt.leave?.return_date
      ? moment(dt.leave?.return_date).format("ddd. DD MMM YYYY")
      : "N/A",
    working_days: dt.leave?.working_days
      ? number.fNumber(dt.leave?.working_days) + " days"
      : "N/A",
    total_days: dt.leave?.total_days
      ? number.fNumber(dt.leave?.total_days) + " days"
      : "N/A",
    status: dt.leave?.status ? (
      dt.leave?.status.id === 47 ? (
        <span class="badge bg-success rounded-pill">
          {char.toTitleCase(dt.leave?.status.dictionary_item_name)}
        </span>
      ) : (
        <span class="badge bg-primary rounded-pill">
          {char.toTitleCase(dt.leave?.status.dictionary_item_name)}
        </span>
      )
    ) : (
      <span class="badge bg-danger rounded-pill">{"Unknown"}</span>
    ),
  }));

  return (
    <>
      <LeaveApprove
        setOpen={setApproveOpen}
        open={approveOpen}
        index={index}
        setIndex={setIndex}
        dataId={dataId}
        dataInfo={dataInfo}
      />
      <LeaveAssignment
        setOpen={setAssignOpen}
        open={assignOpen}
        index={index}
        setIndex={setIndex}
        dataId={dataId}
        dataInfo={dataInfo}
      />
      <LeaveReject
        setOpen={setRejectOpen}
        open={rejectOpen}
        index={index}
        setIndex={setIndex}
        dataId={dataId}
        dataInfo={dataInfo}
      />
      <LeaveApplicationEdit
        open={openEdit}
        setOpen={setOpenEdit}
        index={index}
        setIndex={setIndex}
        dataId={dataId}
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
        button={null}
        link={"#"}
        showButton={true}
        setLoading={setLoading}
        scroll={1000}
      />
    </>
  );
};
