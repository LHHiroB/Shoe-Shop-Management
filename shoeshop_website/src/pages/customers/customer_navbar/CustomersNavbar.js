import React from "react";
import "./customers_navbar.css";
const CustomersNavbar = (props) => {
  return (
    <div>
      <div
        className="row customers_navbar_container"
        style={{ alignItems: "center", fontSize: "20px" }}
      >
        <div className="navbar__search">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            onChange={(e) => {
              console.log(e.target.value);
              props.handleSearch(e.target.value);
            }}
          />
          <i className="bx bx-search"></i>
        </div>
        {/* test */}
      </div>
    </div>
  );
};

export default CustomersNavbar;
