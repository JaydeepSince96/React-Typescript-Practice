import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IoCheckmarkDoneCircleOutline,
  IoTimeOutline,
  IoListCircleOutline,
  IoSearchCircleOutline,
} from "react-icons/io5";
import type { ITodo } from "@/features/Todos/TodoSlice";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Reusable Stat Card for the report
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-neutral-800 p-5 rounded-lg shadow-lg border border-neutral-700 flex items-center gap-4">
    <div className="text-4xl text-sky-400">{icon}</div>
    <div>
      <p className="text-sm text-neutral-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const TaskReport: React.FC = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<ITodo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const todos = useSelector((state: RootState) => state.todo);

  const handleGenerateReport = () => {
    if (!searchId) {
      setError("Please enter a Task ID.");
      setSelectedTask(null);
      return;
    }
    const task = todos.find((t) => t.id.toString() === searchId);
    if (task) {
      setSelectedTask(task);
      setError(null);
    } else {
      setError(`Task with ID "${searchId}" not found.`);
      setSelectedTask(null);
    }
  };

  const reportData = useMemo(() => {
    if (!selectedTask) return null;

    const completedSubtasks = selectedTask.subtasks.filter(
      (st) => st.isDone
    ).length;
    const pendingSubtasks = selectedTask.subtasks.length - completedSubtasks;

    return {
      completedSubtasks,
      pendingSubtasks,
      totalSubtasks: selectedTask.subtasks.length,
      pieData: {
        labels: ["Completed", "Pending"],
        datasets: [
          {
            label: "Subtask Status",
            data: [completedSubtasks, pendingSubtasks],
            backgroundColor: ["#10b981", "#f59e0b"],
            borderColor: ["#059669", "#d97706"],
            borderWidth: 1,
            hoverOffset: 8,
          },
        ],
      },
    };
  }, [selectedTask]);

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: "#cbd5e1",
          },
        },
        title: {
          display: true,
          text: "Subtask Completion Status",
          color: "#e5e7eb",
          font: {
            size: 16,
          },
        },
      },
    }),
    []
  );

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 bg-neutral-900 min-h-screen text-white space-y-6">
        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700">
          <h2 className="text-2xl font-bold text-sky-400 mb-4">
            Generate Task Report
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              type="text"
              placeholder="Enter Task ID to generate its report..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="bg-neutral-700 border-neutral-600 flex-grow"
            />
            <Button
              onClick={handleGenerateReport}
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700"
            >
              <IoSearchCircleOutline className="mr-2 size-5" />
              Generate Report
            </Button>
          </div>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>

        {selectedTask && reportData && (
          <div className="space-y-6">
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700">
              <h3 className="text-xl font-semibold text-amber-50 mb-4 border-b border-neutral-700 pb-2">
                Report for Task:{" "}
                <span className="text-sky-400">{selectedTask.id}</span>
              </h3>
              <p className="text-neutral-300">{selectedTask.task}</p>
            </div>

            {reportData.totalSubtasks > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Subtasks"
                    value={reportData.totalSubtasks}
                    icon={<IoListCircleOutline />}
                  />
                  <StatCard
                    title="Completed"
                    value={reportData.completedSubtasks}
                    icon={<IoCheckmarkDoneCircleOutline />}
                  />
                  <StatCard
                    title="Pending"
                    value={reportData.pendingSubtasks}
                    icon={<IoTimeOutline />}
                  />
                </div>

                <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700 h-96 flex items-center justify-center">
                  <div className="relative h-full w-full max-w-sm">
                    <Pie data={reportData.pieData} options={pieOptions} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 bg-neutral-800 rounded-lg border border-neutral-700">
                <p className="text-neutral-400">
                  This task does not have any subtasks to report.
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
