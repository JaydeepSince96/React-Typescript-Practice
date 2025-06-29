import React, { useMemo } from "react";
import { useSelector } from "react-redux"; // Import useSelector and useDispatch
import type { RootState } from "@/store"; // Import RootState
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
import { SidebarLayout } from "@/layout/SidebarLayout";
import { TbListSearch } from "react-icons/tb"; // Icon for no data

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
  const todos = useSelector((state: RootState) => state.todo); // Get todos from Redux store

  // --- Data Processing for Charts ---
  // Memoize processed data based on `todos` state
  const processedChartData = useMemo(() => {
    // Initialize counts
    let highPriorityCount = 0;
    let mediumPriorityCount = 0;
    let lowPriorityCount = 0;
    let completedCount = 0;
    let pendingCount = 0;

    // For line chart (tasks completed per week - simplified for example)
    // You'd need more sophisticated date parsing and grouping for real weekly data
    const weeklyCompleted: { [key: string]: number } = {}; // { 'YYYY-WW': count }

    todos.forEach((todo) => {
      // Priority counts
      if (todo.priority === "High") highPriorityCount++;
      else if (todo.priority === "Medium") mediumPriorityCount++;
      else if (todo.priority === "Low") lowPriorityCount++;

      // Status counts
      if (todo.isDone) completedCount++;
      else pendingCount++;

      // Simplified weekly completion for example (actual implementation would need proper date logic)
      if (todo.isDone) {
        const date = new Date(todo.timeAndDate);
        // Simple way to group by "week" (e.g., month + day/7) - needs refinement for actual weeks
        const weekKey = `${date.getFullYear()}-${Math.floor(
          date.getMonth() * 4 + date.getDate() / 7
        )}`;
        weeklyCompleted[weekKey] = (weeklyCompleted[weekKey] || 0) + 1;
      }
    });

    const hasAnyData = todos.length > 0;

    return {
      hasAnyData, // Flag to check if there's any data to display charts
      barData: {
        labels: [
          "High Priority",
          "Medium Priority",
          "Low Priority",
          "Completed",
          "Pending",
        ],
        datasets: [
          {
            label: "Task Count",
            data: [
              highPriorityCount,
              mediumPriorityCount,
              lowPriorityCount,
              completedCount,
              pendingCount,
            ],
            backgroundColor: [
              "rgba(239, 68, 68, 0.7)", // Red for High
              "rgba(251, 191, 36, 0.7)", // Yellow for Medium
              "rgba(59, 130, 246, 0.7)", // Blue for Low
              "rgba(16, 185, 129, 0.7)", // Green for Completed
              "rgba(244, 63, 94, 0.7)", // Rose for Pending (Overdue might need a separate field)
            ],
            borderColor: [
              "rgb(239, 68, 68)",
              "rgb(251, 191, 36)",
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(244, 63, 94)",
            ],
            borderWidth: 1,
          },
        ],
      },
      lineData: {
        labels: Object.keys(weeklyCompleted).sort(), // Sort labels
        datasets: [
          {
            label: "Tasks Completed",
            data: Object.keys(weeklyCompleted)
              .sort()
              .map((key) => weeklyCompleted[key]),
            fill: true,
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56, 189, 248, 0.2)",
            tension: 0.4,
            pointBackgroundColor: "#38bdf8",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#38bdf8",
          },
        ],
      },
      pieData: {
        labels: ["Done", "Pending"], // Assuming In Progress is covered by pending unless a separate status
        datasets: [
          {
            label: "Tasks Status",
            data: [completedCount, pendingCount],
            backgroundColor: ["#10b981", "#f43f5e"], // Green for Done, Red for Pending
            hoverOffset: 8,
          },
        ],
      },
      // Radar data would likely come from more complex metrics, keeping it static for now
      radarData: {
        labels: ["Planning", "Design", "Development", "Testing", "Deployment"],
        datasets: [
          {
            label: "Average Progress (%)",
            data: [80, 70, 90, 60, 50],
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "#3b82f6",
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#3b82f6",
          },
        ],
      },
    };
  }, [todos]); // DEPENDENCY: This memoized value recalculates ONLY when `todos` array changes

  // Destructure processed data
  const { hasAnyData, barData, lineData, pieData, radarData } =
    processedChartData;

  // Memoize chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#cbd5e1", // text-slate-300
          },
        },
        tooltip: {
          backgroundColor: "#333",
          titleColor: "#fff",
          bodyColor: "#e2e8f0",
          borderColor: "#555",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#cbd5e1",
          },
          grid: {
            color: "rgba(255,255,255,0.08)",
            borderColor: "#555",
          },
        },
        y: {
          ticks: {
            color: "#cbd5e1",
          },
          grid: {
            color: "rgba(255,255,255,0.08)",
            borderColor: "#555",
          },
        },
      },
    }),
    []
  ); // Empty dependency array means this object is created once

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6 bg-neutral-900 min-h-screen text-white">
        {/* Back Icon */}
        <div className="col-span-full flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800 transition-colors px-4 py-2 rounded-md font-semibold"
          >
            <IoArrowBack className="text-2xl" />
            <span className="text-lg">Back to Home</span>
          </button>
        </div>

        {hasAnyData ? ( // Conditional rendering based on whether there's data
          <>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700">
              <h3 className="text-xl font-semibold mb-4 text-sky-400">
                Task Count by Priority & Status
              </h3>
              <Bar data={barData} options={chartOptions} />
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700">
              <h3 className="text-xl font-semibold mb-4 text-sky-400">
                Tasks Completed Over Time
              </h3>
              <Line data={lineData} options={chartOptions} />
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700 flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4 text-sky-400">
                Task Status Distribution
              </h3>
              <div className="relative h-64 w-64 md:h-80 md:w-80">
                <Pie
                  data={pieData}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                  }}
                />
              </div>
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700 flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4 text-sky-400">
                Project Progress Overview
              </h3>
              <div className="relative h-64 w-64 md:h-80 md:w-80">
                <Radar
                  data={radarData}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-full text-center py-20 flex flex-col items-center justify-center">
            <TbListSearch className="size-20 text-neutral-600 mb-4" />
            <p className="text-neutral-400 text-xl font-semibold">
              No productivity data available yet.
            </p>
            <p className="text-neutral-500 mt-2">
              Add some tasks and mark them complete to see your progress!
            </p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default AllCharts;
