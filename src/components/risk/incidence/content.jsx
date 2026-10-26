import { useEffect, useState } from "react";
import { Button, Dropdown, Space } from "antd";
import {
  MoreOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  WarningOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { char } from "../../../utils";
import { TableShared } from "../../../shared";
import { IncidenceAdd } from "./add";
import { selector } from "../../../api";
import { riskCRUD } from "../../../actions/risk";
import "../style/incidence.css";

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

  const navigate = useNavigate();
  const user = selector.User();

  useEffect(() => {
    if (!user?.username) return;

    setLoading(true);

    const timer = setTimeout(() => {
      riskCRUD
        .loadMyIncidence(postsPerPage, nextPage, user.username, value, "-id")
        .then((resp) => {
          setData(resp.data.results || []);
          setCount(resp.data.count || 0);
        })
        .catch(() => {
          setData([]);
          setCount(0);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [user?.username, postsPerPage, nextPage, value, index]);

  const getPriority = (priority) => {
    const normalized = String(priority || "").toLowerCase();

    switch (normalized) {
      case "low":
        return {
          label: "Low",
          className: "pbz-incidence-priority-low",
        };

      case "normal":
        return {
          label: "Normal",
          className: "pbz-incidence-priority-normal",
        };

      case "high":
        return {
          label: "High",
          className: "pbz-incidence-priority-high",
        };

      case "critical":
        return {
          label: "Critical",
          className: "pbz-incidence-priority-critical",
        };

      default:
        return {
          label: priority || "N/A",
          className: "pbz-incidence-priority-default",
        };
    }
  };

  const getStatus = (status) => {
    const normalized = String(status || "").toLowerCase();

    switch (normalized) {
      case "open":
        return {
          label: "Open",
          className: "pbz-incidence-status-open",
        };

      case "pending":
        return {
          label: "Pending",
          className: "pbz-incidence-status-pending",
        };

      case "resolved":
        return {
          label: "Resolved",
          className: "pbz-incidence-status-resolved",
        };

      case "closed":
        return {
          label: "Closed",
          className: "pbz-incidence-status-closed",
        };

      case "rejected":
        return {
          label: "Rejected",
          className: "pbz-incidence-status-rejected",
        };

      default:
        return {
          label: status || "Unknown",
          className: "pbz-incidence-status-default",
        };
    }
  };

  const defaultColumns = [
    {
      key: "sn",
      title: "#",
      dataIndex: "sn",
      fixed: true,
      width: 65,
      align: "center",
    },
    {
      key: "incidence",
      title: "Incidence",
      dataIndex: "incidence",
      sortable: true,
      flexGrow: 1.3,
      minWidth: 160,
    },
    {
      key: "subject",
      title: "Subject",
      dataIndex: "subject",
      sortable: true,
      flexGrow: 1.5,
      minWidth: 180,
    },
    {
      key: "start",
      title: "Start Date",
      dataIndex: "start",
      sortable: true,
      flexGrow: 1,
      minWidth: 155,
    },
    {
      key: "end",
      title: "End Date",
      dataIndex: "end",
      sortable: true,
      flexGrow: 1,
      minWidth: 155,
    },
    {
      key: "priority",
      title: "Priority",
      dataIndex: "priority",
      sortable: true,
      width: 110,
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      sortable: true,
      width: 110,
    },
  ];

  const dataItem = data?.map((dt, i) => {
    const priority = getPriority(dt.priority);
    const status = getStatus(dt.status);

    return {
      id: dt.id,

      sn: i + 1,

      incidence: dt.instance
        ? char.toUpperCase(dt.instance.dictionary_item_name)
        : "N/A",

      subject: dt.subject ? char.toUpperCase(dt.subject) : "N/A",

      start: dt.start_time
        ? moment(dt.start_time).format("DD MMM YYYY, HH:mm")
        : "N/A",

      end: dt.end_time
        ? moment(dt.end_time).format("DD MMM YYYY, HH:mm")
        : "N/A",

      priority: (
        <span className={`pbz-incidence-badge ${priority.className}`}>
          {priority.label}
        </span>
      ),

      status: (
        <span className={`pbz-incidence-badge ${status.className}`}>
          {status.label}
        </span>
      ),
    };
  });

  const button = (
    <button
      type="button"
      className="pbz-app-btn pbz-btn-add"
      onClick={() => setOpen(true)}
    >
      <span className="bi bi-plus-circle"></span> &nbsp;
      <span>New Incidence</span>
    </button>
  );

  return (
    <>
      <IncidenceAdd
        open={open}
        setOpen={setOpen}
        index={index}
        setIndex={setIndex}
      />

      <div className="container-fluid pbz-incidence">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="pbz-incidence-page-header">
          <div>
            <div className="pbz-incidence-eyebrow">
              <WarningOutlined />
              RISK MANAGEMENT
            </div>

            <h1 className="pbz-incidence-title">Incidence Report</h1>

            <p className="pbz-incidence-description">
              Report, monitor and manage workplace incidents and related risk
              events.
            </p>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="pbz-incidence-content">
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
            showButton={false}
            setLoading={setLoading}
          />
        </div>
      </div>
    </>
  );
};
