import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Analytics.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Analytics({ onBack }) {
  const stats = {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    collaborations: 8,
  };

  // Bar chart data
  const data = {
    labels: ["Active Projects", "Completed Projects"],
    datasets: [
      {
        label: "Projects",
        data: [stats.activeProjects, stats.completedProjects],
        backgroundColor: ["#36A2EB", "#4BC0C0"],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Projects Overview" },
    },
    scales: {
      y: { beginAtZero: true, stepSize: 1 },
    },
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>Analytics / Reports</h1>
      </div>

      <div className="analytics-grid">
        {Object.keys(stats).map((key, idx) => (
          <div key={idx} className="analytics-card">
            <h3>{key.replace(/([A-Z])/g, ' $1')}</h3>
            <p>{stats[key]}</p>
          </div>
        ))}
      </div>

      <div className="analytics-chart">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
