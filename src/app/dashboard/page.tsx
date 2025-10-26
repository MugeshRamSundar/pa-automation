'use client';

import { useState } from 'react';
import { mockPARequests, type PARequest } from '@/lib/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import { PARequestModal } from '@/components/dashboard/PARequestModal';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Calculate statistics
  const [selectedPA, setSelectedPA] = useState<PARequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalPAs = mockPARequests.length;
  const pending = mockPARequests.filter(pa => pa.status === 'pending').length;
  const approved = mockPARequests.filter(pa => pa.status === 'approved').length;
  const denied = mockPARequests.filter(pa => pa.status === 'denied').length;

  // Metric cards configuration
  const metrics = [
    {
      label: 'Total Requests',
      value: totalPAs,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      change: '+3%',
      changeType: 'increase' as const,
    },
    {
      label: 'Approved',
      value: approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+8%',
      changeType: 'increase' as const,
    },
    {
      label: 'Denied',
      value: denied,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      change: '-2%',
      changeType: 'decrease' as const,
    },
  ];

  const handleRowClick = (pa: PARequest) => {
    setSelectedPA(pa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPA(null);
  };

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          
          return (
            <div
              key={metric.label}
              className={`bg-white p-6 rounded-xl border ${metric.borderColor} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className={`w-4 h-4 ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last week</span>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent PA Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent PA Requests</h2>
            <p className="text-sm text-gray-500 mt-0.5">Latest prior authorization submissions</p>
          </div>
          <Link
            href="/dashboard/requests"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insurer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retries
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPARequests.map((pa) => (
                <tr
                  key={pa.id}
                  onClick={() => handleRowClick(pa)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {pa.patientName}
                      </div>
                      <div className="text-sm text-gray-500">{pa.patientId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {pa.procedureName}
                      </div>
                      <div className="text-sm text-gray-500">{pa.procedureCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {pa.insurerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={pa.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(pa.submittedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {pa.retryCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PA Request Modal */}
      <PARequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paRequest={selectedPA}
      />
    </div>
  );
}
