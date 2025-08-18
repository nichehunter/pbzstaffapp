import { useEffect, useState } from "react";
import { Message, useToaster } from "rsuite";
import { char, number } from "../../../utils";
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
    key: "opf",
    title: "OPF",
    dataIndex: "opf",
    fullText: true,
    width: 50,
  },
  {
    key: "account",
    title: "Account No.",
    dataIndex: "account",
    fullText: true,
    width: 80,
  },
  {
    key: "tin",
    title: "Tin No.",
    dataIndex: "tin",
    fullText: true,
    width: 80,
  },
  {
    key: "amount",
    title: "Amount",
    dataIndex: "amount",
    fullText: true,
    width: 100,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    sortable: true,
    width: 50,
  },
];

export const StaffSalary = (props) => {
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
          .loadSalary(postsPerPage, nextPage, dataId, value, "-id")
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
    opf: dt.staff ? dt.staff.staff_opf : "N/A",
    account: dt.account_number ? dt.account_number : "N/A",
    tin: dt.tin_number ? dt.tin_number : "N/A",
    amount: dt.amount ? (
      <span className="text-end">{number.fNumberDoublePoint(dt.amount)}</span>
    ) : (
      "0.00"
    ),
    status: dt.is_active ? (
      <span class="badge bg-success ">{char.toTitleCase("active")}</span>
    ) : (
      <span class="badge bg-danger ">{char.toTitleCase("inactive")}</span>
    ),
  }));

  return (
    <>
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
