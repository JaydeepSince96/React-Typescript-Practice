// Simple Tasks component - minimal version using BaseTasks
import { memo } from 'react';
import BaseTasks from './BaseTasks';

const TasksSimple = memo(() => {
  return (
    <BaseTasks
      title="Simple Tasks"
      showPriorityButtons={false}
      showFilters={false}
      showPagination={false}
      itemsPerPage={10}
    />
  );
});

TasksSimple.displayName = 'TasksSimple';

export default TasksSimple;
