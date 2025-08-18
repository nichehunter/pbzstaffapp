import React from "react";
import { Dropdown, Input, Pagination, Space, Table } from "antd";
import {
  CloseOutlined,
  DownOutlined,
  CheckOutlined,
  SearchOutlined,
  AudioOutlined,
} from "@ant-design/icons";

export const TableShared = (props) => {
  const {
    loading,
    data,
    setData,
    page,
    setPage,
    count,
    postsPerPage,
    setePostPerPage,
    setNextPage,
    setValue,
    defaultColumns,
    button,
    scroll,
  } = props;

  const handleChangePage = (event) => {
    setData([]);
    setPage(event);
    setNextPage((event - 1) * postsPerPage);
  };

  const handleChange = (_, selectedOption) => {
    setData([]);
    setePostPerPage(selectedOption);
    setNextPage(0);
    setPage(1);
  };

  const handleSearch = (event) => {
    setData([]);
    setValue(event.target.value);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card shadow border-white p-3">
          <div>
            <div className="row mb-3">
              <div className="col-md-3 col-sm-12">
                <Input
                  size="large"
                  placeholder="Search......"
                  onChange={(e) => handleSearch(e)}
                  prefix={<SearchOutlined className="me-2" />}
                />
              </div>
              <div className="col-md-3 col-sm-12"></div>
              <div className="col-md-6 col-sm-12 d-flex flex-row-reverse">
                {button}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Table
                  columns={defaultColumns}
                  dataSource={data}
                  loading={loading}
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{
                    x: 800,
                    y: 500,
                  }}
                />
                <div style={{ padding: 20 }} className="text-end mt-2">
                  <Pagination
                    showQuickJumper={true}
                    current={page}
                    pageSize={postsPerPage}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`
                    }
                    total={count}
                    onChange={handleChangePage}
                    onShowSizeChange={(_, s) => handleChange(_, s)}
                    pageSizeOptions={[5, 10, 30, 50, 100, 1000, 10000, count]}
                    responsive={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
