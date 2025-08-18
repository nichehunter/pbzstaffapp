import { useEffect, useState } from "react";
import { Message, useToaster } from "rsuite";
import { char, number } from "../../../utils";
import moment from "moment";
import { TableShared } from "../../../shared";
import { hrmsCRUD } from "../../../actions/hrms";

const defaultColumns = [
  {
    key: "sn",
    title: "#",
    dataIndex: "sn",
    fixed: true,
    width: 50,
  },
  {
    key: "branch_name",
    title: "Branch",
    dataIndex: "branch_name",
    fullText: true,
    width: 150,
  },
  {
    key: "department_name",
    title: "Department",
    dataIndex: "department_name",
    fullText: true,
    width: 150,
  },
  {
    key: "start_date",
    title: "Start Daate",
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
    key: "days",
    title: "No. Days",
    dataIndex: "days",
    fullText: true,
    width: 50,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    sortable: true,
    width: 50,
  },
];

export const BranchInfo = (props) => {
  const { dataId } = props;
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [postsPerPage, setePostPerPage] = useState(10);
  const [nextPage, setNextPage] = useState(0);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (dataId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffBranch(postsPerPage, nextPage, dataId, "", value, "-id")
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
  }, [postsPerPage, nextPage, dataId, value]);

  const dataItem = data?.map((dt, i) => ({
    id: dt.id,
    sn: i + 1,
    branch_name: dt.branch.branch_name
      ? char.toTitleCase(dt.branch.branch_name)
      : "N/A",
    department_name: dt.department.department_name
      ? char.toTitleCase(dt.department.department_name)
      : "N/A",
    start_date: dt.recorded_at
      ? moment(dt.recorded_at).format("DD MMM YYYY")
      : "N/A",
    end_date: dt.removed_at
      ? moment(dt.removed_at).format("DD MMM YYYY")
      : "N/A",
    days: dt.removed_at
      ? number.fNumberPoint(
          moment(dt.removed_at).diff(moment(dt.recorded_at), "days") + 1
        )
      : number.fNumberPoint(
          moment(new Date()).diff(moment(dt.recorded_at), "days") + 1
        ),
    status: dt.is_active ? (
      <span class="badge bg-success">Active</span>
    ) : (
      <span class="badge bg-danger">Not Active</span>
    ),
  }));

  return (
    <>
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
        button={null}
        link={"#"}
        showButton={true}
        setLoading={setLoading}
        scroll={1000}
      />
    </>
  );
};
