// Export the main refactored component
export { default as TaskDetailsRefactored } from './TaskDetailsRefactored';

// Export individual components for potential reuse
export { TaskDetailsHeader } from './components/TaskDetailsHeader';
export { TaskInfoCard } from './components/TaskInfoCard';
export { SubtasksSection } from './components/SubtasksSection';
export { SubtaskItem } from './components/SubtaskItem';
export { TaskDetailsDialogs } from './components/TaskDetailsDialogs';

// Export the custom hook
export { useTaskDetails } from './hooks/useTaskDetails';
