'use client';

import { StatusPieChart } from '@/components/charts/StatusPieChart';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { InsurerBarChart } from '@/components/charts/InsurerBarChart';
import { Download } from 'lucide-react';
import { exportAnalyticsSummary } from '@/lib/export';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

import {
  getStatusDistribution,
  getWeeklyTrends,
  getInsurerPerformance,
  getAutomationRate,
  getAverageApprovalTime,
  getResubmissionSuccessRate,
  getTimeSaved,
} from '@/lib/analytics';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Zap,
  CheckCircle,
} from 'lucide-react';

export default function AnalyticsPage() {
  // Get analytics data
  const statusData = getStatusDistribution();
  const trendData = getWeeklyTrends();
  const insurerData = getInsurerPerformance();
  
  const automationRate = getAutomationRate();
  const avgApprovalTime = getAverageApprovalTime();
  const resubmissionRate = getResubmissionSuccessRate();
  const timeSaved = getTimeSaved();

  // KPI cards configuration
  const kpis = [
    {
      label: 'Automation Rate',
      value: `${automationRate}%`,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+5%',
      changeType: 'increase' as const,
      description: 'PAs handled without manual intervention',
    },
    {
      label: 'Avg Approval Time',
      value: `${avgApprovalTime} days`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '-12%',
      changeType: 'decrease' as const,
      description: 'Average time from submission to approval',
    },
    {
      label: 'Resubmission Success',
      value: `${resubmissionRate}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8%',
      changeType: 'increase' as const,
      description: 'Denied PAs approved after resubmission',
    },
    {
      label: 'Time Saved',
      value: `${timeSaved} hrs`,
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15%',
      changeType: 'increase' as const,
      description: 'Staff hours saved this week',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track performance metrics and trends
          </p>
        </div>
        
        <Button
          variant="secondary"
          onClick={() => {
            exportAnalyticsSummary();
            toast.success('Analytics report exported successfully!');
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.changeType === 'increase' ? TrendingUp : TrendingDown;
          const trendColor = kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600';

          return (
            <div
              key={kpi.label}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 ${trendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{kpi.change}</span>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {kpi.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {kpi.value}
              </p>
              <p className="text-xs text-gray-500">
                {kpi.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              PA Status Distribution
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Current breakdown of all PA requests
            </p>
          </div>
          <StatusPieChart data={statusData} />
        </div>

        {/* Bar Chart - Insurer Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Average Approval Time by Insurer
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Performance comparison across insurance providers
            </p>
          </div>
          <InsurerBarChart data={insurerData} />
        </div>
      </div>

      {/* Line Chart - Weekly Trends (Full Width) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Weekly Submission Trends
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            PA submissions, approvals, and denials over the past week
          </p>
        </div>
        <TrendLineChart data={trendData} />
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          📊 Key Insights
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Automation is working:</strong> {automationRate}% of PAs are being 
              handled automatically, saving approximately {timeSaved} hours of staff time.
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Faster approvals:</strong> Average approval time has decreased to {avgApprovalTime} days,
              with United Healthcare showing the fastest turnaround.
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-800">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>High success rate:</strong> {resubmissionRate}% of resubmitted PAs are 
              ultimately approved, demonstrating effective AI recommendations.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
