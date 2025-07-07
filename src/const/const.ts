import { TaskLabel } from '../api/types';

export const priorityLabels = [
  { label: "High Priority", value: TaskLabel.HIGH_PRIORITY },
  { label: "Medium Priority", value: TaskLabel.MEDIUM_PRIORITY },
  { label: "Low Priority", value: TaskLabel.LOW_PRIORITY },
] as const;

export const SidebarItems = [
  { label: "Productivity Report", value: "Productivity Report", path: "/chart" },
  { label: "Tasks Reports", value: "Tasks Reports", path: "/tasks" },
  { label: "Test Page", value: "Error & Loading Test", path: "/test" },
  { label: "Settings", value: "Settings", path: "/settings" },
];
