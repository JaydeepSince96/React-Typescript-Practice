import { TaskLabel } from '../api/types';

export const priorityLabels = [
  { label: "High Priority", value: TaskLabel.HIGH_PRIORITY },
  { label: "Medium Priority", value: TaskLabel.MEDIUM_PRIORITY },
  { label: "Low Priority", value: TaskLabel.LOW_PRIORITY },
] as const;

export const SidebarItems = [
  { label: "Productivity Report", value: "Productivity Report", path: "/chart" },
  { label: "Tasks Reports", value: "Tasks Reports", path: "/tasks" },
  { label: "Settings", value: "Settings", path: "/settings" },
];

// Task sections for the collapsible "All Tasks" section
export const TaskSections = [
  { label: "Completed Tasks", value: "Completed Tasks", path: "/?filter=completed" },
  { label: "Pending Tasks", value: "Pending Tasks", path: "/?filter=pending" },
  { label: "Overdue Tasks", value: "Overdue Tasks", path: "/?filter=overdue" },
];
