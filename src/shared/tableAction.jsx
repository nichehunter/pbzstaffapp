import { Dropdown, Space } from "antd";

import { DownOutlined, PlusOutlined, CloseOutlined,CheckOutlined,EditOutlined } from "@ant-design/icons";

const items = [
    {
      label: "Add Child ",
      key: "1",
      icon: <PlusOutlined />,
    },
    {
      label: "Close Task ",
      key: "3",
      icon: <CloseOutlined />,
    },
    {
      label: "Complete Task ",
      key: "2",
      icon: <CheckOutlined />,
    },
    {
      label: "Edit Task ",
      key: "4",
      icon: <EditOutlined />,
    },
  ];

export function TableAction() {
  

  return (record) => (
    <Dropdown menu={{ items }}>
        <Space>
          Hover me
          <DownOutlined />
        </Space>
    </Dropdown>
  );
}
