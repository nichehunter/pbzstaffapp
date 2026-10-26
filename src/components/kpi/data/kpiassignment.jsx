import { useState, useEffect, useMemo } from "react";
import { hrmsCRUD } from "../../../actions/hrms";
import { selector } from "../../../api";
import { char } from "../../../utils";
import moment from "moment";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { TableShared } from "../../../shared";
import { SupervisorKPIItem } from "./kpiassigneditem";

const getStatusConfig = (status) => {
  const normalized = String(status || "").toLowerCase();
  switch (normalized) {
    case "draft":
      return {
        label: "Draft",
        className: "pbz-kpi-status-draft",
        icon: <FileTextOutlined />,
      };
    case "submitted":
    case "submit":
      return {
        label: "Submitted",
        className: "pbz-kpi-status-submitted",
        icon: <ClockCircleOutlined />,
      };
    case "rejected":
    case "reject":
      return {
        label: "Rejected",
        className: "pbz-kpi-status-rejected",
        icon: <CloseCircleOutlined />,
      };
    case "approved":
    case "approve":
      return {
        label: "Approved",
        className: "pbz-kpi-status-approved",
        icon: <CheckCircleOutlined />,
      };
    case "archived":
    case "archive":
      return {
        label: "Archived",
        className: "pbz-kpi-status-archived",
        icon: <InboxOutlined />,
      };
    default:
      return {
        label: status || "Unknown",
        className: "pbz-kpi-status-default",
        icon: <FileTextOutlined />,
      };
  }
};

export const KPAAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [kpi, setKpi] = useState(null);
  const [index, setIndex] = useState(0);
  const staff = selector.Staff();

  const handleView = (record) => {
    setKpi(record);
    setOpen(true);
  };

  useEffect(() => {
    if (!staff?.id) return;

    setLoading(true);

    const timer = setTimeout(() => {
      hrmsCRUD
        .loadKPIAssignment({ supervisorId: staff.id })
        .then((response) => {
          setData(response.data?.results || []);
        })
        .catch((error) => {
          console.error("Failed to load KPI assignment:", error);
          setData([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 2000);

    return () => clearTimeout(timer);
  }, [staff?.id, index]);

  const defaultColumns = [
    {
      key: "sn",
      title: "#",
      dataIndex: "sn",
      fixed: true,
      width: 50,
      align: "center",
    },
    {
      key: "staff_opf",
      title: "Staff OPF",
      dataIndex: "staff_opf",
      width: 100,
    },
    {
      key: "staff_name",
      title: "Full Name",
      dataIndex: "staff_name",
      width: 200,
    },
    {
      key: "submission_date",
      title: "Submission Date",
      dataIndex: "submission_date",
      sortable: true,
      width: 110,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <span className={`pbz-kpi-status ${status.className}`}>
          {status.icon}
          <span>{status.label}</span>
        </span>
      ),
    },
  ];

  const dataItem = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = (data || []).filter((dt) => {
      const rawName = String(dt?.staff_name ?? "");
      const rawOpf = String(dt?.staff_opf ?? "");
      const status = getStatusConfig(dt?.status);
      const rawStatus = String(status?.label ?? "");

      if (!keyword) return true;

      return (
        rawOpf.toLowerCase().includes(keyword) ||
        rawName.toLowerCase().includes(keyword) ||
        rawStatus.toLowerCase().includes(keyword)
      );
    });

    return filtered.map((dt, i) => {
      const status = getStatusConfig(dt?.status);

      return {
        id: dt.id,
        sn: i + 1,
        staff_opf: dt.staff_opf ? char.toUpperCase(dt.staff_opf) : "N/A",
        staff_name: dt.staff_name ? char.toTitleCase(dt.staff_name) : "N/A",
        submission_date: dt.submission_date
          ? moment(dt.submission_date).format("MMM DD, YYYY, HH:mm")
          : "N/A",
        status,
      };
    });
  }, [data, search]);

  return (
    <>
      <div className="pbz-incidence-content">
        <TableShared
          loading={loading}
          data={dataItem}
          value={search}
          setValue={setSearch}
          setData={() => {}}
          defaultColumns={defaultColumns}
          button={null}
          link={"#"}
          showButton={false}
          setLoading={setLoading}
          showPagination={false}
          onRowClick={handleView}
        />
      </div>
      <SupervisorKPIItem
        open={open}
        setOpen={setOpen}
        kpi={kpi}
        setIndex={setIndex}
      />
    </>
  );
};
