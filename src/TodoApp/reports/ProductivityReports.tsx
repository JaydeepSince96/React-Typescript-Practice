import React, { useEffect, useState, useCallback } from "react";
import { getTaskStats } from "@/api/stats/stats-api";
import type { IStatsResponse } from "@/api/types";
import type { StatsFilterOptions } from "@/api/stats/stats-api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBack,
  IoCheckmarkDoneCircleOutline,
  IoTimeOutline,
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
  IoArrowForwardCircleOutline,
  IoListCircleOutline,
  IoWarningOutline,
  IoStatsChartOutline,
  IoTrendingUpOutline,
  IoCalendarOutline,
  IoFilterOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { TbListSearch } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// Professional Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  className,
  isPercentage = false,
  trend,
  trendValue,
  isDark,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  isPercentage?: boolean;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  isDark: boolean;
}) => (
  <div
    className={cn(
      "p-6 rounded-xl shadow-xl border hover:border-opacity-80 transition-all duration-300",
      isDark 
        ? "bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 hover:border-neutral-600" 
        : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={cn(
          "text-4xl p-3 rounded-lg",
          isDark ? "bg-neutral-700/50" : "bg-gray-100"
        )}>
          {icon}
        </div>
        <div>
          <p className={cn(
            "text-sm font-medium uppercase tracking-wide",
            isDark ? "text-neutral-400" : "text-gray-600"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-3xl font-bold mt-1",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {value}{isPercentage ? "%" : ""}
          </p>
          {trend && trendValue !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : isDark ? "text-neutral-400" : "text-gray-500"
            }`}>
              {trend === "up" ? <IoTrendingUpOutline /> : trend === "down" ? <IoArrowDownCircleOutline /> : null}
              <span>{trendValue}% from last week</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Professional Filter Panel Component
const FilterPanel = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isLoading,
  isDark,
}: {
  filters: StatsFilterOptions;
  onFiltersChange: (newFilters: StatsFilterOptions) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  isLoading: boolean;
  isDark: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  const currentWeek = getWeekNumber(new Date());

  // Check if filters are applied (different from default)
  const isFiltersApplied = () => {
    const defaultFilters = {
      period: 'month',
      year: currentYear,
      month: currentMonth,
    };
    
    return (
      filters.period !== defaultFilters.period ||
      filters.year !== defaultFilters.year ||
      filters.month !== defaultFilters.month ||
      filters.week !== undefined ||
      filters.startDate !== undefined ||
      filters.endDate !== undefined
    );
  };

  const handlePeriodChange = (period: 'week' | 'month' | 'year' | 'custom') => {
    const newFilters: StatsFilterOptions = { period };
    
    // Set default values based on period
    if (period === 'week') {
      newFilters.year = currentYear;
      newFilters.week = currentWeek;
    } else if (period === 'month') {
      newFilters.year = currentYear;
      newFilters.month = currentMonth;
    } else if (period === 'year') {
      newFilters.year = currentYear;
    } else if (period === 'custom') {
      // Set default to current month for custom range
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
      const endOfMonth = new Date(currentYear, currentMonth, 0);
      newFilters.startDate = startOfMonth.toISOString().split('T')[0];
      newFilters.endDate = endOfMonth.toISOString().split('T')[0];
    }
    
    onFiltersChange(newFilters);
  };

  // Quick date range handlers
  const handleQuickRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    
    onFiltersChange({
      period: 'custom',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  return (
    <div className={cn(
      "rounded-xl shadow-xl border mb-8 transition-all duration-300",
      isDark 
        ? "bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700" 
        : "bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-sm"
    )}>
      {/* Filter Header with Toggle */}
      <div 
        className={cn(
          "flex items-center justify-between p-6 cursor-pointer",
          isDark ? "hover:bg-neutral-800/50" : "hover:bg-gray-50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            isDark ? "bg-neutral-700/50" : "bg-gray-100"
          )}>
            <IoFilterOutline className="text-xl text-sky-400" />
          </div>
          <h3 className={cn(
            "text-lg font-semibold",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Productivity Filters
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Clear Filters Label - Only show when filters are applied */}
          {isFiltersApplied() && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
              className={cn(
                "text-sm cursor-pointer underline transition-colors duration-200",
                isDark 
                  ? "text-sky-400 hover:text-sky-300" 
                  : "text-blue-600 hover:text-blue-700"
              )}
            >
              Clear
            </span>
          )}
          {/* Toggle Icon */}
          <div className={cn(
            "p-1 rounded transition-transform duration-200",
            isExpanded ? "rotate-180" : "rotate-0"
          )}>
            <IoArrowDownCircleOutline className={cn(
              "text-xl",
              isDark ? "text-neutral-400" : "text-gray-500"
            )} />
          </div>
        </div>
      </div>

      {/* Collapsible Filter Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Period Selection */}
            <div className="space-y-2 col-span-2">
              <Label className={cn(
                "text-sm font-medium",
                isDark ? "text-neutral-300" : "text-gray-700"
              )}>
                Time Period
              </Label>
              <Select value={filters.period || 'month'} onValueChange={handlePeriodChange}>
                <SelectTrigger className={cn(
                  "w-full h-9",
                  isDark ? "border-neutral-600 bg-neutral-800/50" : "border-gray-300"
                )}>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional inputs based on period */}
            {filters.period === 'week' && (
              <>
                <div className="space-y-2">
                  <Label className={cn(
                    "text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-gray-700"
                  )}>
                    Year
                  </Label>
                  <Input
                    type="number"
                    value={filters.year || currentYear}
                    onChange={(e) => onFiltersChange({ ...filters, year: parseInt(e.target.value) })}
                    min="2020"
                    max="2030"
                    className={cn(
                      "h-9",
                      isDark ? "border-neutral-600 bg-neutral-800/50" : "border-gray-300"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={cn(
                    "text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-gray-700"
                  )}>
                    Week Number
                  </Label>
                  <Input
                    type="number"
                    value={filters.week || currentWeek}
                    onChange={(e) => onFiltersChange({ ...filters, week: parseInt(e.target.value) })}
                    min="1"
                    max="53"
                    className={cn(
                      "h-9",
                      isDark ? "border-neutral-600 bg-neutral-800/50" : "border-gray-300"
                    )}
                  />
                </div>
              </>
            )}

            {filters.period === 'month' && (
              <>
                <div className="space-y-2">
                  <Label className={cn(
                    "text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-gray-700"
                  )}>
                    Year
                  </Label>
                  <Input
                    type="number"
                    value={filters.year || currentYear}
                    onChange={(e) => onFiltersChange({ ...filters, year: parseInt(e.target.value) })}
                    min="2020"
                    max="2030"
                    className={cn(
                      "h-9",
                      isDark ? "border-neutral-600 bg-neutral-800/50" : "border-gray-300"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={cn(
                    "text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-gray-700"
                  )}>
                    Month
                  </Label>
                  <Select 
                    value={filters.month?.toString() || currentMonth.toString()} 
                    onValueChange={(value) => onFiltersChange({ ...filters, month: parseInt(value) })}
                  >
                    <SelectTrigger className={cn(
                      "w-full h-9",
                      isDark ? "border-neutral-600 bg-neutral-800/50" : "border-gray-300"
                    )}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {new Date(2024, month - 1, 1).toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {filters.period === 'year' && (
              <div className="space-y-2">
                <Label className={cn(
                  "text-sm font-medium",
                  isDark ? "text-neutral-300" : "text-gray-700"
                )}>
                  Year
                </Label>
                <Input
                  type="number"
                  value={filters.year || currentYear}
                  onChange={(e) => onFiltersChange({ ...filters, year: parseInt(e.target.value) })}
                  min="2020"
                  max="2030"
                  className={cn(
                    "h-9",
                    isDark ? "border-neutral-600 bg-neutral-800/50" : "border-gray-300"
                  )}
                />
              </div>
            )}

            {filters.period === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label className={cn(
                    "text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-gray-700"
                  )}>
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
                    className={cn(
                      "h-9",
                      isDark ? "border-neutral-600 bg-neutral-800/50" : "border-gray-300"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={cn(
                    "text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-gray-700"
                  )}>
                    End Date
                  </Label>
                  <Input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
                    className={cn(
                      "h-9",
                      isDark ? "border-neutral-600 bg-neutral-800/50" : "border-gray-300"
                    )}
                  />
                </div>
              </>
            )}

            {/* Apply Button */}
            <div className="space-y-2">
              <Label className="text-sm font-medium opacity-0">Apply</Label>
              <Button
                onClick={() => {
                  onApplyFilters();
                  setIsExpanded(false); // Collapse after applying
                }}
                disabled={isLoading}
                className={cn(
                  "w-full h-9 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
                  "bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <IoRefreshOutline className="animate-spin text-sm" />
                    Applying...
                  </>
                ) : (
                  <>
                    <IoCalendarOutline className="text-sm" />
                    Apply Filters
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Range Buttons for Custom Date Range */}
          {filters.period === 'custom' && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRange(7)}
                  className={cn(
                    "h-8 px-3 text-xs",
                    isDark ? "border-neutral-600 bg-neutral-800/50 hover:bg-neutral-700" : "border-gray-300 hover:bg-gray-100"
                  )}
                >
                  Last 7 days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRange(30)}
                  className={cn(
                    "h-8 px-3 text-xs",
                    isDark ? "border-neutral-600 bg-neutral-800/50 hover:bg-neutral-700" : "border-gray-300 hover:bg-gray-100"
                  )}
                >
                  Last 30 days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRange(90)}
                  className={cn(
                    "h-8 px-3 text-xs",
                    isDark ? "border-neutral-600 bg-neutral-800/50 hover:bg-neutral-700" : "border-gray-300 hover:bg-gray-100"
                  )}
                >
                  Last 90 days
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductivityReports: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [statsData, setStatsData] = useState<IStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<StatsFilterOptions>({
    period: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  // Fetch stats data from API with filters
  const fetchStats = useCallback(async (filterOptions?: StatsFilterOptions) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching stats with filters:", filterOptions);
      const stats = await getTaskStats(filterOptions);
      console.log("Received stats:", stats);
      setStatsData(stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch with default filters
  useEffect(() => {
    fetchStats(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Handle filter changes
  const handleFiltersChange = (newFilters: StatsFilterOptions) => {
    setFilters(newFilters);
  };

  // Apply filters (refetch data)
  const handleApplyFilters = () => {
    fetchStats(filters);
  };

  // Clear filters and reset to default
  const handleClearFilters = () => {
    const defaultFilters: StatsFilterOptions = {
      period: 'month',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    };
    setFilters(defaultFilters);
    // Auto-apply the default filters when clearing
    fetchStats(defaultFilters);
  };

  // Get period display text
  const getPeriodDisplayText = () => {
    if (!filters.period) return "Current Period";
    
    switch (filters.period) {
      case 'week':
        return `Week ${filters.week || 'Current'} of ${filters.year || new Date().getFullYear()}`;
      case 'month': {
        const monthName = filters.month 
          ? new Date(2024, filters.month - 1, 1).toLocaleString('default', { month: 'long' })
          : 'Current Month';
        return `${monthName} ${filters.year || new Date().getFullYear()}`;
      }
      case 'year':
        return `Year ${filters.year || new Date().getFullYear()}`;
      case 'custom': {
        if (filters.startDate && filters.endDate) {
          const start = new Date(filters.startDate).toLocaleDateString();
          const end = new Date(filters.endDate).toLocaleDateString();
          return `${start} - ${end}`;
        }
        return "Custom Range";
      }
      default:
        return "Current Period";
    }
  };

  // Process data for charts
  const chartData = React.useMemo(() => {
    if (!statsData) return null;

    const { labelStats, overallStats } = statsData;

    // Priority-wise task distribution
    const priorityData = {
      labels: labelStats.map(stat => 
        stat.label.charAt(0).toUpperCase() + stat.label.slice(1).replace(" priority", "")
      ),
      datasets: [
        {
          label: "Total Tasks",
          data: labelStats.map(stat => stat.total),
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)",  // High - Red
            "rgba(251, 191, 36, 0.8)", // Medium - Yellow
            "rgba(59, 130, 246, 0.8)", // Low - Blue
          ],
          borderColor: [
            "rgb(239, 68, 68)",
            "rgb(251, 191, 36)",
            "rgb(59, 130, 246)",
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: "Completed Tasks",
          data: labelStats.map(stat => stat.completed),
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(34, 197, 94, 0.8)"
          ],
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 2,
          borderRadius: 8,
        }
      ],
    };

    // Completion status pie chart
    const completionData = {
      labels: ["Completed", "Pending", "Overdue"],
      datasets: [
        {
          data: [
            overallStats.completedTasks,
            overallStats.pendingTasks - overallStats.overdueTasks,
            overallStats.overdueTasks
          ],
          backgroundColor: [
            "#10b981", // Green for completed
            "#f59e0b", // Yellow for pending
            "#ef4444"  // Red for overdue
          ],
          borderColor: "#374151",
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };

    // Trend line chart (mock data for demonstration)
    const trendData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Current"],
      datasets: [
        {
          label: "Completion Rate",
          data: [65, 70, 75, 80, overallStats.overallCompletionRate],
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#06b6d4",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    };

    return { priorityData, completionData, trendData };
  }, [statsData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDark ? "#cbd5e1" : "#374151",
          font: {
            size: 12,
            weight: "bold" as const,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        titleColor: isDark ? "#f9fafb" : "#111827",
        bodyColor: isDark ? "#e5e7eb" : "#374151",
        borderColor: isDark ? "#4b5563" : "#d1d5db",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { 
          color: isDark ? "#9ca3af" : "#6b7280",
          font: { size: 11 }
        },
        grid: { 
          color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        },
        border: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        }
      },
      y: {
        ticks: { 
          color: isDark ? "#9ca3af" : "#6b7280",
          font: { size: 11 }
        },
        grid: { 
          color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        },
        border: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        }
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: isDark ? "#cbd5e1" : "#374151",
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        titleColor: isDark ? "#f9fafb" : "#111827",
        bodyColor: isDark ? "#e5e7eb" : "#374151",
        borderColor: isDark ? "#4b5563" : "#d1d5db",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        display: false,
      },
    },
  };

  return (
    <SidebarLayout>
      <div className={cn(
        "min-h-screen p-6 transition-colors duration-300",
        isDark ? "bg-neutral-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                isDark 
                  ? "border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50" 
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
              )}
            >
              <IoArrowBack />
              Back
            </Button>
            <div>
              <h1 className={cn(
                "text-3xl font-bold flex items-center gap-3",
                isDark ? "text-white" : "text-gray-900"
              )}>
                <IoStatsChartOutline className="text-sky-400" />
                Productivity Reports
              </h1>
              <p className={cn(
                "text-sm mt-1 flex items-center gap-2",
                isDark ? "text-neutral-400" : "text-gray-600"
              )}>
                <IoCalendarOutline className="text-sky-400" />
                {getPeriodDisplayText()}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          isLoading={isLoading}
          isDark={isDark}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className={cn(
                "animate-spin rounded-full h-12 w-12 border-4 border-t-transparent",
                isDark ? "border-sky-400" : "border-blue-600"
              )}></div>
              <div className={cn(
                "text-lg font-medium",
                isDark ? "text-sky-400" : "text-blue-600"
              )}>Loading analytics...</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className={cn(
            "rounded-xl p-6 mb-8 border",
            isDark 
              ? "bg-red-900/20 border-red-700 text-red-300" 
              : "bg-red-50 border-red-200 text-red-800"
          )}>
            <div className="flex items-center gap-3 mb-3">
              <IoWarningOutline className="text-2xl text-red-400" />
              <h3 className="font-semibold text-lg">Failed to load analytics</h3>
            </div>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isDark 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              )}
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {statsData && !isLoading && !error && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Tasks"
                value={statsData.overallStats.totalTasks}
                icon={<IoListCircleOutline className="text-sky-400" />}
                trend="up"
                trendValue={12}
                isDark={isDark}
              />
              <StatCard
                title="Completed"
                value={statsData.overallStats.completedTasks}
                icon={<IoCheckmarkDoneCircleOutline className="text-green-400" />}
                trend="up"
                trendValue={8}
                isDark={isDark}
              />
              <StatCard
                title="Pending"
                value={statsData.overallStats.pendingTasks}
                icon={<IoTimeOutline className="text-yellow-400" />}
                trend="down"
                trendValue={5}
                isDark={isDark}
              />
              <StatCard
                title="Overdue"
                value={statsData.overallStats.overdueTasks}
                icon={<IoWarningOutline className="text-red-400" />}
                trend="down"
                trendValue={15}
                isDark={isDark}
              />
            </div>

            {/* Priority Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.labelStats.map((stat) => (
                <StatCard
                  key={stat.label}
                  title={stat.label.charAt(0).toUpperCase() + stat.label.slice(1).replace(" priority", " Priority")}
                  value={stat.total}
                  icon={
                    stat.label.includes("high") ? (
                      <IoArrowUpCircleOutline className="text-red-400" />
                    ) : stat.label.includes("medium") ? (
                      <IoArrowForwardCircleOutline className="text-yellow-400" />
                    ) : (
                      <IoArrowDownCircleOutline className="text-blue-400" />
                    )
                  }
                  className={cn(
                    "bg-gradient-to-br",
                    isDark ? "from-neutral-800/50 to-neutral-900/50" : "from-gray-100/50 to-gray-200/50"
                  )}
                  isDark={isDark}
                />
              ))}
              <StatCard
                title="Completion Rate"
                value={Math.round(statsData.overallStats.overallCompletionRate)}
                icon={<IoTrendingUpOutline className="text-green-400" />}
                isPercentage={true}
                trend="up"
                trendValue={3}
                className={cn(
                  "bg-gradient-to-br",
                  isDark 
                    ? "from-green-900/20 to-emerald-900/20 border-green-700/30" 
                    : "from-green-50/50 to-emerald-50/50 border-green-200/50"
                )}
                isDark={isDark}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Priority Distribution Chart */}
              <div className={cn(
                "p-6 rounded-xl shadow-xl border bg-gradient-to-br",
                isDark 
                  ? "from-neutral-800 to-neutral-900 border-neutral-700" 
                  : "from-white to-gray-50 border-gray-200"
              )}>
                <h3 className={cn(
                  "text-xl font-semibold mb-6 flex items-center gap-2",
                  isDark ? "text-sky-400" : "text-blue-600"
                )}>
                  <IoStatsChartOutline />
                  Priority Distribution
                </h3>
                <div className="h-80">
                  {chartData && (
                    <Bar data={chartData.priorityData} options={chartOptions} />
                  )}
                </div>
              </div>

              {/* Completion Status Chart */}
              <div className={cn(
                "p-6 rounded-xl shadow-xl border bg-gradient-to-br",
                isDark 
                  ? "from-neutral-800 to-neutral-900 border-neutral-700" 
                  : "from-white to-gray-50 border-gray-200"
              )}>
                <h3 className={cn(
                  "text-xl font-semibold mb-6 flex items-center gap-2",
                  isDark ? "text-sky-400" : "text-blue-600"
                )}>
                  <IoCheckmarkDoneCircleOutline />
                  Task Status Breakdown
                </h3>
                <div className="h-80">
                  {chartData && (
                    <Pie data={chartData.completionData} options={pieOptions} />
                  )}
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className={cn(
              "p-6 rounded-xl shadow-xl border bg-gradient-to-br",
              isDark 
                ? "from-neutral-800 to-neutral-900 border-neutral-700" 
                : "from-white to-gray-50 border-gray-200"
            )}>
              <h3 className={cn(
                "text-xl font-semibold mb-6 flex items-center gap-2",
                isDark ? "text-sky-400" : "text-blue-600"
              )}>
                <IoTrendingUpOutline />
                Completion Rate Trend
              </h3>
              <div className="h-80">
                {chartData && (
                  <Line data={chartData.trendData} options={lineOptions} />
                )}
              </div>
            </div>

            {/* Detailed Stats Table */}
            <div className={cn(
              "p-6 rounded-xl shadow-xl border bg-gradient-to-br",
              isDark 
                ? "from-neutral-800 to-neutral-900 border-neutral-700" 
                : "from-white to-gray-50 border-gray-200"
            )}>
              <h3 className={cn(
                "text-xl font-semibold mb-6 flex items-center gap-2",
                isDark ? "text-sky-400" : "text-blue-600"
              )}>
                <IoListCircleOutline />
                Detailed Priority Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={cn(
                      "border-b",
                      isDark ? "border-neutral-700" : "border-gray-200"
                    )}>
                      <th className={cn(
                        "text-left py-3 px-4 font-semibold",
                        isDark ? "text-neutral-300" : "text-gray-700"
                      )}>Priority</th>
                      <th className={cn(
                        "text-left py-3 px-4 font-semibold",
                        isDark ? "text-neutral-300" : "text-gray-700"
                      )}>Total</th>
                      <th className={cn(
                        "text-left py-3 px-4 font-semibold",
                        isDark ? "text-neutral-300" : "text-gray-700"
                      )}>Completed</th>
                      <th className={cn(
                        "text-left py-3 px-4 font-semibold",
                        isDark ? "text-neutral-300" : "text-gray-700"
                      )}>Pending</th>
                      <th className={cn(
                        "text-left py-3 px-4 font-semibold",
                        isDark ? "text-neutral-300" : "text-gray-700"
                      )}>Overdue</th>
                      <th className={cn(
                        "text-left py-3 px-4 font-semibold",
                        isDark ? "text-neutral-300" : "text-gray-700"
                      )}>Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsData.labelStats.map((stat) => (
                      <tr key={stat.label} className={cn(
                        "border-b transition-colors",
                        isDark 
                          ? "border-neutral-800 hover:bg-neutral-800/30" 
                          : "border-gray-100 hover:bg-gray-50"
                      )}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {stat.label.includes("high") ? (
                              <IoArrowUpCircleOutline className="text-red-400" />
                            ) : stat.label.includes("medium") ? (
                              <IoArrowForwardCircleOutline className="text-yellow-400" />
                            ) : (
                              <IoArrowDownCircleOutline className="text-blue-400" />
                            )}
                            <span className="capitalize font-medium">
                              {stat.label.replace(" priority", "")}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold">{stat.total}</td>
                        <td className="py-3 px-4 text-green-400 font-semibold">{stat.completed}</td>
                        <td className="py-3 px-4 text-yellow-400 font-semibold">{stat.pending}</td>
                        <td className="py-3 px-4 text-red-400 font-semibold">{stat.overdue}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-20 rounded-full h-2",
                              isDark ? "bg-neutral-700" : "bg-gray-200"
                            )}>
                              <div
                                className="bg-sky-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stat.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-sky-400">
                              {Math.round(stat.completionRate)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!isLoading && !error && (!statsData || statsData.overallStats.totalTasks === 0) && (
          <div className="col-span-full text-center py-20 flex flex-col items-center justify-center">
            <TbListSearch className={cn(
              "size-20 mb-4",
              isDark ? "text-neutral-600" : "text-gray-400"
            )} />
            <p className={cn(
              "text-xl font-semibold",
              isDark ? "text-neutral-400" : "text-gray-600"
            )}>
              No productivity data available yet.
            </p>
            <p className={cn(
              "mt-2",
              isDark ? "text-neutral-500" : "text-gray-500"
            )}>
              Add some tasks and mark them complete to see your progress!
            </p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ProductivityReports;