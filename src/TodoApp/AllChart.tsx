import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Line, Pie, Radar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const AllCharts: React.FC = () => {
  const navigate = useNavigate();

  const barData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
    datasets: [{ label: "Votes", data: [12, 19, 3, 5, 2], backgroundColor: "#facc15" }],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [300, 500, 100, 700, 400],
        fill: false,
        borderColor: "#38bdf8",
        tension: 0.3,
      },
    ],
  };

  const pieData = {
    labels: ["Done", "Pending", "In Progress"],
    datasets: [
      {
        label: "Tasks",
        data: [10, 7, 5],
        backgroundColor: ["#10b981", "#f43f5e", "#facc15"],
      },
    ],
  };

  const radarData = {
    labels: ["Planning", "Design", "Development", "Testing", "Deployment"],
    datasets: [
      {
        label: "Progress",
        data: [80, 70, 90, 60, 50],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        pointBackgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-neutral-900 min-h-screen text-white">
      {/* Back Icon */}
      <div className="col-span-full flex items-center mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white hover:text-amber-400 transition"
        >
          <IoArrowBack className="text-2xl" />
          <span className="text-lg">Back to Home</span>
        </button>
      </div>

      <div className="bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
        <Bar data={barData} options={{ responsive: true }} />
      </div>

      <div className="bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Line Chart</h3>
        <Line data={lineData} options={{ responsive: true }} />
      </div>

      <div className="bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
        <Pie data={pieData} />
      </div>

      <div className="bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Radar Chart</h3>
        <Radar data={radarData} />
      </div>
    </div>
  );
};

export default AllCharts;
