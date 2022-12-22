import React, { useEffect, useState } from "react";
import BarChart from "./BarChart/BarChart";
import "./revenues.css";

import TextField from "@mui/material/TextField";
import DatePicker from "react-date-picker";
import axios from "axios";
import TableReport from "./TableReport/TableReport";

// import ExportCSV from "./Excel/Excel";
const dateNow = new Date();
const listClothes = [];
const listDay = [];
const dataRevenue = {
  labels: listDay,
  datasets: [
    {
      data: [],
      backgroundColor: "#62B4FF",
      borderColor: "#62B4FF",
      borderWidth: 1,
    },
  ],
};
// Set Default revenues this month
const one_day = 1000 * 60 * 60 * 24;

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

const saleProductColumns = [
  "Mã sản phẩm",
  "Sản phẩm",
  "Số lượng bán",
  "Doanh thu (vnđ)",
  "Lợi nhuận (vnđ)",
];
const returnProductColumm = ["Mã sản phẩm", "Tên sản phẩm", "Số lương đổi trả"];
const ordersTodayRows = [];
for (var i = 0; i < 3; i++) {
  ordersTodayRows[i] = {
    _id: "ABCDE",
    productName: "Sản phẩm",
    sellQuantity: 0,
    revenue: 0,
    profit: 0,
  };
}

const Revenues = () => {
  const [displayTypeSelect, setDisplayTypeSelect] = useState("chart");
  const [displayTypeSelect2, setDisplayTypeSelect2] = useState("month");
  const [reportFilter, setReportFilter] = useState("product");
  const [Orders, setOrders] = useState([]);
  const [titleChar, setTitleChar] = useState("Doanh thu tháng này");
  const [titleReport, setTitleReport] = useState("Báo cáo doanh thu");
  const [DataRevenue, setDataRevenue] = useState(dataRevenue);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportProduct, setReportProduct] = useState(ordersTodayRows);
  const [columnReport, setColumnReport] = useState(saleProductColumns);
  console.log(displayTypeSelect.toUpperCase());

  function resetDataRevenuebyMonth(month, year) {
    listDay.length = 0;
    dataRevenue.datasets[0].data.length = 0;
    for (var i = 0; i < daysInMonth(month, year); i++) {
      listDay[i] = i + 1;
      dataRevenue.datasets[0].data[i] = 0;
      if (dateNow.getDate() == i + 1) listDay[i] = "Hôm nay";
    }
    dataRevenue.labels = listDay;
    setDataRevenue(dataRevenue);
  }
  function setDataCurrentYear() {
    console.log("Chạy set data current year");
    listDay.length = 0;
    dataRevenue.datasets[0].data.length = 0;
    for (var i = 0; i < 12; i++) {
      listDay[i] = i + 1;
      dataRevenue.datasets[0].data[i] = 0;
    }
    Orders.forEach((item) => {
      const dateOrder = new Date(item.dateOrder);
      var i = dateOrder.getMonth();
      const revenue = item.orderTotal - item.totalReturnPrice;
      if (revenue > 0) dataRevenue.datasets[0].data[i] += revenue;
    });
    setDataRevenue((DataRevenue) => ({
      ...DataRevenue,
      dataRevenue,
    }));
  }
  function setDataRevenueByMonthYear(orders, month, year) {
    console.log("Chạy by month year");
    console.log(month + "/" + year);
    resetDataRevenuebyMonth(month, year);
    orders.forEach((item) => {
      const dateOrder = new Date(item.dateOrder);
      // console.log("Vòng");
      if (
        month == dateOrder.getMonth() + 1 &&
        year == dateOrder.getFullYear()
      ) {
        // console.log(
        //   "ID order:" +
        //     item._id +
        //     "  " +
        //     dateOrder +
        //     " Data:" +
        //     dataRevenue.labels[dateOrder.getDate() - 1] +
        //     "Revenue: " +
        //     dataRevenue.datasets[0].data[dateOrder.getDate() - 1]
        // );
        const revenue = item.orderTotal - item.totalReturnPrice;
        if (revenue > 0)
          dataRevenue.datasets[0].data[dateOrder.getDate() - 1] += revenue;
      }
    });
    // setDataRevenue(dataRevenue);
    setDataRevenue((DataRevenue) => ({
      ...DataRevenue,
      dataRevenue,
    }));
    console.log(DataRevenue);
  }
  function handleFilter() {
    if (toDate == "" || fromDate == "") return;
    setDateRevenuebyDate(Orders, fromDate, toDate);
  }
  function setDateRevenuebyDate(orders, dateFrom, dateTo) {
    console.log("Chạy setData by date");
    console.log(dateFrom);
    console.log(dateTo);
    listDay.length = 0;
    dataRevenue.datasets[0].data.length = 0;
    var numberOfDays = (
      Math.round(dateTo.getTime() - dateFrom.getTime()) / one_day
    ).toFixed(0);
    console.log("Số ngày " + numberOfDays);
    var dateCount = new Date(dateFrom);
    for (var i = 0; i < numberOfDays; i++) {
      console.log(i);
      listDay[i] = dateCount.getDate() + "/" + String(dateCount.getMonth() + 1);
      if (
        dateCount.getDate() == dateNow.getDate() &&
        dateCount.getMonth() == dateNow.getMonth() &&
        dateCount.getFullYear() == dateNow.getFullYear()
      )
        listDay[i] = "Hôm nay";
      console.log(listDay[i]);
      dataRevenue.datasets[0].data[i] = 0;
      Orders.forEach((item) => {
        const dateOrder = new Date(item.dateOrder);
        if (
          dateCount.getMonth() == dateOrder.getMonth() &&
          dateCount.getFullYear() == dateOrder.getFullYear() &&
          dateCount.getDate() == dateOrder.getDate()
        ) {
          const revenue = item.orderTotal - item.totalReturnPrice;
          if (revenue > 0) dataRevenue.datasets[0].data[i] += revenue;
        }
      });
      dateCount.setDate(dateCount.getDate() + 1);
    }
    console.log(dataRevenue);
    dataRevenue.labels = listDay;
    setDataRevenue((DataRevenue) => ({
      ...DataRevenue,
      dataRevenue,
    }));
  }
  useEffect( () => {
    axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/orders/list")
      .then((res) => {
        setOrders(res.data);
        setDataRevenueByMonthYear(
          res.data,
          dateNow.getMonth() + 1,
          dateNow.getFullYear()
        );
      })
      .catch((err) => {
        console.log(err.res);
      });
    SellProductReport();
  }, []);
  // useEffect(() => {
  //   axios
  //     .get("https://deloy-backend-shoeshop.onrender.com/api/orders/list")
  //     .then(async(res) => {
  //       setOrders(res.data);
  //       setDataRevenueByMonthYear(
  //         res.data,
  //         dateNow.getMonth() + 1,
  //         dateNow.getFullYear()
  //         );
  //     })
  //     .catch((err) => {
  //       console.log(err.res);
  //     });
  //     SellProductReport();
  //   })
  async function ReturnReport() {
    await axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/products/return")
      .then(async (res) => {
        setReportProduct(res.data);
      })
      .catch((err) => {
        console.log(err.res);
      });
  }
  async function SellProductReport() {
    await axios
      .get("https://deloy-backend-shoeshop.onrender.com/api/products/sell")
      .then(async (res) => {
        setReportProduct(res.data);
      })
      .catch((err) => {
        console.log(err.res);
      });
  }
  async function SellProductReportwithDate(fromDate, toDate) {
    console.log(fromDate);
    console.log(toDate);
    await axios
      .post("https://deloy-backend-shoeshop.onrender.com/api/products/sellbyDate", {
        fromDate: fromDate,
        toDate: toDate,
      })
      .then(async (res) => {
        setReportProduct(res.data);
      })
      .catch((err) => {
        console.log(err.res);
      });
  }

  //Render
  return (
    <div className="revenues-container">
      <div className="row">
        <div className="col-3">
          <div className="revuenues-filter">
            <h2 className="revenues-title">Báo cáo bán hàng</h2>
            {/* <div className="revenues-card"> */}
              {/* <h3 className="revenues-card-title">Kiểu hiển thị</h3> */}
              {/* <div className="revenues-card-row">
                <input
                  checked={displayTypeSelect === "chart"}
                  type="radio"
                  name="display"
                  value="chart"
                  onChange={(e) => {
                    setDisplayTypeSelect(e.target.value);
                    setDisplayTypeSelect2("month");
                    setReportFilter("product");
                    setDataRevenueByMonthYear(
                      Orders,
                      dateNow.getMonth() + 1,
                      dateNow.getFullYear()
                    );
                  }}
                />
                <span>Biểu đồ doanh thu</span>
              </div> */}
              {/* <div className="revenues-card-row">
                <input
                  checked={displayTypeSelect === "report"}
                  type="radio"
                  name="display"
                  id=""
                  value="report"
                  onChange={(e) => {
                    setDisplayTypeSelect(e.target.value);
                    setDisplayTypeSelect2("alltime");
                  }}
                />
                <span>Báo cáo số liệu</span>
              </div> */}
            {/* </div> */}
            {displayTypeSelect === "report" ? (
              <div className="revenues-card">
                <h3 className="revenues-card-title">Loại báo cáo</h3>
                <div className="revenues-card-row">
                  <input
                    checked={reportFilter === "product"}
                    type="radio"
                    name=""
                    id=""
                    onClick={() => {
                      setReportFilter("product");
                      setColumnReport(saleProductColumns);
                      SellProductReport();
                      setTitleReport("Báo cáo doanh thu");
                      setDisplayTypeSelect2("alltime");
                    }}
                  />
                  <span>Hàng hóa</span>
                </div>
                <div className="revenues-card-row">
                  <input
                    checked={reportFilter === "return"}
                    type="radio"
                    name=""
                    id=""
                    onClick={() => {
                      setReportFilter("return");
                      setColumnReport(returnProductColumm);
                      ReturnReport();
                      setTitleReport("Báo cáo về các sản phẩm đổi trả");
                    }}
                  />
                  <span>Trả hàng</span>
                </div>
              </div>
            ) : null}
            {reportFilter === "return" ? null : (
              <div className="revenues-card">
                <h3 className="revenues-card-title">Thời gian</h3>
                {displayTypeSelect === "report" ? (
                  <div className="revenues-card-row">
                    <input
                      checked={displayTypeSelect2 === "alltime"}
                      type="radio"
                      name="year"
                      id=""
                      onChange={(e) => {
                        setDisplayTypeSelect2("alltime");
                        setTitleReport("Báo cáo doanh thu");
                        SellProductReport();
                      }}
                    />
                    <span>Toàn thời gian</span>
                  </div>
                ) : null}
                <div className="revenues-card-row">
                  <input
                    checked={displayTypeSelect2 === "year"}
                    type="radio"
                    name="year"
                    id=""
                    onChange={(e) => {
                      setDisplayTypeSelect2("year");
                      if (displayTypeSelect === "report") {
                        var endYear = new Date(
                          new Date().getFullYear(),
                          11,
                          31,
                          23,
                          59,
                          59,
                          59
                        );
                        var startYear = new Date(
                          new Date().getFullYear(),
                          0,
                          1,
                          0,
                          0,
                          0,
                          0
                        );
                        setTitleReport(
                          "Báo cáo doanh thu năm " + dateNow.getFullYear()
                        );
                        return SellProductReportwithDate(startYear, endYear);
                      }

                      setDataCurrentYear();
                    }}
                  />
                  <span>Năm nay</span>
                </div>
                <div className="revenues-card-row">
                  <input
                    checked={displayTypeSelect2 === "month"}
                    type="radio"
                    name="month"
                    id=""
                    onChange={(e) => {
                      setDisplayTypeSelect2("month");
                      if (displayTypeSelect === "report") {
                        let endMonth = new Date();
                        let startMonth = new Date();
                        startMonth.setDate(1);
                        endMonth.setDate(
                          daysInMonth(
                            dateNow.getMonth() + 1,
                            dateNow.getFullYear()
                          )
                        );
                        startMonth.setHours(0, 0, 0, 0);
                        endMonth.setHours(23, 59, 59, 59);
                        setTitleReport(
                          "Báo cáo doanh thu tháng " +
                            String(dateNow.getMonth() + 1)
                        );
                        SellProductReportwithDate(startMonth, endMonth);
                      } else {
                        setTitleChar("Doanh thu tháng này");
                        setDataRevenueByMonthYear(
                          Orders,
                          dateNow.getMonth() + 1,
                          dateNow.getFullYear()
                        );
                      }
                    }}
                  />
                  <span>Tháng này</span>
                </div>
                {displayTypeSelect === "report" ? (
                  <div className="revenues-card-row">
                    <input
                      checked={displayTypeSelect2 === "today"}
                      type="radio"
                      name="year"
                      id=""
                      onChange={(e) => {
                        setDisplayTypeSelect2("today");
                        setTitleReport(
                          "Báo cáo doanh thu trong ngày hôm nay " +
                            dateNow.getDate() +
                            "/" +
                            String(dateNow.getMonth() + 1) +
                            "/" +
                            dateNow.getFullYear()
                        );
                        SellProductReportwithDate(
                          new Date(
                            dateNow.getFullYear(),
                            dateNow.getMonth(),
                            dateNow.getDate(),
                            0,
                            0,
                            0,
                            0
                          ),
                          new Date(
                            dateNow.getFullYear(),
                            dateNow.getMonth(),
                            dateNow.getDate(),
                            23,
                            59,
                            59,
                            59
                          )
                        );
                      }}
                    />
                    <span>Hôm nay</span>
                  </div>
                ) : null}
                <div className="revenues-card-row">
                  <input
                    checked={displayTypeSelect2 === "last7days"}
                    type="radio"
                    name="last7days"
                    id=""
                    onChange={(e) => {
                      setDisplayTypeSelect2("last7days");
                      var today = new Date(
                        dateNow.getFullYear(),
                        dateNow.getMonth(),
                        dateNow.getDate(),
                        23,
                        59,
                        59,
                        59
                      );
                      var lastWeek = new Date(
                        dateNow.getFullYear(),
                        dateNow.getMonth(),
                        dateNow.getDate() - 7,
                        0,
                        0,
                        0,
                        0
                      );
                      let date =
                        lastWeek.getDate() +
                        "/" +
                        String(lastWeek.getMonth() + 1) +
                        "/" +
                        lastWeek.getFullYear() +
                        "  -  " +
                        today.getDate() +
                        "/" +
                        String(today.getMonth() + 1) +
                        "/" +
                        today.getFullYear();
                      if (displayTypeSelect === "report") {
                        setTitleReport("Báo cáo doanh thu " + date);
                        SellProductReportwithDate(lastWeek, today);
                      } else {
                        setTitleChar("Doanh thu " + date);
                        setDateRevenuebyDate(Orders, lastWeek, today);
                      }
                    }}
                  />
                  <span>7 ngày gần nhất</span>
                </div>
                <div className="revenues-card-row">
                  <input
                    checked={displayTypeSelect2 === "options"}
                    type="radio"
                    name="options"
                    id=""
                    onChange={(e) => {}}
                  />
                  <span>Tùy chỉnh</span>
                </div>
                <div className="revenues-card-row">
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      views={["day", "month", "year"]}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      label={fromDate ? "" : "Từ ngày.."}
                      value={fromDate}
                      onChange={(newValue) => {
                        setFromDate(new Date(newValue.setHours(0, 0, 0, 0)));
                        setDisplayTypeSelect2("options");
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
                <div className="revenues-card-row">
                    <DatePicker
                      minDate={fromDate}
                      inputFormat="dd/MM/yyyy"
                      views={["day", "month", "year"]}
                      label={toDate ? "" : "Đến ngày..."}
                      value={toDate}
                      onChange={(newValue) => {
                        setToDate(new Date(newValue.setHours(23, 59, 59, 59)));
                        setDisplayTypeSelect2("options");
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
                <div className="revenues-card-row submit">
                  <button
                    onClick={() => {
                      if (fromDate == "" || toDate == "") {
                        alert("Bạn cần chọn đủ cả 2 ngày");
                        return;
                      }
                      if (fromDate > toDate) {
                        return alert(
                          "Không thể chọn ngày bắt đầu muộn hơn ngày kết thúc!!!"
                        );
                      }
                      console.log(displayTypeSelect);
                      let date =
                        fromDate.getDate() +
                        "/" +
                        String(fromDate.getMonth() + 1) +
                        "/" +
                        fromDate.getFullYear() +
                        "  -  " +
                        toDate.getDate() +
                        "/" +
                        String(toDate.getMonth() + 1) +
                        "/" +
                        toDate.getFullYear();
                      if (displayTypeSelect === "chart") {
                        setTitleChar("Doanh thu từ " + date);
                        handleFilter();
                      } else {
                        setTitleReport("Báo cáo doanh thu từ " + date);
                        SellProductReportwithDate(fromDate, toDate);
                      }
                    }}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}
            {displayTypeSelect === "report" ? (
              <div className="revenues-card">
                <div className="revenues-card-row">
                  {/* <ExportCSV
                    csvData={reportProduct}
                    fileName={titleReport}
                  ></ExportCSV> */}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-9">
          {displayTypeSelect === "chart" && (
            <div className="bar-chart-display">
              <BarChart title={titleChar} data={DataRevenue} />
            </div>
          )}
          {displayTypeSelect === "report" && (
            <div className="report-display">
              <TableReport
                title={titleReport}
                columns={columnReport}
                rows={reportProduct}
                ReportFilter={reportFilter}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Revenues;
