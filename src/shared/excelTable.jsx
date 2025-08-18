import { useState } from "react";
import { Table } from "rsuite";
const { Column, HeaderCell, Cell } = Table;

export const ExcelTable = (props) => {
  const { data, defaultColumns, loading } = props;

  const [columnKeys] = useState(defaultColumns.map((column) => column.key));
  const columns = defaultColumns.filter((column) =>
    columnKeys.some((key) => key === column.key)
  );

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Table
              data={data}
              height={550}
              bordered
              virtualized
              cellBordered
              loading={loading}
            >
              {columns.map((column) => {
                const { key, label, ...rest } = column;
                return (
                  <Column {...rest} key={key}>
                    <HeaderCell className="table-head-upload">
                      {label}
                    </HeaderCell>
                    <Cell dataKey={key} />
                  </Column>
                );
              })}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};