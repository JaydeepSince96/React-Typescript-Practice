import React from "react";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import { useTheme } from "@/contexts/ThemeContext";

interface TaskDetailsHeaderProps {
  taskId: string;
  onBack: () => void;
}

export const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({
  taskId,
  onBack,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className={`${
          isDark
            ? "text-neutral-300 hover:bg-neutral-800 hover:text-sky-400"
            : "text-gray-600 hover:bg-gray-100 hover:text-sky-600"
        }`}
      >
        <IoArrowBack className="size-5" />
      </Button>
      <h1
        className={`text-2xl md:text-3xl font-bold ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Task: <span className="text-sky-400">#{taskId.slice(-6)}</span>
      </h1>
    </div>
  );
};
