import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/components/UserProfile';
import { taskAPI } from '@/api/task/task-api';
import { Button } from '@/components/ui/button';
import { 
  IoDocumentTextOutline, 
  IoStatsChartOutline, 
  IoListOutline,
  IoCheckboxOutline,
  IoCalendarOutline,
  IoTrendingUpOutline,
  IoPersonOutline,
  IoCloudOutline
} from 'react-icons/io5';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [apiTestResult, setApiTestResult] = useState<string>('');

  // Test API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      try {
        const tasks = await taskAPI.getAllTasks();
        setApiTestResult(`✅ API Connected! Found ${tasks.length} tasks`);
      } catch (error) {
        setApiTestResult(`❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testAPI();
  }, []);

  const stats = [
    {
      title: 'Total Tasks',
      value: '24',
      change: '+12%',
      icon: IoDocumentTextOutline,
      color: 'blue'
    },
    {
      title: 'Completed',
      value: '18',
      change: '+8%',
      icon: IoCheckboxOutline,
      color: 'green'
    },
    {
      title: 'In Progress',
      value: '4',
      change: '+2%',
      icon: IoListOutline,
      color: 'yellow'
    },
    {
      title: 'Overdue',
      value: '2',
      change: '-25%',
      icon: IoCalendarOutline,
      color: 'red'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Task',
      description: 'Add a new task to your todo list',
      icon: IoDocumentTextOutline,
      action: () => navigate('/tasks'),
      color: 'blue'
    },
    {
      title: 'View Analytics',
      description: 'Check your productivity stats',
      icon: IoStatsChartOutline,
      action: () => navigate('/reports'),
      color: 'purple'
    },
    {
      title: 'Priority Tasks',
      description: 'Focus on high priority items',
      icon: IoTrendingUpOutline,
      action: () => navigate('/priority'),
      color: 'orange'
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: IoStatsChartOutline,
      action: () => navigate('/settings'),
      color: 'teal'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
      green: isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200',
      yellow: isDark ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border-yellow-200',
      red: isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200',
      purple: isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200',
      orange: isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200',
      teal: isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-600 border-teal-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`min-h-screen p-6 ${
      isDark ? 'bg-neutral-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back, {user?.name}!
            </h1>
            <p className={`text-lg mt-2 ${
              isDark ? 'text-neutral-400' : 'text-gray-600'
            }`}>
              Here's what's happening with your tasks today.
            </p>
            {/* API Test Result */}
            {apiTestResult && (
              <div className={`text-sm mt-2 p-2 rounded ${
                apiTestResult.includes('✅') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {apiTestResult}
              </div>
            )}
          </div>
          <UserProfile />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'bg-white border-gray-200'
                } hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>
                      {stat.title}
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm mt-1 ${
                      stat.change.startsWith('+') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className={`h-auto p-6 flex flex-col items-center text-center space-y-3 ${
                    isDark 
                      ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${getColorClasses(action.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>
                      {action.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <div className={`p-6 rounded-xl border ${
            isDark 
              ? 'bg-neutral-800 border-neutral-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Tasks
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Review design mockups', status: 'completed', time: '2 hours ago' },
                { title: 'Update project documentation', status: 'in-progress', time: '4 hours ago' },
                { title: 'Team standup meeting', status: 'completed', time: '1 day ago' },
                { title: 'Fix authentication bug', status: 'pending', time: '2 days ago' }
              ].map((task, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? 'bg-neutral-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' 
                        ? 'bg-green-500' 
                        : task.status === 'in-progress' 
                        ? 'bg-yellow-500' 
                        : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                      <p className={`text-sm ${
                        isDark ? 'text-neutral-400' : 'text-gray-600'
                      }`}>
                        {task.time}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Summary */}
          <div className={`p-6 rounded-xl border ${
            isDark 
              ? 'bg-neutral-800 border-neutral-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Profile Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-sky-500' : 'bg-blue-600'
                }`}>
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <IoPersonOutline className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user?.name}
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-neutral-400' : 'text-gray-600'
                  }`}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg text-center ${
                  isDark ? 'bg-neutral-700' : 'bg-gray-50'
                }`}>
                  <p className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    87%
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-neutral-400' : 'text-gray-600'
                  }`}>
                    Completion Rate
                  </p>
                </div>
                <div className={`p-3 rounded-lg text-center ${
                  isDark ? 'bg-neutral-700' : 'bg-gray-50'
                }`}>
                  <p className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    24
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-neutral-400' : 'text-gray-600'
                  }`}>
                    Days Streak
                  </p>
                </div>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-neutral-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <IoCloudOutline className={`w-4 h-4 ${
                    isDark ? 'text-neutral-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm ${
                    isDark ? 'text-neutral-400' : 'text-gray-600'
                  }`}>
                    Last synced
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Just now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
