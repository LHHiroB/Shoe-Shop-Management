import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import TextField from "@mui/material/TextField";
import DatePicker from "react-date-picker";
import "./Orders.css";
import Checkbox from "@mui/material/Checkbox";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import axios from "axios";

import { styled } from "@mui/system";
import OrderDetail from "./orderdetail/OrderDetail";
const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const Orders = () => {
  const history = useHistory();
  const [showFormOrderDetail, setShowFormOrderDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(1);
  const [orders, setOrders] = useState([]);
  const [originOrders, setOriginOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orderFilter, setOrderFilter] = useState({
    orderId: "",
    customerName: "",
    seller: "",
    listStatus: [
      {
        status: "Đã thanh toán",
        checked: false,
      },
      {
        status: "Đã trả hàng",
        checked: false,
      },
    ],
  });
  const pages = [];

  for (let i = 2; i <= Math.ceil(orders.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const currentOrders = orders.slice(
    currentPage * itemsPerPage - itemsPerPage,
    currentPage * itemsPerPage
  );
  const renderPageNumbers = pages.map((number) => {
    if (number <= maxPageNumberLimit && number >= minPageNumberLimit) {
      return (
        <div
          onClick={() => {
            setCurrentPage(number);
          }}
          class={`cell ${currentPage === number ? "active" : null}`}
        >
          {number}
        </div>
      );
    }
    return null;
  });

  useEffect(() => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/orders/list")
      .then((res) => {
        setOrders(
          res.data.filter(
            (order) => order.orderTotal - (order?.totalReturnPrice || 0) !== 0
          )
        );
        setOriginOrders(
          res.data.filter(
            (order) => order.orderTotal - (order?.totalReturnPrice || 0) !== 0
          )
        );
      })
      .catch((err) => {
        alert("Lỗi call api");
      });
  }, []);
  useEffect(() => {
    console.log(
      orderFilter.orderId,
      orderFilter.customerName,
      orderFilter.seller,
      fromDate,
      toDate
    );
    setCurrentPage(1);
    const listStatusChecked = orderFilter.listStatus.filter(
      (status) => status.checked === true
    );
    if (
      listStatusChecked.length === orderFilter.listStatus.length ||
      listStatusChecked.length === 0
    ) {
      handleFilter(
        orderFilter.orderId,
        orderFilter.customerName,
        orderFilter.seller,
        fromDate,
        toDate
      );
    } else {
      const newOrder = orders.filter(
        (order) => order.status === listStatusChecked[0].status
      );
      setOrders(newOrder);
    }
  }, [orderFilter, fromDate, toDate]);
  const formateDate = (dateStr) => {
    var date = new Date(dateStr);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handlePreviousPagination = () => {
    setCurrentPage(currentPage - 1);
    if (currentPage - 1 < minPageNumberLimit) {
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
    }
  };
  const handleNextPagination = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
    }
  };
  const handleFilter = (orderId, customerName, seller, fromDate, toDate) => {
    console.log({ orderId, customerName, seller, fromDate, toDate });
    if (!orderId && !customerName && !seller && !fromDate && !toDate) {
      setOrders(originOrders);
    } else {
      setCurrentPage(1);

      const fromDateTime = (fromDate && fromDate.getTime()) || 0;
      const toDateTime =
        (toDate && toDate.getTime() + 3600 * 24 * 1000) || new Date().getTime();
      var orderFiltered = originOrders.filter((order) => {
        const dateOrder = new Date(order.dateOrder);

        if (order.customer) {
          return (
            fromDateTime <= dateOrder.getTime() &&
            toDateTime > dateOrder.getTime() &&
            order._id.indexOf(orderId) >= 0 &&
            order.customer &&
            order.customer?.name
              .toLowerCase()
              .indexOf(customerName.toLowerCase()) >= 0 &&
            order.customer &&
            order.user.fullname.indexOf(seller) >= 0
          );
        } else {
          return (
            fromDateTime <= dateOrder.getTime() &&
            toDateTime > dateOrder.getTime() &&
            order._id.indexOf(orderId) >= 0 &&
            !customerName &&
            order.user.fullname.indexOf(seller) >= 0
          );
        }
      });

      setOrders(orderFiltered);
    }
  };

  return (
    <div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={showFormOrderDetail}
        onClose={() => {
          setShowFormOrderDetail(false);
        }}
        BackdropComponent={Backdrop}
      >
        <OrderDetail setShowFormOrderDetail={setShowFormOrderDetail} />
      </StyledModal>
      <div className="row order-container">
        <div className="col-3 order-card-list">
          <div className="order-card">
            <h4 className="order-card-heading">Tìm kiếm</h4>
            <div className="order-card-body">
              <div className="order-card-item">
                <input
                  placeholder="Theo mã hoá đơn"
                  type="text"
                  className="order-card-input"
                  value={orderFilter.orderId}
                  onChange={(e) => {
                    setOrderFilter((prev) => {
                      return {
                        ...prev,
                        orderId: e.target.value,
                      };
                    });
                  }}
                />
              </div>
              <div className="order-card-item">
                <input
                  placeholder="Theo tên khách hàng"
                  type="text"
                  className="order-card-input"
                  value={orderFilter.customerName}
                  onChange={(e) => {
                    setOrderFilter((prev) => {
                      return {
                        ...prev,
                        customerName: e.target.value,
                      };
                    });
                  }}
                />
              </div>
              <div className="order-card-item">
                <input
                  placeholder="Theo tên người bán"
                  type="text"
                  className="order-card-input"
                  value={orderFilter.seller}
                  onChange={(e) => {
                    setOrderFilter((prev) => {
                      return {
                        ...prev,
                        seller: e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="order-card">
            <h4 className="order-card-heading">Thời gian</h4>
            <div className="order-card-body">
              <div className="order-card-date-picker">
                  <DatePicker
                    format="dd/MM/yyyy"
                    inputFormat="dd/MM/yyyy"
                    views={["day", "month", "year"]}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    label={fromDate ? "" : "Từ ngày"}
                    value={fromDate}
                    onChange={(newValue) => {
                      setFromDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        InputLabelProps={{
                          shrink: false,
                        }}
                        {...params}
                        variant="standard"
                      />
                    )}
                  />
              </div>
              <div className="order-card-date-picker">
                  <DatePicker
                    minDate={fromDate}
                    format="dd/MM/yyyy"
                    inputFormat="dd/MM/yyyy"
                    views={["day", "month", "year"]}
                    label={toDate ? "" : "Đến ngày"}
                    value={toDate}
                    onChange={(newValue) => {
                      setToDate(newValue);
                    }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    renderInput={(params) => (
                      <TextField
                        InputLabelProps={{
                          shrink: false,
                        }}
                        {...params}
                        variant="standard"
                        size="small"
                      />
                    )}
                  />
              </div>
            </div>
          </div>
          {/* test */}
        </div>
        <div className="col-9" style={{ padding: "10px 0px 10px 10px" }}>
          <div class="order-table-container">
            <table id="order-table">
              <thead>
                <tr>
                  <th>Mã hoá đơn</th>
                  <th>Ngày tạo</th>
                  <th>Khách hàng</th>
                  <th>Nhân viên</th>
                  <th>Tổng cộng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  currentOrders.map((order, index) => {
                    console.log({
                      order: order.dateOrder,
                      dateFontend: formateDate(order.dateOrder),
                    });
                    return (
                      <tr
                        onClick={() => {
                          history.push("/orderDetail", {
                            orderId: order._id,
                          });
                        }}
                      >
                        <td>{order._id.substr(order._id.length - 10)}</td>
                        <td>{formateDate(order.dateOrder)}</td>
                        <td>
                          {order.customer ? order.customer.name : "Khách lẻ"}
                        </td>
                        <td>{order.user?.fullname}</td>
                        <td>{`${(
                          order.orderTotal - (order?.totalReturnPrice || 0)
                        ).toLocaleString("en")}đ`}</td>
                        <td>{order.status}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {/**Start Pagination */}
            {pages.length >= 1 && (
              <div class="pagination">
                <div class="pagination-left">
                  <button
                    disabled={currentPage === 1 ? true : false}
                    onClick={handlePreviousPagination}
                    class="cell"
                    id="prev-btn"
                  >
                    <i class="fas fa-caret-left"></i>
                  </button>
                  <div
                    onClick={() => {
                      setCurrentPage(1);
                      setminPageNumberLimit(1);
                      setmaxPageNumberLimit(pageNumberLimit);
                    }}
                    className={`cell ${currentPage === 1 ? "active" : ""}`}
                  >
                    1
                  </div>
                  {minPageNumberLimit > 1 && (
                    <div onClick={handlePreviousPagination} class="cell">
                      {" "}
                      &hellip;
                    </div>
                  )}

                  {renderPageNumbers}

                  {maxPageNumberLimit < pages.length && (
                    <div onClick={handleNextPagination} class="cell">
                      {" "}
                      &hellip;
                    </div>
                  )}

                  <button
                    disabled={
                      currentPage === pages[pages.length - 1] ? true : false
                    }
                    onClick={handleNextPagination}
                    class="cell"
                    id="next-btn"
                  >
                    <i class="fas fa-caret-right"></i>
                  </button>
                </div>
                <div class="pagination-right">
                  <p>Số hàng mỗi dòng: {itemsPerPage} / Tổng số hoá đơn</p>
                </div>
              </div>
            )}
            {/**Pagination */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
