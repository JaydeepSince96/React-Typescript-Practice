// Main Tasks component - uses the reusable BaseTasks
import { memo } from 'react';
import BaseTasks from './BaseTasks';

const Tasks = memo(() => {
  return (
    <BaseTasks
      title="All Tasks"
      showPriorityButtons={true}
      showFilters={true}
      showPagination={true}
      itemsPerPage={4}
    />
  );
});

Tasks.displayName = 'Tasks';

export default Tasks;
