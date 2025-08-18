import { useEffect, useState } from "react";
import { DateRangePicker, Message, useToaster } from "rsuite";
import { char, number } from "../../../utils";
import { TableShared } from "../../../shared";
import { hrmsCRUD } from "../../../actions/hrms";
import moment from "moment";

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
    key: "allowance",
    title: "Allowance",
    dataIndex: "allowance",
    fullText: true,
    width: 150,
  },
  {
    key: "date",
    title: "Date",
    dataIndex: "date",
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
];

const { afterToday } = DateRangePicker;

export const StaffMonthlyAllowance = (props) => {
  const { dataId } = props;
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(null);
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
          .loadMonthlyAllowance(
            postsPerPage,
            nextPage,
            dataId,
            `${
              date
                ? [
                    moment(date[0]).format("yyyy-MM-DD"),
                    moment(date[1]).format("yyyy-MM-DD"),
                  ]
                : ""
            }`,
            true,
            value,
            "date"
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
              { placement: "topCenter", duration: 7000 }
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    }
  }, [postsPerPage, nextPage, dataId, value, date]);

  const dataItem = data?.map((dt, i) => ({
    id: dt.id,
    sn: i + 1,
    opf: dt.staff ? dt.staff.staff_opf : "N/A",
    allowance: dt.allowance ? char.toUpperCase(dt.allowance.name) : "N/A",
    date: dt.date ? moment(dt.date).format("ddd. DD MMM YYYY") : "N/A",
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

  const dateFilter = (
    <div className="row">
      <div className="col-12">
        <DateRangePicker
          showWeekNumbers={true}
          placeholder="Select Date Range"
          cleanable={true}
          block={true}
          value={date}
          onOk={(e) => {
            setDate(e);
          }}
          onClean={() => setDate(null)}
          shouldDisableDate={afterToday()}
          placement="bottomEnd"
        />
      </div>
    </div>
  );

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
        button={dateFilter}
        link={"#"}
        showButton={true}
        setLoading={setLoading}
        scroll={1000}
      />
    </>
  );
};
