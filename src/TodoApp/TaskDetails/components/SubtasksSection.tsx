import React from "react";
import { Button } from "@/components/ui/button";
import { IoAdd, IoStatsChartOutline } from "react-icons/io5";
import { useTheme } from "@/contexts/ThemeContext";
import { SubtaskItem } from "./SubtaskItem";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import type { ISubtask } from "@/api/types";

interface SubtasksSectionProps {
  subtasks: ISubtask[];
  paginatedSubtasks: ISubtask[];
  subtaskStats?: {
    total: number;
    completed: number;
    completionRate: number;
  };
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  isToggling: boolean;
  onAddSubtask: () => void;
  onEditSubtask: (subtask: ISubtask) => void;
  onDeleteSubtask: (subtask: ISubtask) => void;
  onToggleSubtask: (subtaskId: string) => void;
  onPageChange: (page: number) => void;
}

export const SubtasksSection: React.FC<SubtasksSectionProps> = ({
  subtasks,
  paginatedSubtasks,
  subtaskStats,
  isLoading,
  currentPage,
  totalPages,
  isToggling,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onToggleSubtask,
  onPageChange,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`${
        isDark
          ? "bg-neutral-800 border border-neutral-700"
          : "bg-white border border-gray-200"
      } rounded-lg shadow-lg transition-colors`}
    >
      <div
        className={`p-6 ${
          isDark
            ? "border-b border-neutral-700"
            : "border-b border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3
              className={`text-xl font-semibold ${
                isDark ? "text-sky-400" : "text-sky-600"
              }`}
            >
              Subtasks
            </h3>
            {subtaskStats && (
              <div className="flex items-center gap-4 text-sm">
                <div
                  className={`flex items-center gap-2 ${
                    isDark ? "text-neutral-400" : "text-gray-500"
                  }`}
                >
                  <IoStatsChartOutline />
                  <span>
                    {subtaskStats.completed}/{subtaskStats.total} completed
                  </span>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isDark
                      ? "bg-sky-500/20 text-sky-400"
                      : "bg-sky-50 text-sky-600 border border-sky-200"
                  }`}
                >
                  {Math.round(subtaskStats.completionRate)}% Complete
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={onAddSubtask}
            className={`font-medium ${
              isDark
                ? "bg-sky-600 hover:bg-sky-700 text-white"
                : "bg-sky-600 hover:bg-sky-700 text-white"
            }`}
          >
            <IoAdd className="mr-2 size-4" />
            Add Subtask
          </Button>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="relative">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4 ${
                  isDark
                    ? "border-sky-400/20 border-t-sky-400"
                    : "border-sky-200 border-t-sky-600"
                }`}
              ></div>
              <div
                className={`absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent animate-ping mx-auto ${
                  isDark ? "border-t-sky-400/60" : "border-t-sky-600/60"
                }`}
              ></div>
            </div>
            <p
              className={`font-medium ${
                isDark ? "text-neutral-400" : "text-gray-600"
              }`}
            >
              Loading subtasks...
            </p>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-neutral-500" : "text-gray-500"
              }`}
            >
              Please wait while we fetch your subtasks
            </p>
          </div>
        ) : subtasks.length === 0 ? (
          <div className="text-center py-16">
            <div
              className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 ${
                isDark ? "bg-neutral-700/30" : "bg-gray-100"
              }`}
            >
              <IoAdd
                className={`text-4xl ${
                  isDark ? "text-neutral-400" : "text-gray-400"
                }`}
              />
            </div>
            <h4
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-neutral-300" : "text-gray-800"
              }`}
            >
              No subtasks yet
            </h4>
            <p
              className={`mb-6 max-w-md mx-auto ${
                isDark ? "text-neutral-400" : "text-gray-600"
              }`}
            >
              Break down this task into smaller, manageable subtasks to track
              your progress more effectively.
            </p>
            <Button
              onClick={onAddSubtask}
              className={`font-medium px-6 ${
                isDark
                  ? "bg-sky-600 hover:bg-sky-700 text-white"
                  : "bg-sky-600 hover:bg-sky-700 text-white"
              }`}
            >
              <IoAdd className="mr-2 size-4" />
              Create First Subtask
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedSubtasks.map((subtask) => (
                <SubtaskItem
                  key={`${subtask._id}-${subtask.completed}-${subtask.updatedAt}`}
                  subtask={subtask}
                  onToggle={onToggleSubtask}
                  onEdit={onEditSubtask}
                  onDelete={onDeleteSubtask}
                  isToggling={isToggling}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent
                    className={`rounded-lg p-2 shadow-inner border ${
                      isDark
                        ? "bg-neutral-800 border-neutral-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          onPageChange(Math.max(currentPage - 1, 1))
                        }
                        className={
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={i + 1 === currentPage}
                          onClick={() => onPageChange(i + 1)}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          onPageChange(Math.min(currentPage + 1, totalPages))
                        }
                        className={
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
