import React, { useEffect, useState, useRef } from "react";
import CustomersNavbar from "./customer_navbar/CustomersNavbar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import "react-datepicker/dist/react-datepicker.css";
import "./customers.css";

const columns = [
  { id: "_id", label: "Mã Khách hàng" },
  { id: "name", label: "Tên khách hàng" },
  {
    id: "phone",
    label: "Số điện thoại",
  },
  {
    id: "totalPrice",
    label: "Tổng tiền",

    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "point",
    label: "Điểm tích luỹ",

    format: (value) => value.toLocaleString("en-US"),
  },
];

const customerDf = [
  {
    _id: "0",
    name: "None",
    phone: "None",
    totalPrice: 0,
    point: 0,
    listOrders: [
      {
        _id: "619c9d1721a22da06c29d64f",
        orderTotal: 0,
        status: "Đã Thanh Toán",
      },
      {
        _id: "619ca172aaa5d9d88be153e5",
        orderTotal: 0,
        status: "Đã Thanh Toán",
      },
    ],
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState(customerDf);
  const [rerenderCustomers, setRerenderCustomers] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pointFrom, setPointFrom] = React.useState("");
  const [pointTo, setPointTo] = React.useState("");
  const [totalPriceFrom, setTotalPriceFrom] = React.useState("");
  const [totalPriceTo, setTotalPriceTo] = React.useState("");
  const [SearchInput, setSearchInput] = React.useState("");
  const [defaultCustomer, setDefaultCustomer] = React.useState([]);
  const componentRef = useRef();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   onBeforePrint: () => (document.title = "Print page title"),
  // });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/customers/list")
      .then((res) => {
        console.log(res.data);
        CalculateTotalPrice(res.data);
      })
      .catch((err) => {
        console.log(err.res);
      });
  }, [rerenderCustomers]);

  
 

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Search by strings
  const handleSearch = (searchInput) => {
    setSearchInput(searchInput);
    console.log(totalPriceFrom.replace(/[^0-9]/g, ""));
    console.log("Search working...");
    const customersFilter = defaultCustomer.filter((customer) => {
      console.log("Chạy filter");
      return (
        (customer.name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1 ||
          customer._id.toLowerCase().indexOf(searchInput.toLowerCase()) > -1 ||
          customer.phone.toLowerCase().indexOf(searchInput.toLowerCase()) >
            -1 ||
          String(customer.point).indexOf(searchInput.toLowerCase()) > -1) &&
        customer.totalPrice - 1 <
          Number(
            totalPriceTo.replace(/[^0-9]/g, "") == ""
              ? Number.MAX_VALUE
              : totalPriceTo.replace(/[^0-9]/g, "")
          ) &&
        customer.totalPrice + 1 >
          Number(
            totalPriceFrom.replace(/[^0-9]/g, "") == ""
              ? Number.MIN_VALUE
              : totalPriceFrom.replace(/[^0-9]/g, "")
          ) &&
        customer.point - 1 <
          Number(
            pointTo.replace(/[^0-9]/g, "") == ""
              ? Number.MAX_VALUE
              : pointTo.replace(/[^0-9]/g, "")
          ) &&
        customer.point + 1 >
          Number(
            pointFrom.replace(/[^0-9]/g, "") == ""
              ? Number.MIN_VALUE
              : pointFrom.replace(/[^0-9]/g, "")
          )
      );
    });
    setCustomers(customersFilter);
  };


  //Search by point

  const handleSearchByPoint = (pointFrom, pointTo) => {
    console.log("Search Point working...");
    const customerbyPoint = defaultCustomer.filter((customer) => {
      return (
        (customer.name.toLowerCase().indexOf(SearchInput.toLowerCase()) > -1 ||
          customer._id.toLowerCase().indexOf(SearchInput.toLowerCase()) > -1 ||
          customer.phone.toLowerCase().indexOf(SearchInput.toLowerCase()) >
            -1 ||
          String(customer.point).indexOf(SearchInput.toLowerCase()) > -1) &&
        customer.totalPrice - 1 <
          Number(
            totalPriceTo.replace(/[^0-9]/g, "") == ""
              ? Number.MAX_VALUE
              : totalPriceTo.replace(/[^0-9]/g, "")
          ) &&
        customer.totalPrice + 1 >
          Number(
            totalPriceFrom.replace(/[^0-9]/g, "") == ""
              ? Number.MIN_VALUE
              : totalPriceFrom.replace(/[^0-9]/g, "")
          ) &&
        customer.point - 1 <
          Number(
            pointTo.replace(/[^0-9]/g, "") == ""
              ? Number.MAX_VALUE
              : pointTo.replace(/[^0-9]/g, "")
          ) &&
        customer.point + 1 >
          Number(
            pointFrom.replace(/[^0-9]/g, "") == ""
              ? Number.MIN_VALUE
              : pointFrom.replace(/[^0-9]/g, "")
          )
      );
    });
    setCustomers(customerbyPoint);
  };
  // Function calculate total price of customer
  const CalculateTotalPrice = (customers) => {
    console.log("Chạy total price");
    customers.forEach((customer) => {
      console.log("Vòng Ngoài");
      var total = 0;
      customer.listOrders.forEach((value) => {
        console.log("Vòng Trong");
        if (value.status == "Đã thanh toán") total += value.orderTotal;
      });
      console.log("Total Price:");
      console.log(total);
      customer["totalPrice"] = total;
    });
    setCustomers(customers);
    setDefaultCustomer(customers);
  };
  // Search by total price
  const handleSearchByTotalPrice = (totalPriceFrom, totalPriceTo) => {
    console.log("Search totalPrice working...");
    const customerbytotalPrice = defaultCustomer.filter((customer) => {
      return (
        (customer.name.toLowerCase().indexOf(SearchInput.toLowerCase()) > -1 ||
          customer._id.toLowerCase().indexOf(SearchInput.toLowerCase()) > -1 ||
          customer.phone.toLowerCase().indexOf(SearchInput.toLowerCase()) >
            -1 ||
          String(customer.point).indexOf(SearchInput.toLowerCase()) > -1) &&
        customer.totalPrice - 1 <
          Number(
            totalPriceTo.replace(/[^0-9]/g, "") == ""
              ? Number.MAX_VALUE
              : totalPriceTo.replace(/[^0-9]/g, "")
          ) &&
        customer.totalPrice + 1 >
          Number(
            totalPriceFrom.replace(/[^0-9]/g, "") == ""
              ? Number.MIN_VALUE
              : totalPriceFrom.replace(/[^0-9]/g, "")
          ) &&
        customer.point - 1 <
          Number(
            pointTo.replace(/[^0-9]/g, "") == ""
              ? Number.MAX_VALUE
              : pointTo.replace(/[^0-9]/g, "")
          ) &&
        customer.point + 1 >
          Number(
            pointFrom.replace(/[^0-9]/g, "") == ""
              ? Number.MIN_VALUE
              : pointFrom.replace(/[^0-9]/g, "")
          )
      );
    });
    setCustomers(customerbytotalPrice);
  };

  return (
    <div>
      <CustomersNavbar /*handlePrint={handlePrint}*/ handleSearch={handleSearch} />
      <div className="row customers_content">
        <div className="col-3">
          <div className="customer-card">
            <h3 className="customer-card-heading">Điểm tích luỹ</h3>
            <div className="customer-card-body">
              <div className="customer-card-item">
                <span>Từ</span>
                <input
                  className="customer-card-input"
                  placeholder="Giá trị"
                  type="text"
                  value={pointFrom}
                  onChange={(e) => {
                    setPointFrom(e.target.value);
                    handleSearchByPoint(e.target.value, pointTo);
                  }}
                  onBlur={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <div className="customer-card-item">
                <span>Đến</span>
                <input
                  className="customer-card-input"
                  placeholder="Giá trị"
                  type="text"
                  value={pointTo}
                  onChange={(e) => {
                    setPointTo(e.target.value);

                    handleSearchByPoint(pointFrom, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="customer-card">
            <h3 className="customer-card-heading">Tổng tiền</h3>
            <div className="customer-card-body">
              <div className="customer-card-item">
                <span>Từ</span>
                <input
                  className="customer-card-input"
                  placeholder="Giá trị"
                  type="text"
                  value={totalPriceFrom}
                  onChange={(e) => {
                    setTotalPriceFrom(e.target.value);
                    handleSearchByTotalPrice(e.target.value, totalPriceTo);
                  }}
                />
              </div>
              <div className="customer-card-item">
                <span>Đến</span>
                <input
                  className="customer-card-input"
                  placeholder="Giá trị"
                  type="text"
                  value={totalPriceTo}
                  onChange={(e) => {
                    setTotalPriceTo(e.target.value);
                    handleSearchByTotalPrice(totalPriceFrom, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-9" style={{ padding: "10px 0px 10px 10px" }}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table ref={componentRef} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: "#03a9f4",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          key={row.code}
                          style={
                            index % 2 == 1 ? { backgroundColor: "#e8e8e8" } : {}
                          }
                        >
                          {columns.map((column) => {
                            let value = row[column.id];
                            if (column.id === "_id") {
                              value = value
                                .substr(value.length - 7)
                                .toUpperCase();
                            }
                            if (column.id === "point") {
                              if (!row.point) value = 0;
                            }
                            return (
                              <TableCell key={column.id}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              labelRowsPerPage="Số hàng hiển thị"
              rowsPerPageOptions={[6, 12, 100]}
              component="div"
              count={customers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Customers;