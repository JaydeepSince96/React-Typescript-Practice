import React, { useEffect, useState } from "react";
import { getTaskStats } from "@/api/stats/stats-api";
import type { IStatsResponse } from "@/api/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBack,
  IoCheckmarkDoneCircleOutline,
  IoTimeOutline,
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
  IoArrowForwardCircleOutline,
  IoListCircleOutline,
  IoWarningOutline,
  IoStatsChartOutline,
  IoTrendingUpOutline,
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
  ArcElement,
  LineElement,
  PointElement
);

// Professional Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  className,
  isPercentage = false,
  trend,
  trendValue,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  isPercentage?: boolean;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
}) => (
  <div
    className={`bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-xl shadow-xl border border-neutral-700 hover:border-neutral-600 transition-all duration-300 ${className}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-4xl p-3 rounded-lg bg-neutral-700/50">{icon}</div>
        <div>
          <p className="text-sm text-neutral-400 font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-white mt-1">
            {value}{isPercentage ? "%" : ""}
          </p>
          {trend && trendValue !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-neutral-400"
            }`}>
              {trend === "up" ? <IoTrendingUpOutline /> : trend === "down" ? <IoArrowDownCircleOutline /> : null}
              <span>{trendValue}% from last week</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ProductivityReports: React.FC = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState<IStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats data from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching stats...");
        const stats = await getTaskStats();
        console.log("Received stats:", stats);
        setStatsData(stats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Process data for charts
  const chartData = React.useMemo(() => {
    if (!statsData) return null;

    const { labelStats, overallStats } = statsData;

    // Priority-wise task distribution
    const priorityData = {
      labels: labelStats.map(stat => 
        stat.label.charAt(0).toUpperCase() + stat.label.slice(1).replace(" priority", "")
      ),
      datasets: [
        {
          label: "Total Tasks",
          data: labelStats.map(stat => stat.total),
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)",  // High - Red
            "rgba(251, 191, 36, 0.8)", // Medium - Yellow
            "rgba(59, 130, 246, 0.8)", // Low - Blue
            "rgba(156, 163, 175, 0.8)" // Priority - Gray
          ],
          borderColor: [
            "rgb(239, 68, 68)",
            "rgb(251, 191, 36)",
            "rgb(59, 130, 246)",
            "rgb(156, 163, 175)"
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: "Completed Tasks",
          data: labelStats.map(stat => stat.completed),
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(34, 197, 94, 0.8)"
          ],
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 2,
          borderRadius: 8,
        }
      ],
    };

    // Completion status pie chart
    const completionData = {
      labels: ["Completed", "Pending", "Overdue"],
      datasets: [
        {
          data: [
            overallStats.completedTasks,
            overallStats.pendingTasks - overallStats.overdueTasks,
            overallStats.overdueTasks
          ],
          backgroundColor: [
            "#10b981", // Green for completed
            "#f59e0b", // Yellow for pending
            "#ef4444"  // Red for overdue
          ],
          borderColor: "#374151",
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };

    // Trend line chart (mock data for demonstration)
    const trendData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Current"],
      datasets: [
        {
          label: "Completion Rate",
          data: [65, 70, 75, 80, overallStats.overallCompletionRate],
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#06b6d4",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    };

    return { priorityData, completionData, trendData };
  }, [statsData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#cbd5e1",
          font: {
            size: 12,
            weight: "bold" as const,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        borderColor: "#4b5563",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { 
          color: "#9ca3af",
          font: { size: 11 }
        },
        grid: { 
          color: "rgba(255,255,255,0.05)",
          borderColor: "rgba(255,255,255,0.1)"
        },
        border: {
          color: "rgba(255,255,255,0.1)"
        }
      },
      y: {
        ticks: { 
          color: "#9ca3af",
          font: { size: 11 }
        },
        grid: { 
          color: "rgba(255,255,255,0.05)",
          borderColor: "rgba(255,255,255,0.1)"
        },
        border: {
          color: "rgba(255,255,255,0.1)"
        }
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#cbd5e1",
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        borderColor: "#4b5563",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        display: false,
      },
    },
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-neutral-900 text-white p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <IoArrowBack className="text-xl" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                Productivity Dashboard
              </h1>
              <p className="text-neutral-400 mt-2">
                Comprehensive insights into your task management and productivity metrics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sky-400">
            <IoStatsChartOutline className="text-2xl" />
            <span className="text-sm font-medium">Real-time Analytics</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
              <div className="text-sky-400 text-lg font-medium">Loading analytics...</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-red-300 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <IoWarningOutline className="text-2xl text-red-400" />
              <h3 className="font-semibold text-lg">Failed to load analytics</h3>
            </div>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {statsData && !isLoading && !error && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Tasks"
                value={statsData.overallStats.totalTasks}
                icon={<IoListCircleOutline className="text-sky-400" />}
                trend="up"
                trendValue={12}
              />
              <StatCard
                title="Completed"
                value={statsData.overallStats.completedTasks}
                icon={<IoCheckmarkDoneCircleOutline className="text-green-400" />}
                trend="up"
                trendValue={8}
              />
              <StatCard
                title="Pending"
                value={statsData.overallStats.pendingTasks}
                icon={<IoTimeOutline className="text-yellow-400" />}
                trend="down"
                trendValue={5}
              />
              <StatCard
                title="Overdue"
                value={statsData.overallStats.overdueTasks}
                icon={<IoWarningOutline className="text-red-400" />}
                trend="down"
                trendValue={15}
              />
            </div>

            {/* Priority Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.labelStats.map((stat) => (
                <StatCard
                  key={stat.label}
                  title={stat.label.charAt(0).toUpperCase() + stat.label.slice(1).replace(" priority", " Priority")}
                  value={stat.total}
                  icon={
                    stat.label.includes("high") ? (
                      <IoArrowUpCircleOutline className="text-red-400" />
                    ) : stat.label.includes("medium") ? (
                      <IoArrowForwardCircleOutline className="text-yellow-400" />
                    ) : (
                      <IoArrowDownCircleOutline className="text-blue-400" />
                    )
                  }
                  className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50"
                />
              ))}
              <StatCard
                title="Completion Rate"
                value={Math.round(statsData.overallStats.overallCompletionRate)}
                icon={<IoTrendingUpOutline className="text-green-400" />}
                isPercentage={true}
                trend="up"
                trendValue={3}
                className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Priority Distribution Chart */}
              <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-xl shadow-xl border border-neutral-700">
                <h3 className="text-xl font-semibold mb-6 text-sky-400 flex items-center gap-2">
                  <IoStatsChartOutline />
                  Priority Distribution
                </h3>
                <div className="h-80">
                  {chartData && (
                    <Bar data={chartData.priorityData} options={chartOptions} />
                  )}
                </div>
              </div>

              {/* Completion Status Chart */}
              <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-xl shadow-xl border border-neutral-700">
                <h3 className="text-xl font-semibold mb-6 text-sky-400 flex items-center gap-2">
                  <IoCheckmarkDoneCircleOutline />
                  Task Status Breakdown
                </h3>
                <div className="h-80">
                  {chartData && (
                    <Pie data={chartData.completionData} options={pieOptions} />
                  )}
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-xl shadow-xl border border-neutral-700">
              <h3 className="text-xl font-semibold mb-6 text-sky-400 flex items-center gap-2">
                <IoTrendingUpOutline />
                Completion Rate Trend
              </h3>
              <div className="h-80">
                {chartData && (
                  <Line data={chartData.trendData} options={lineOptions} />
                )}
              </div>
            </div>

            {/* Detailed Stats Table */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 rounded-xl shadow-xl border border-neutral-700">
              <h3 className="text-xl font-semibold mb-6 text-sky-400 flex items-center gap-2">
                <IoListCircleOutline />
                Detailed Priority Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-700">
                      <th className="text-left py-3 px-4 font-semibold text-neutral-300">Priority</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-300">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-300">Completed</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-300">Pending</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-300">Overdue</th>
                      <th className="text-left py-3 px-4 font-semibold text-neutral-300">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsData.labelStats.map((stat) => (
                      <tr key={stat.label} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {stat.label.includes("high") ? (
                              <IoArrowUpCircleOutline className="text-red-400" />
                            ) : stat.label.includes("medium") ? (
                              <IoArrowForwardCircleOutline className="text-yellow-400" />
                            ) : (
                              <IoArrowDownCircleOutline className="text-blue-400" />
                            )}
                            <span className="capitalize font-medium">
                              {stat.label.replace(" priority", "")}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold">{stat.total}</td>
                        <td className="py-3 px-4 text-green-400 font-semibold">{stat.completed}</td>
                        <td className="py-3 px-4 text-yellow-400 font-semibold">{stat.pending}</td>
                        <td className="py-3 px-4 text-red-400 font-semibold">{stat.overdue}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-neutral-700 rounded-full h-2">
                              <div
                                className="bg-sky-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stat.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-sky-400">
                              {Math.round(stat.completionRate)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!isLoading && !error && (!statsData || statsData.overallStats.totalTasks === 0) && (
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

export default ProductivityReports;