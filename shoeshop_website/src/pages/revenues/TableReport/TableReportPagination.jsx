import React, { useState } from "react";

const TableReportPagination = ({ currentPage, setCurrentPage, totalPage }) => {
  const [valueCurrentPage, setValueCurrentPage] = useState(currentPage);

  return (
    <div className="icon-container">
      <i class="bx bx-fast-forward bx-rotate-180 icon"></i>
      <i
        onClick={() => {
          if (currentPage > 1) {
            setValueCurrentPage(currentPage - 1);
            setCurrentPage(currentPage - 1);
          }
        }}
        style={{ fontSize: 20 }}
        class="bx bxs-left-arrow icon"
      ></i>

      <input
        className="current-page"
        type="text"
        value={valueCurrentPage}
        onChange={(e) => {
          const re = /^[0-9]+$/;
          if (e.target.value === "" || re.test(e.target.value)) {
            setValueCurrentPage(e.target.value);
          }
        }}
        onKeyUp={(e) => {
          if (valueCurrentPage > 0 && valueCurrentPage <= totalPage) {
            if (e.keyCode === 13) setCurrentPage(e.target.value);
          }
        }}
      />
      <span>/</span>
      <div className="total-page">{totalPage}</div>

      <i
        style={{ fontSize: 20 }}
        onClick={() => {
          if (currentPage < totalPage) {
            setValueCurrentPage(currentPage + 1);
            setCurrentPage(currentPage + 1);
          }
        }}
        class="bx bxs-right-arrow icon"
      ></i>
      <i class="bx bx-fast-forward icon"></i>
    </div>
  );
};

export default TableReportPagination;
