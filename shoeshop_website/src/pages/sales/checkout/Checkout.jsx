import React, { useRef, useState, useEffect } from "react";
import "./checkout.css";
import { useLocation, useHistory } from "react-router-dom";
import QRCode from "qrcode";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
const Checkout = () => {
  let history = useHistory();
  let location = useLocation();
  const order = location.state.order;
  const [orderId, setOrderId] = useState("");
  const [qrImage, setQrImage] = useState("");
  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        orderTotal: order.orderTotal,
        customerId: order.customer.id,
        point: order.customer.point,
        name: order.customer.name,
      })
    ).then((url) => {
      setQrImage(url);
    });
    console.log(order);
  }, []);

  // console.log(JSON.parse(localStorage.getItem("currentCustomer")));

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleCheckout = () => {
    const orderApi = {
      user: order.user.userId,
      customer: order.customer.id,
      subTotal: order.subTotal,
      discount: order.discount,
      orderTotal: order.orderTotal,
      point: order.customer.point,
      orderDetails: order.orderDetails.map((orderItem) => {
        return {
          product: orderItem.productId,
          quantity: orderItem.quantity,
        };
      }),
    };
    axios
      .post("https://deloy-backend-shoeshop.onrender.com/api/orders", { ...orderApi })
      .then((res) => {
        setQrImage(res.data.qrCodeUrl);
        setOrderId(res.data._id);

        const existCurrentOrders = JSON.parse(localStorage.getItem("orders"));
        const existCurrentCustomer = JSON.parse(
          localStorage.getItem("currentCustomer")
        );
        if (existCurrentCustomer) {
          existCurrentCustomer[order.activeTab] = {
            name: "Khách lẻ",
            phone: "",
            point: 0,
          };
        }
        if (existCurrentOrders) {
          existCurrentOrders[order.activeTab].orderDetails = [];
        }

        localStorage.setItem("orders", JSON.stringify(existCurrentOrders));
        localStorage.setItem(
          "currentCustomer",
          JSON.stringify(existCurrentCustomer)
        );
        handlePrint();
        history.push("/sales");
        alert("Thanh toán thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getDate = () => {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${date}/${month}/${year}`;
  };
  return (
    <div ref={componentRef} className="invoice-container">
      <div className="invoice-header">
        <h3>HOÁ ĐƠN THANH TOÁN</h3>
        <h4>Mã hoá đơn: {orderId}</h4>
        <p>Ngày lập hoá đơn: {getDate()}</p>
      </div>
      <div className="invoice-info">
        <div className="invoice-info-row">
          <h3>4HShoe Shop</h3>
          <p>Đường Vành Đai, Kí túc xá Đại học quốc gia khu B</p>
          <p>Phường Đông Hoà, thị xã Dĩ An, tỉnh Bình Dương</p>
        </div>
        <div className="invoice-info-right">
          <div className="invoice-qrcode">
            {/* <img src={qrImage} alt="" /> */}
            {/* text */}
          </div>
          <div className="invoice-info-p">
            <p>Khách hàng: {order.customer.name}</p>
            <p>Số điện thoại: {order.customer.phone}</p>
            <p>Nhân viên bán hàng: {order.user.fullname}</p>
          </div>
        </div>
      </div>
      <div class="invoice-table-bill-container">
        <table id="invoice-table">
          <thead>
            <tr>
              <th>Số thứ tự</th>
              <th>Tên sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((orderItem, index) => {
              if (orderItem.quantity) {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{orderItem.productName}</td>

                    <td>{`${orderItem.salePrice.toLocaleString("en")}đ`}</td>
                    <td>{orderItem.quantity}</td>
                    <td>{`${(
                      orderItem.salePrice * orderItem.quantity
                    ).toLocaleString("en")}đ`}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <div className="table-footer-left">
          <p>
            Cảm ơn quý khách đã mua hàng tại <b>4HShoe Shop</b>
          </p>
        </div>
        <div className="table-footer-right">
          <p>{`Tạm tính ${order.subTotal.toLocaleString("en")}đ`}</p>
          {order.discount > 0 && (
            <p>{`Giảm giá: ${order.discount.toLocaleString("en")}đ`}</p>
          )}
          <b>{`Tổng tiền: ${order.orderTotal.toLocaleString("en")}đ`}</b>
        </div>
      </div>
      <div className="invoice-confirm-row">
        <button
          onClick={() => {
            handleCheckout();
          }}
          className="invoice-confirm-access"
        >
          Xác nhận
        </button>

        <button
          onClick={() => {
            history.push("/sales");
          }}
          className="invoice-confirm-cancel"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
};

export default Checkout;