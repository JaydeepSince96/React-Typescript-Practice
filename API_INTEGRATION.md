# API Integration Documentation

This document outlines how the React-Typescript-Practice frontend integrates with the P12-class-based-ts-CRUD backend API.

## Overview

The frontend now includes complete API integration with the backend, providing:

- **Task Management**: Create, read, update, and delete tasks
- **Statistics**: View task completion statistics and analytics
- **Real-time Updates**: Automatic UI updates when data changes
- **Type Safety**: Full TypeScript support with proper type definitions

## API Structure

### Base Configuration
- **Base URL**: `http://localhost:3000` (configurable via `VITE_API_URL`)
- **API Path**: `/api`

### Available Endpoints

#### Tasks
- `GET /api/task` - Get all tasks
- `POST /api/task` - Create a new task
- `PUT /api/task/:id` - Update a task
- `DELETE /api/task/:id` - Delete a task
- `GET /api/task/labels` - Get available label options

#### Statistics
- `GET /api/task/stats` - Get task statistics
- `GET /api/task/stats/test` - Test endpoint for stats

## File Structure

```
src/
├── api/
│   ├── index.ts              # Main API exports
│   ├── config.ts             # API configuration and utilities
│   ├── types.ts              # TypeScript type definitions
│   ├── task/
│   │   └── task-api.ts       # Task API functions
│   └── stats/
│       └── stats-api.ts      # Statistics API functions
├── hooks/
│   └── useApiHooks.ts        # React Query hooks for API calls
├── components/
│   └── APIIntegrationExample.tsx  # Demo component
└── utils/
    └── dateUtils.ts          # Date formatting utilities
```

## Environment Setup

1. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000
VITE_API_BASE_PATH=/api
```

2. Make sure your backend is running on the configured port (default: 3000)

## Type Definitions

### Task Types
```typescript
export interface ITask {
  _id: string;
  title: string;
  completed: boolean;
  label: TaskLabel;
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskLabel {
  LOW_PRIORITY = "low priority",
  MEDIUM_PRIORITY = "medium priority", 
  HIGH_PRIORITY = "high priority",
  PRIORITY = "priority"
}
```

### Statistics Types
```typescript
export interface IStatsResponse {
  labelStats: ITaskStats[];
  overallStats: IOverallStats;
}

export interface ITaskStats {
  label: TaskLabel;
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}
```

## Usage Examples

### Using React Query Hooks

```typescript
import { useGetAllTasks, useCreateTask, useGetTaskStats } from '@/hooks/useApiHooks';

const MyComponent = () => {
  const { data: tasks, isLoading, error } = useGetAllTasks();
  const { data: stats } = useGetTaskStats();
  const createTaskMutation = useCreateTask();

  const handleCreateTask = async () => {
    await createTaskMutation.mutateAsync({
      title: 'New Task',
      label: TaskLabel.HIGH_PRIORITY,
      startDate: '07/07/2025',
      dueDate: '08/07/2025'
    });
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

### Direct API Calls

```typescript
import { taskAPI, statsAPI } from '@/api';

// Get all tasks
const tasks = await taskAPI.getAllTasks();

// Create a task
const newTask = await taskAPI.createTask({
  title: 'Learn React',
  label: TaskLabel.HIGH_PRIORITY,
  startDate: '07/07/2025',
  dueDate: '14/07/2025'
});

// Get statistics
const stats = await statsAPI.getTaskStats();
```

## Date Formatting

The API expects dates in `dd/mm/yyyy` format. Use the provided utility functions:

```typescript
import { formatDateForAPI, formatDateTimeForDisplay } from '@/utils/dateUtils';

// Format for API (dd/mm/yyyy)
const apiDate = formatDateForAPI(new Date());

// Display formatted date from API
const displayDate = formatDateTimeForDisplay(task.createdAt);
```

## API Demo Component

Visit `/api-demo` to see a complete working example that demonstrates:

- Fetching and displaying tasks
- Creating new tasks with validation
- Updating task status and priority
- Deleting tasks
- Viewing real-time statistics
- Error handling

## React Query Configuration

The app uses React Query for efficient data fetching with:

- **Automatic Caching**: Reduces unnecessary API calls
- **Background Refetching**: Keeps data fresh
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful error states

### Query Keys
```typescript
export const QUERY_KEYS = {
  TASKS: ['tasks'],
  TASK_STATS: ['task-stats'],
  LABEL_OPTIONS: ['label-options'],
} as const;
```

## Error Handling

All API functions include comprehensive error handling:

```typescript
try {
  const result = await taskAPI.createTask(payload);
  // Handle success
} catch (error) {
  // Error message is automatically formatted
  console.error('API Error:', error.message);
}
```

## Backend Compatibility

This integration is designed to work with the P12-class-based-ts-CRUD backend:

- **MongoDB**: Uses MongoDB ObjectId as `_id`
- **Date Format**: Matches backend's `dd-mm-yy, HH:MM` format
- **Enum Values**: Matches backend's `TaskLabel` enum
- **Response Format**: Expects `{ success: boolean, data: any }` structure

## Development Notes

1. **CORS Configuration**: The backend is configured to allow requests from `http://localhost:5173` (Vite dev server)
2. **Environment Variables**: Use `.env` file for API configuration
3. **Type Safety**: All API responses are fully typed
4. **Error Boundaries**: Consider implementing error boundaries for better error handling
5. **Loading States**: All hooks provide loading states for better UX

## Testing

To test the API integration:

1. Start the backend server: `npm run dev` (in backend directory)
2. Start the frontend server: `npm run dev` (in frontend directory)
3. Navigate to `/api-demo` to test all functionality
4. Check browser console for any API errors

## Troubleshooting

**Common Issues:**

1. **CORS Errors**: Ensure backend CORS is configured for your frontend URL
2. **Network Errors**: Check if backend is running on the correct port
3. **Date Format Errors**: Ensure dates are in `dd/mm/yyyy` format for API calls
4. **Type Errors**: Make sure to import types from the correct locations

**Debug Steps:**
1. Check browser Network tab for API calls
2. Verify backend logs for request processing
3. Ensure environment variables are loaded correctly
4. Test API endpoints directly with a tool like Postman

## Next Steps

Consider implementing:
- **Authentication**: Add JWT token support
- **Pagination**: For large task lists
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Service worker implementation
- **Bulk Operations**: Select and update multiple tasks
- **Advanced Filtering**: Search and filter capabilities
