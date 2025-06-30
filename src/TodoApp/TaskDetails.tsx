// src/TodoApp/TaskDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { SidebarLayout } from '@/layout/SidebarLayout';
import { IoArrowBack } from 'react-icons/io5';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get task ID from URL
  const navigate = useNavigate();
  const todos = useSelector((state: RootState) => state.todo);
  const task = todos.find(t => t.id === Number(id)); // Find task by ID (assuming ID is number)

  if (!task) {
    return (
      <SidebarLayout>
        <div className="p-6 bg-neutral-900 min-h-screen text-white flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Task Not Found</h2>
          <p className="text-neutral-400 mb-6">The task you are looking for does not exist.</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
          >
            <IoArrowBack className="text-xl" /> Back to Tasks
          </button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 bg-neutral-900 min-h-screen text-white flex flex-col">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="flex items-center gap-2 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800 transition-colors px-4 py-2 rounded-md font-semibold"
          >
            <IoArrowBack className="text-2xl" />
            <span className="text-lg">Back</span>
          </button>
          <h2 className="text-3xl font-bold ml-4 text-sky-400">Task Details</h2>
        </div>

        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700 space-y-4 max-w-2xl mx-auto">
          <p className="text-lg font-semibold text-amber-50">{task.task}</p>
          <p className="text-sm text-neutral-400">
            <span className="font-bold">Status:</span>{' '}
            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
              task.isDone ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
            }`}>
              {task.isDone ? "Done" : "Pending"}
            </span>
          </p>
          <p className="text-sm text-neutral-400">
            <span className="font-bold">Priority:</span>{' '}
            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
              task.priority === 'High' ? 'bg-red-600/20 text-red-400' :
              task.priority === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
              'bg-blue-600/20 text-blue-400'
            }`}>
              {task.priority}
            </span>
          </p>
          <p className="text-sm text-neutral-400">
            <span className="font-bold">Created At:</span> {new Date(task.timeAndDate).toLocaleString()}
          </p>
          {/* You would display start/end dates here if they were part of ITodo */}
          {/* <p className="text-sm text-neutral-400"><span className="font-bold">Start Date:</span> {task.startDate?.toLocaleDateString()}</p> */}
          {/* <p className="text-sm text-neutral-400"><span className="font-bold">End Date:</span> {task.endDate?.toLocaleDateString()}</p> */}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default TaskDetails;