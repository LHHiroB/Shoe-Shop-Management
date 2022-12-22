import React, { useState, useEffect } from "react";
import "./dashboard.css";
import revenueIcon from "../../assets/images/dashboardIcon1.png";
import topcustomer from "../../assets/images/top.png";
import star from "../../assets/images/star.png";
import dashboardOrderIcon from "../../assets/images/dashboardOrderIcon1.png";
import dashboardCostIcon from "../../assets/images/dashboardCost.png";
import marginIcon from "../../assets/images/dashboardRevenueIcon.png";
import BarChart from "../../components/barchart/BarChart";
import { LineChart } from "../../components/linechart/LineChart";
import axios from "axios";
const Dashboard = () => {
  const [revenueToday, setRevenueToday] = useState(0);
  const [expensiveToday, setExpensiveToday] = useState(0);
  const [countNumberToday, setCountNumberToday] = useState(0);
  const [top1Customer, setTop1Customer] = useState({});
  const [totalCustomerThisWeek, setTotalCustomerThisWeek] = useState();
  const [totalCustomerLastWeek, setTotalCustomerLastWeek] = useState();
  const [topProductByRevenue, setTopProductByRevenue] = useState();
  const [topProductByQuantity, setTopProductByQuantity] = useState();
  useEffect(() => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/orders/revenue/revenueToday"
      )
      .then((res) => {
        setRevenueToday(res.data[0]?.total || 0);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/orders/revenue/getExpensiveToday"
      )
      .then((res) => {
        setExpensiveToday(res.data[0]?.totalExpensive || 0);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/orders/revenue/getCountOrderToday"
      )
      .then((res) => {
        setCountNumberToday(res.data[0]?.countOrder || 0);
      });
  }, []);
  //get top 1 customer
  useEffect(() => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/customers/getTopCustomerByPoint/1"
      )
      .then((res) => {
        setTop1Customer({
          name: res.data[0]?.name,
          phone: res.data[0]?.phone,
          point: res.data[0]?.point,
        });
      });
  }, []);
  //get customer this week
  useEffect(() => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/orders/revenue/getTotalCustomerByThisWeek"
      )
      .then((res) => {
        const customerThisWeekDataSets = [0, 0, 0, 0, 0, 0, 0];
        // console.log({ customerThisWeekDataSets });
        res.data.forEach((item) => {
          // console.log(item);
          const indexDate = new Date(item.dateOrder).getDay();
          if (indexDate !== 0) {
            customerThisWeekDataSets[indexDate - 1] += 1;
          } else {
            customerThisWeekDataSets[6] += 1;
          }
        });
        setTotalCustomerThisWeek((prev) => {
          return [...customerThisWeekDataSets];
        });
      });
  }, []);

  // console.log({ totalCustomerThisWeek });
  // get customer last week
  useEffect(() => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/orders/revenue/getTotalCustomerByLastWeek"
      )
      .then((res) => {
        const customerLastWeekDataSets = [0, 0, 0, 0, 0, 0, 0];
        res.data.forEach((item) => {
          const indexDate = new Date(item.dateOrder).getDay();
          if (indexDate !== 0) {
            customerLastWeekDataSets[indexDate - 1] += 1;
          } else {
            customerLastWeekDataSets[6] += 1;
          }
        });
        setTotalCustomerLastWeek((prev) => {
          return [...customerLastWeekDataSets];
        });
      });
  }, []);
  console.log("run");
  //get top product by renvenue
  useEffect(() => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/orders/revenue/getTopProductByRevenue/6"
      )
      .then((res) => {
        setTopProductByRevenue(res.data);
      });
  }, []);
  //get top product by quantity
  useEffect(() => {
    axios
      .get(
        "https://deloy-backend-shoeshop.onrender.com/api/orders/revenue/getTopProductByQuantity/6"
      )
      .then((res) => {
        setTopProductByQuantity(res.data);
      });
  }, []);

  const dataCustomer = {
    labels: [
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
      "Chủ nhật",
    ],
    datasets: [
      {
        label: "Tuần trước",
        data: totalCustomerLastWeek,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Tuần này",
        data: totalCustomerThisWeek,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const dataClothes = {
    labels: topProductByQuantity?.map((value) => {
      return value.productName;
    }),
    datasets: [
      {
        data: topProductByQuantity?.map((value) => {
          return value.count;
        }),
        backgroundColor: "#62B4FF",
        borderColor: "#62B4FF",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <h2 className="header-title">Tổng quan</h2>
      <div className="dashboard-overview">
        <div className="dashboard-overview-row row">
          <div className="col-3">
            <div
              style={{ background: "#3B76EF" }}
              className="dashboard-overview-card"
            >
              <div className="dashboard-overview-card-content">
                <div className="dashboard-overview-card-heading">
                  <h3>Doanh thu trong ngày</h3>
                </div>
                <div className="dashboard-overview-card-body">
                  <h3>{revenueToday?.toLocaleString("en")} VND</h3>
                </div>
              </div>
              <div className="dashboard-overview-card-img">
                <img src={revenueIcon} alt="" />
              </div>
            </div>
          </div>
          <div className="col-3">
            <div
              style={{ background: "#63C7FF" }}
              className="dashboard-overview-card "
            >
              <div className="dashboard-overview-card-content">
                <div className="dashboard-overview-card-heading">
                  <h3>Chi phí trong ngày</h3>
                </div>
                <div className="dashboard-overview-card-body">
                  <h3>{expensiveToday?.toLocaleString("en")} VND</h3>
                </div>
              </div>
              <div className="dashboard-overview-card-img">
                <img src={dashboardCostIcon} alt="" />
              </div>
            </div>
          </div>

          <div className="col-3">
            <div
              style={{ background: "#A66DD4" }}
              className="dashboard-overview-card "
            >
              <div className="dashboard-overview-card-content">
                <div className="dash-board-overview-card-content">
                  <div className="dashboard-overview-card-heading">
                    <h3>Số đơn trong ngày</h3>
                  </div>
                  <div className="dashboard-overview-card-body">
                    <h3>{countNumberToday?.toLocaleString("en")} đơn</h3>
                  </div>
                </div>
              </div>
              <div className="dashboard-overview-card-img">
                <img src={dashboardOrderIcon} alt="" />
              </div>
            </div>
          </div>
          <div className="col-3">
            <div
              style={{ background: "#00A856" }}
              className="dashboard-overview-card "
            >
              <div className="dash-board-overview-card-content">
                <div className="dashboard-overview-card-heading">
                  <h3>Lợi nhuận trong ngày</h3>
                </div>
                <div className="dashboard-overview-card-body">
                  <h3>
                    {(revenueToday - expensiveToday).toLocaleString("en")} VND
                  </h3>
                </div>
              </div>
              <div className="dashboard-overview-card-img">
                <img src={marginIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/**end dashboard overview */}

      <div className="div-customer-chart">
        <div className="div-top-customer">
          <div className="div-customer-header">
            <h3 className="title-header">Top 1 khách hàng</h3>
          </div>
          <div className="div-info-top-customer">
            <div className="avt-customer">
              <img src={topcustomer} alt="" />
            </div>
            <div className="info-customer">
              <p className="name">{top1Customer.name}</p>
              <p className="phonenumber">SĐT: {top1Customer.phone}</p>
              <div className="div-icon">
                <img className="icon-star" src={star} alt="" />
                <img className="icon-star" src={star} alt="" />
                <img className="icon-star" src={star} alt="" />
                <img className="icon-star" src={star} alt="" />
                <img className="icon-star" src={star} alt="" />
              </div>
            </div>
            <div className="div-total-point">
              <p className="title-total">Tổng điểm tích lũy</p>
              <p className="point">
                {top1Customer.point?.toLocaleString("en")} điểm
              </p>
            </div>
          </div>
        </div>
        <div className="div-info-char">
          <div className="div-customer-header">
            <h3 className="title-header">Số khách ghé mua</h3>
          </div>
          <div className="div-char">
            <LineChart data={dataCustomer} />
          </div>
        </div>
      </div>
      {/* *table dashboard */}
      <div className="table-dashboard-container">
        <div class="card">
          <div class="card-header">
            <h3>Top 6 sản phẩm có doanh thu cao nhất trong ngày</h3>
          </div>
          <div class="card-content">
            <table id="dashboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá bán</th>
                  <th>Số lượng bán</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {topProductByRevenue?.map((product, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{product._id.substr(product._id.length - 9)}</td>
                      <td>{product.productName}</td>
                      <td>{`${product.salePrice.toLocaleString("en")}đ`}</td>
                      <td>{product.count.toLocaleString("en")}</td>
                      <td>{`${product.totalSalePrice.toLocaleString(
                        "en"
                      )}đ`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* *end table dashboard */}
      {/* test */}
      
    </div>
  );
};

export default Dashboard;
