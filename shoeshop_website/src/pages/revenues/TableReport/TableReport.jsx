import React, { useState, useEffect } from "react";

import TableReportPagination from "./TableReportPagination";
import "./table.css";

const TableReport = ({
  columns,
  rows,
  ReportFilter,
  pageLimit = 10,
  className,
  title,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getPaginatedEntries = (rows, currentpage) => {
    const offset = (currentpage - 1) * pageLimit;
    return rows.slice(offset, offset + pageLimit);
  };
  var totalPage = (rows.length - (rows.length % pageLimit)) / pageLimit;
  if (rows.length % pageLimit != 0) totalPage += 1;
  const entries = getPaginatedEntries(rows, currentPage);

  return (
    <div className="table-report-container">
      <div className="table-report-content">
        <div className="table-report-content-heading">
          <h2 className="table-report-content-heading-title">{title}</h2>
        </div>
        <table className="table-report">
          <tr>
            {columns.map((value) => {
              return <th>{value}</th>;
            })}
          </tr>
          {entries.map((row) => {
            if (ReportFilter == "product")
              return (
                <tr>
                  <td>{row._id.substr(row._id.length - 7).toUpperCase()}</td>
                  <td>{row.productName}</td>
                  <td>{row.sellQuantity?.toLocaleString("en")}</td>
                  <td>{row.revenue?.toLocaleString("en")}</td>
                  <td>{row.profit?.toLocaleString("en")}</td>
                </tr>
              );
            else
              return (
                <tr>
                  <td>{row._id.substr(row._id.length - 7).toUpperCase()}</td>
                  <td>{row.name}</td>
                  <td>{row.returnQuantity}</td>
                </tr>
              );
          })}
        </table>
      </div>
      <TableReportPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPage}
      />
    </div>
  );
};

export default TableReport;
