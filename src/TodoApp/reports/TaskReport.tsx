import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IoCheckmarkDoneCircleOutline,
  IoTimeOutline,
  IoListCircleOutline,
  IoSearchCircleOutline,
  IoTrendingUpOutline,
  IoAnalyticsOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";
import type { ITodo } from "@/features/Todos/TodoSlice";
import { getSubtaskStats } from "@/api/subtask/subtask-api";
import { taskAPI } from "@/api/task/task-api";
import type { ISubtaskStats, ITask } from "@/api/types";
import { useTheme } from "@/contexts/ThemeContext";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

// Reusable Stat Card for the report
const StatCard = ({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}) => (
  <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 flex items-center gap-4 transition-colors">
    <div className="text-4xl text-sky-500 dark:text-sky-400">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
      {subtitle && (
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{subtitle}</p>
      )}
    </div>
  </div>
);

// Analytics insights component
const AnalyticsInsights = ({ 
  stats 
}: { 
  stats: ISubtaskStats; 
}) => {
  const getProductivityInsight = () => {
    const { completionRate, total } = stats;
    
    if (total === 0) return null;
    
    if (completionRate >= 90) {
      return {
        type: "excellent",
        message: "Excellent progress! You're almost done with this task.",
        icon: <IoCheckmarkDoneCircleOutline className="text-green-500" />,
      };
    } else if (completionRate >= 70) {
      return {
        type: "good",
        message: "Good progress! Keep it up to finish strong.",
        icon: <IoTrendingUpOutline className="text-blue-500" />,
      };
    } else if (completionRate >= 40) {
      return {
        type: "moderate",
        message: "Making steady progress. Consider focusing on completion.",
        icon: <IoSpeedometerOutline className="text-yellow-500" />,
      };
    } else {
      return {
        type: "needs-attention",
        message: "This task needs attention. Consider breaking it down further.",
        icon: <IoAnalyticsOutline className="text-red-500" />,
      };
    }
  };

  const insight = getProductivityInsight();
  
  if (!insight) return null;

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 transition-colors">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
        <IoAnalyticsOutline className="text-sky-500 dark:text-sky-400" />
        Productivity Insights
      </h3>
      <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
        <div className="text-2xl">{insight.icon}</div>
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {insight.message}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            Completion Rate: {stats.completionRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper functions to handle different task types
const getTaskId = (task: ITask | ITodo): string => {
  return 'id' in task ? task.id.toString() : task._id;
};

const getTaskTitle = (task: ITask | ITodo): string => {
  return 'task' in task ? task.task : task.title;
};

const getTaskPriority = (task: ITask | ITodo): string => {
  if ('priority' in task) {
    return task.priority || 'No Priority';
  } else if ('label' in task) {
    return task.label || 'No Priority';
  }
  return 'No Priority';
};

const getTaskCreatedDate = (task: ITask | ITodo): string => {
  if ('timeAndDate' in task) {
    return new Date(task.timeAndDate).toLocaleDateString();
  } else if ('createdAt' in task) {
    return new Date(task.createdAt).toLocaleDateString();
  }
  return 'Unknown';
};

const TaskReport: React.FC = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<ITask | ITodo | null>(null);
  const [subtaskStats, setSubtaskStats] = useState<ISubtaskStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isDark } = useTheme();
  const todos = useSelector((state: RootState) => state.todo);

  const handleGenerateReport = async () => {
    if (!searchId) {
      setError("Please enter a Task ID.");
      setSelectedTask(null);
      setSubtaskStats(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedTask(null);
    setSubtaskStats(null);

    try {
      // First try to fetch from backend API
      const task = await taskAPI.getTaskById(searchId);
      setSelectedTask(task);
      
      // Fetch real-time subtask statistics from backend
      const stats = await getSubtaskStats(searchId);
      setSubtaskStats(stats);
      
    } catch (err) {
      console.error("Error fetching task from backend:", err);
      
      // Fallback to Redux store (local data)
      const localTask = todos.find((t) => t.id.toString() === searchId);
      if (localTask) {
        setSelectedTask(localTask);
        setError("Using local data - backend connection failed.");
        
        // Fallback to local calculation
        const completedSubtasks = localTask.subtasks.filter(st => st.isDone).length;
        const totalSubtasks = localTask.subtasks.length;
        const fallbackStats: ISubtaskStats = {
          total: totalSubtasks,
          completed: completedSubtasks,
          pending: totalSubtasks - completedSubtasks,
          completionRate: totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0,
        };
        setSubtaskStats(fallbackStats);
      } else {
        setError(`Task with ID "${searchId}" not found in backend or local data.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const reportData = useMemo(() => {
    if (!selectedTask || !subtaskStats) return null;

    const { total, completed, pending, completionRate } = subtaskStats;

    return {
      completedSubtasks: completed,
      pendingSubtasks: pending,
      totalSubtasks: total,
      completionRate: completionRate,
      pieData: {
        labels: ["Completed", "Pending"],
        datasets: [
          {
            label: "Subtask Status",
            data: [completed, pending],
            backgroundColor: ["#10b981", "#f59e0b"],
            borderColor: ["#059669", "#d97706"],
            borderWidth: 1,
            hoverOffset: 8,
          },
        ],
      },
      barData: {
        labels: ["Progress"],
        datasets: [
          {
            label: "Completed",
            data: [completed],
            backgroundColor: "#10b981",
            borderColor: "#059669",
            borderWidth: 1,
          },
          {
            label: "Pending",
            data: [pending],
            backgroundColor: "#f59e0b",
            borderColor: "#d97706",
            borderWidth: 1,
          },
        ],
      },
    };
  }, [selectedTask, subtaskStats]);

  const pieOptions = useMemo(() => {
    const textColor = isDark ? '#cbd5e1' : '#374151';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: textColor,
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: "Subtask Completion Status",
          color: textColor,
          font: {
            size: 16,
            weight: 'bold' as const,
          },
        },
      },
    };
  }, [isDark]);

  const barOptions = useMemo(() => {
    const textColor = isDark ? '#cbd5e1' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: textColor,
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: "Task Progress Overview",
          color: textColor,
          font: {
            size: 16,
            weight: 'bold' as const,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: gridColor,
          },
        },
        y: {
          ticks: {
            color: textColor,
          },
          grid: {
            color: gridColor,
          },
        },
      },
    };
  }, [isDark]);

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 bg-neutral-50 dark:bg-neutral-900 min-h-screen text-neutral-900 dark:text-white space-y-6 transition-colors">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 transition-colors">
          <h2 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mb-4">
            📊 Task Analytics Report
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Generate detailed insights about your task progress and subtask completion rates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              type="text"
              placeholder="Enter Task ID to generate its report..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 flex-grow"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateReport()}
            />
            <Button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <>
                  <IoSearchCircleOutline className="mr-2 size-5" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>

        {selectedTask && reportData && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 transition-colors">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                📋 Task Details:{" "}
                <span className="text-sky-600 dark:text-sky-400">#{getTaskId(selectedTask)}</span>
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-2">{getTaskTitle(selectedTask)}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-full text-xs font-medium">
                  {getTaskPriority(selectedTask)}
                </span>
                <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-xs">
                  Created: {getTaskCreatedDate(selectedTask)}
                </span>
              </div>
            </div>

            {reportData.totalSubtasks > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Subtasks"
                    value={reportData.totalSubtasks}
                    icon={<IoListCircleOutline />}
                    subtitle={`${reportData.totalSubtasks} items to complete`}
                  />
                  <StatCard
                    title="Completed"
                    value={reportData.completedSubtasks}
                    icon={<IoCheckmarkDoneCircleOutline />}
                    subtitle={`${((reportData.completedSubtasks / reportData.totalSubtasks) * 100).toFixed(1)}% done`}
                  />
                  <StatCard
                    title="Pending"
                    value={reportData.pendingSubtasks}
                    icon={<IoTimeOutline />}
                    subtitle={`${reportData.pendingSubtasks} items left`}
                  />
                  <StatCard
                    title="Progress Rate"
                    value={`${reportData.completionRate.toFixed(1)}%`}
                    icon={<IoTrendingUpOutline />}
                    subtitle={reportData.completionRate > 50 ? 'Great progress!' : 'Keep going!'}
                  />
                </div>

                <AnalyticsInsights stats={subtaskStats!} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 transition-colors">
                    <div className="h-80">
                      <Pie data={reportData.pieData} options={pieOptions} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 transition-colors">
                    <div className="h-80">
                      <Bar data={reportData.barData} options={barOptions} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors">
                <IoListCircleOutline className="mx-auto text-6xl text-neutral-400 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  No Subtasks Found
                </h3>
                <p className="text-neutral-500 dark:text-neutral-500">
                  This task doesn't have any subtasks yet. Consider breaking it down into smaller, manageable parts to track your progress more effectively.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default TaskReport;
