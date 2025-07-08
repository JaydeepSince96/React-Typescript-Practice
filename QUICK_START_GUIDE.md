# Quick Start Guide - Subtask Analytics

## Prerequisites
- Node.js installed
- MongoDB running (for backend)
- Both backend and frontend projects set up

## Starting the System

### 1. Start Backend Server
```bash
cd "e:\SaaS\P12-class-based-ts-CRUD"
npm install
npm run dev
```
Backend will run on: http://localhost:3000

### 2. Start Frontend Server
```bash
cd "e:\SaaS\React-Typescript-Practice"
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

### 3. Test the Analytics API
```bash
cd "e:\SaaS\React-Typescript-Practice"
node test-subtask-analytics.js
```

## Using the Analytics Features

### Task Report
1. Navigate to: http://localhost:5173/reports/task-report
2. Enter a Task ID (get from your existing tasks)
3. Click "Generate Report"
4. View comprehensive analytics

### Task Card Analytics
1. Go to main dashboard
2. Look for task cards with subtasks
3. Hover over the "SUBTASKS" badge
4. See real-time completion stats

### API Endpoints
- `GET /api/tasks/:taskId/subtasks/stats` - Get subtask statistics
- `GET /api/tasks/:taskId/subtasks` - Get all subtasks for a task
- `POST /api/tasks/:taskId/subtasks` - Create new subtask
- `PATCH /api/subtasks/:subtaskId/toggle` - Toggle subtask completion

## Theme Support
- Click the theme toggle button to switch between light/dark modes
- All analytics components will adapt automatically

## Troubleshooting

### Backend Issues
- Check MongoDB connection
- Verify port 3000 is available
- Check console for CORS errors

### Frontend Issues
- Clear browser cache
- Check Network tab for API errors
- Verify backend is running

### API Testing
- Use the provided test script
- Check browser Network tab
- Verify task IDs exist in database

## Key Features Implemented

✅ Real-time subtask completion tracking
✅ Productivity insights with smart recommendations  
✅ Visual progress charts (pie & bar charts)
✅ Enhanced task cards with analytics badges
✅ Comprehensive task report with detailed stats
✅ Full theme support (light/dark mode)
✅ Error handling and fallback mechanisms
✅ Responsive design for mobile/desktop
✅ Hover tooltips with detailed information
