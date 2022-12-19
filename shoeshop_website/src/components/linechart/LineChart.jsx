import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,

  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        precision: 0,
      },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export function LineChart({ data }) {
  return <Line options={options} data={data} />;
}
