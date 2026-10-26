import React from "react";
import { Input, Pagination, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./styles/table.css";

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
    showPagination = true,
    onRowClick,
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
    <div className="pbz-table-wrapper">
      <div className="pbz-table-card">
        {/* TABLE TOOLBAR */}
        <div className="pbz-table-toolbar">
          <div className="pbz-table-search">
            <Input
              size="large"
              placeholder="Search records..."
              onChange={(e) => handleSearch(e)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>

          <div className="pbz-table-actions">{button}</div>
        </div>

        {/* TABLE */}
        <div className="pbz-table-container">
          <Table
            columns={defaultColumns}
            dataSource={data}
            loading={loading}
            pagination={false}
            bordered
            size="small"
            onRow={
              onRowClick
                ? (record) => ({
                    onClick: () => onRowClick(record),
                    style: {
                      cursor: "pointer",
                    },
                  })
                : undefined
            }
            scroll={{
              x: scroll?.x || 800,
              y: scroll?.y || 500,
            }}
          />
        </div>

        {/* PAGINATION */}
        {showPagination && (
          <div className="pbz-table-footer">
            <div className="pbz-table-record-info">
              <span>Showing</span>
              <strong>
                {count > 0
                  ? `${Math.min(
                      (page - 1) * postsPerPage + 1,
                      count,
                    )}-${Math.min(page * postsPerPage, count)}`
                  : "0"}
              </strong>
              <span>of</span>
              <strong>{count || 0}</strong>
              <span>records</span>
            </div>

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
        )}
      </div>
    </div>
  );
};
