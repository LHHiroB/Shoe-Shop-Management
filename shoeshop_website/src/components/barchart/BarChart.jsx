import React from "react";
import { Bar } from "react-chartjs-2";
import "./barchart.css";
const BarChart = ({ horizontal, data, title }) => {
  const options = {
    indexAxis: horizontal ? "y" : "x",
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },

    responsive: true,
    scales: {
      x: {
        ticks: {
          precision: 0,
        },
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "right",
        labels: {
          color: "red",
        },
      },
    },
  };
  return (
    <>
      <div className="bar-container">
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>{title}</h3>
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default BarChart;
