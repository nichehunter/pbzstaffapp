import { useEffect, useState } from "react";
import { Button, Dropdown, Space, notification } from "antd";
import {
  MoreOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { char } from "../../../utils";
import { TableShared } from "../../../shared";
import { IncidenceAdd } from "./add";
import { selector } from "../../../api";
import { riskCRUD } from "../../../actions/risk";

const items = [
  {
    label: "Edit",
    key: "edit",
    icon: <EditOutlined />,
  },
  {
    label: "View",
    key: "view",
    icon: <EyeOutlined />,
  },
  {
    label: "Delete",
    key: "delete",
    icon: <DeleteOutlined />,
  },
];

export const IncidenceReport = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [postsPerPage, setePostPerPage] = useState(10);
  const [nextPage, setNextPage] = useState(0);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);

  let navigate = useNavigate();

  const user = selector.User();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      riskCRUD
        .loadMyIncidence(postsPerPage, nextPage, user.username, value, "-id")
        .then((resp) => {
          setData(resp.data.results);
          setCount(resp.data.count);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  }, [user, postsPerPage, nextPage, page, value, index]);

  const defaultColumns = [
    {
      key: "sn",
      title: "#",
      dataIndex: "sn",
      fixed: true,
      width: 150,
    },
    {
      key: "incidence",
      title: "Incidence",
      dataIndex: "incidence",
      sortable: true,
      flexGrow: 1,
    },
    {
      key: "subject",
      title: "Subject",
      dataIndex: "subject",
      sortable: true,
      flexGrow: 1,
    },
    {
      key: "start",
      title: "Start Date",
      dataIndex: "start",
      sortable: true,
      flexGrow: 1,
    },
    {
      key: "end",
      title: "End Date",
      dataIndex: "end",
      sortable: true,
      flexGrow: 1,
    },
    {
      key: "priority",
      title: "Priority",
      dataIndex: "priority",
      sortable: true,
      flexGrow: 1,
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      sortable: true,
      flexGrow: 1,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (record) => (
        <Dropdown
          menu={{
            items,
            onClick: (event) => {
              switch (event.key) {
                case "view":
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
            <Button type="dashed" icon={<MoreOutlined />} size={"middle"} />
          </Space>
        </Dropdown>
      ),
    },
  ];

  const dataItem = data?.map((dt, i) => ({
    id: dt.id,
    sn: i + 1,
    incidence: dt.instance
      ? char.toUpperCase(dt.instance.dictionary_item_name)
      : "N/A",
    subject: dt.subject ? char.toUpperCase(dt.subject) : "N/A",
    start: dt.start_time
      ? moment(dt.start_time).format("ddd DD MMM YYYY | HH:mm:ss")
      : "N/A",
    end: dt.end_time
      ? moment(dt.end_time).format("ddd DD MMM YYYY | HH:mm:ss")
      : "N/A",
    priority: dt.priority ? (
      dt.priority === "low" ? (
        <span class="badge badge-soft-success badge-border">
          {char.toUpperCase(dt.priority)}
        </span>
      ) : dt.priority === "normal" ? (
        <span class="badge badge-soft-info badge-border">
          {char.toUpperCase(dt.priority)}
        </span>
      ) : dt.priority === "high" ? (
        <span class="badge badge-soft-warning badge-border">
          {char.toUpperCase(dt.priority)}
        </span>
      ) : (
        <span class="badge badge-soft-danger badge-border">
          {char.toUpperCase(dt.priority)}
        </span>
      )
    ) : (
      "N/A"
    ),
    status: (
      <span class="badge badge-soft-secondary">
        {char.toUpperCase(dt.status)}
      </span>
    ),
  }));

  const button = (
    <>
      <button
        className="btn btn-soft-info btn-border"
        onClick={() => setOpen(true)}
      >
        <span className="bi bi-plus-circle la-lg"></span> &nbsp; New Incidence
        Report
      </button>
    </>
  );

  return (
    <>
      <IncidenceAdd
        open={open}
        setOpen={setOpen}
        index={index}
        setIndex={setIndex}
      />
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-12">
            <p className="h3 text-dark" style={{ marginTop: -70 }}>
              Incidence Report
            </p>
          </div>
          <hr className="mt-3" />
        </div>
        <TableShared
          setOpen={setOpen}
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
          button={button}
          link={"#"}
          showButton={true}
          setLoading={setLoading}
        />
      </div>
    </>
  );
};
