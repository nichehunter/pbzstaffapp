import { useEffect, useState } from "react";
import { DateRangePicker, Message, useToaster } from "rsuite";
import { char, number } from "../../../utils";
import { TableShared } from "../../../shared";
import { hrmsCRUD } from "../../../actions/hrms";
import moment from "moment";
import { Button, Dropdown, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { SalarySlip } from "./print";
import { selector } from "../../../api";

const { afterToday } = DateRangePicker;

export const StaffPayroll = (props) => {
  const { dataId } = props;
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);
  const [data, setData] = useState([]);
  const [payrollID, setPayrollID] = useState(null);
  const [date, setDate] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [postsPerPage, setePostPerPage] = useState(10);
  const [nextPage, setNextPage] = useState(0);
  const [value, setValue] = useState("");
  const roles = selector.Roles();

  useEffect(() => {
    if (dataId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadPayroll(postsPerPage, nextPage, dataId, value, "-id")
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
  }, [postsPerPage, nextPage, dataId, value, date]);
  

  const defaultColumns = [
    {
      key: "sn",
      title: "#",
      dataIndex: "sn",
      fixed: true,
      width: 40,
    },
    {
      key: "opf",
      title: "OPF",
      dataIndex: "opf",
      fullText: true,
      width: 40,
    },
    {
      key: "date",
      title: "Date",
      dataIndex: "date",
      fullText: true,
      width: 120,
    },
    {
      key: "bsalary",
      title: "B Salary",
      dataIndex: "bsalary",
      fullText: true,
      width: 100,
    },
    {
      key: "allowance",
      title: "T Allowance",
      dataIndex: "allowance",
      fullText: true,
      width: 100,
    },
    {
      key: "gsalary",
      title: "G Salary",
      dataIndex: "gsalary",
      fullText: true,
      width: 100,
    },
    {
      key: "health",
      title: "Health",
      dataIndex: "health",
      fullText: true,
      width: 100,
    },
    {
      key: "pension",
      title: "Pension",
      dataIndex: "pension",
      fullText: true,
      width: 100,
    },
    {
      key: "tax",
      title: "Tax",
      dataIndex: "tax",
      fullText: true,
      width: 100,
    },
    {
      key: "odeduction",
      title: "O Deduction",
      dataIndex: "odeduction",
      fullText: true,
      width: 100,
    },
    {
      key: "tdeduction",
      title: "T Deduction",
      dataIndex: "tdeduction",
      fullText: true,
      width: 100,
    },
    {
      key: "salary",
      title: "N Salary",
      dataIndex: "salary",
      fullText: true,
      width: 100,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 70,
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              {
                label: "Print",
                key: "print",
                icon: <i className="ri-printer-line"></i>,
              },
            ],
            onClick: (event) => {
              switch (event.key) {
                case "print":
                  setPayrollID(record.id);
                  setSlipOpen(roles.includes("can_print_slip") ? true : false);
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
    id: dt.payroll.id,
    sn: i + 1,
    opf: dt.staff ? dt.staff.staff_opf : "N/A",
    date: dt.recorded_at
      ? moment(dt.recorded_at).format("ddd. DD MMM YYYY")
      : "N/A",
    bsalary: dt.basic_salary ? (
      <span className="text-end">
        {number.fNumberDoublePoint(dt.basic_salary)}
      </span>
    ) : (
      "0.00"
    ),
    allowance: dt.total_allowance ? (
      <span className="text-end">
        {number.fNumberDoublePoint(dt.total_allowance)}
      </span>
    ) : (
      "0.00"
    ),
    gsalary: dt.basic_salary ? (
      <span className="text-end">
        {number.fNumberDoublePoint(
          parseFloat(dt.basic_salary) + parseFloat(dt.total_allowance),
        )}
      </span>
    ) : (
      "0.00"
    ),
    health: dt.helth_fund ? (
      <span className="text-end">
        {number.fNumberDoublePoint(dt.helth_fund)}
      </span>
    ) : (
      "0.00"
    ),
    pension: dt.security_fund ? (
      <span className="text-end">
        {number.fNumberDoublePoint(dt.security_fund)}
      </span>
    ) : (
      "0.00"
    ),
    tax: dt.payee ? (
      <span className="text-end">{number.fNumberDoublePoint(dt.payee)}</span>
    ) : (
      "0.00"
    ),
    odeduction: dt.total_deduction ? (
      <span className="text-end">
        {number.fNumberDoublePoint(dt.total_deduction)}
      </span>
    ) : (
      "0.00"
    ),
    tdeduction: dt.total_deduction ? (
      <span className="text-end">
        {number.fNumberDoublePoint(
          parseFloat(dt.security_fund) +
            parseFloat(dt.payee) +
            parseFloat(dt.total_deduction),
        )}
      </span>
    ) : (
      "0.00"
    ),
    salary: dt.net_salary ? (
      <span className="text-end">
        {number.fNumberDoublePoint(dt.net_salary)}
      </span>
    ) : (
      "0.00"
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
      <SalarySlip
        open={slipOpen}
        setOpen={setSlipOpen}
        dataId={payrollID}
        staffId={dataId}
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
        button={dateFilter}
        link={"#"}
        showButton={true}
        setLoading={setLoading}
        scroll={1000}
      />
    </>
  );
};
