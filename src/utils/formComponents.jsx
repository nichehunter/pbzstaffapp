import { Button, ConfigProvider, Divider } from "antd";
import {
  StopOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  ToTopOutlined
} from "@ant-design/icons";

export function button(props) {
  const { color, icon, type, text, key } = props;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color,
        },
      }}
    >
      <Button icon={icon} type={type} key={key}>
        {text}
      </Button>
    </ConfigProvider>
  );
}

export function modalFooter(loading, setOpen, onClick, disable) {
  return [
    <>
      <Divider key={"devide"} />
      <div className="text-start" key={"div1"}>
        <span className="text-danger fw-bold me-2">*</span>Required field
      </div>
      <div style={{ marginTop: -20 }} key={"div2"}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#dc3545",
            },
          }}
          key={"conback"}
        >
          <Button
            key="back"
            icon={<StopOutlined />}
            type="primary"
            onClick={() => setOpen(false)}
            size="large"
          >
            Cancel
          </Button>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00b96b",
            },
          }}
          key={"consub"}
        >
          <Button
            key="submit"
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={onClick}
            disabled={disable}
            size="large"
            className="ms-2"
          >
            Save
          </Button>
        </ConfigProvider>
      </div>
    </>,
  ];
}

export function itemPrint() {
  return [
    {
      label: "Print",
      key: "print",
      icon: <PrinterOutlined />,
    },
  ];
}

export function itemPrintPayment() {
  return [
    {
      label: "Print",
      key: "print",
      icon: <PrinterOutlined />,
    },
    {
      label: "Check Payment",
      key: "payment",
      icon: <DollarOutlined />,
    },
  ];
}

export function itemPost() {
  return [
    {
      label: "Post",
      key: "post",
      icon: <ToTopOutlined />,
    },
    {
      label: "Cancel",
      key: "cancel",
      icon: <CloseCircleOutlined />,
    },
  ];
}
