import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBack,
  IoCheckmarkDoneCircleOutline,
  IoTimeOutline,
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
  IoArrowForwardCircleOutline,
  IoListCircleOutline,
} from "react-icons/io5";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { TbListSearch } from "react-icons/tb";
import { Button } from "@/components/ui/button";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Stat Card Component for the dashboard
const StatCard = ({
  title,
  value,
  icon,
  className,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-neutral-800 p-5 rounded-lg shadow-lg border border-neutral-700 flex items-center gap-4 ${className}`}
  >
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-neutral-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const AllCharts: React.FC = () => {
  const navigate = useNavigate();
  const todos = useSelector((state: RootState) => state.todo);

  // Memoize the processed chart data to prevent recalculation on every render
  const processedData = useMemo(() => {
    let highPriorityCount = 0;
    let mediumPriorityCount = 0;
    let lowPriorityCount = 0;
    let completedCount = 0;
    let pendingCount = 0;

    todos.forEach((todo) => {
      if (todo.priority === "High") highPriorityCount++;
      else if (todo.priority === "Medium") mediumPriorityCount++;
      else if (todo.priority === "Low") lowPriorityCount++;

      if (todo.isDone) completedCount++;
      else pendingCount++;
    });

    return {
      totalTasks: todos.length,
      completedCount,
      pendingCount,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
      hasAnyData: todos.length > 0,
      barData: {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            label: "Task Count by Priority",
            data: [highPriorityCount, mediumPriorityCount, lowPriorityCount],
            backgroundColor: [
              "rgba(239, 68, 68, 0.7)",
              "rgba(251, 191, 36, 0.7)",
              "rgba(59, 130, 246, 0.7)",
            ],
            borderColor: [
              "rgb(239, 68, 68)",
              "rgb(251, 191, 36)",
              "rgb(59, 130, 246)",
            ],
            borderWidth: 1,
          },
        ],
      },
      pieData: {
        labels: ["Completed", "Pending"],
        datasets: [
          {
            label: "Tasks Status",
            data: [completedCount, pendingCount],
            backgroundColor: ["#10b981", "#f59e0b"],
            hoverOffset: 8,
          },
        ],
      },
    };
  }, [todos]);

  // Memoize chart options to prevent re-creation on every render
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#cbd5e1",
          },
        },
        tooltip: {
          backgroundColor: "#1f2937",
          titleColor: "#f9fafb",
          bodyColor: "#e5e7eb",
          borderColor: "#4b5563",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
        y: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
      },
    }),
    []
  );

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 bg-neutral-900 min-h-screen">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800"
          >
            <IoArrowBack className="text-xl" />
            <span>Back to Home</span>
          </Button>
        </div>

        {processedData.hasAnyData ? (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Tasks"
                value={processedData.totalTasks}
                icon={<IoListCircleOutline className="text-sky-400" />}
              />
              <StatCard
                title="Completed Tasks"
                value={processedData.completedCount}
                icon={
                  <IoCheckmarkDoneCircleOutline className="text-green-500" />
                }
              />
              <StatCard
                title="Pending Tasks"
                value={processedData.pendingCount}
                icon={<IoTimeOutline className="text-yellow-500" />}
              />
              <StatCard
                title="High Priority"
                value={processedData.highPriorityCount}
                icon={<IoArrowUpCircleOutline className="text-red-500" />}
              />
              <StatCard
                title="Medium Priority"
                value={processedData.mediumPriorityCount}
                icon={
                  <IoArrowForwardCircleOutline className="text-yellow-500" />
                }
              />
              <StatCard
                title="Low Priority"
                value={processedData.lowPriorityCount}
                icon={<IoArrowDownCircleOutline className="text-blue-500" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700 h-96">
                <h3 className="text-xl font-semibold mb-4 text-sky-400">
                  Priority Breakdown
                </h3>
                <Bar data={processedData.barData} options={chartOptions} />
              </div>
              <div className="lg:col-span-2 bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700 h-96 flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold mb-4 text-sky-400">
                  Status Distribution
                </h3>
                <div className="relative h-64 w-64">
                  <Pie
                    data={processedData.pieData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          position: "top",
                          labels: { color: "#cbd5e1" },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
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