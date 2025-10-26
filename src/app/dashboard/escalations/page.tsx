'use client';

import { useState } from 'react';
import { mockPARequests, type PARequest } from '@/lib/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { PARequestModal } from '@/components/dashboard/PARequestModal';
import { formatDate } from '@/lib/utils';
import { 
  AlertCircle, 
  Clock, 
  User,
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EscalationsPage() {
  const [selectedPA, setSelectedPA] = useState<PARequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter only escalated and denied cases
  const escalatedCases = mockPARequests.filter(
    pa => pa.status === 'escalated' || (pa.status === 'denied' && pa.retryCount > 1)
  );

  const handleRowClick = (pa: PARequest) => {
    setSelectedPA(pa);
    setIsModalOpen(true);
  };

  const handleResolve = (pa: PARequest) => {
    toast.success(`Case resolved for ${pa.patientName}`);
  };

  const handleReassign = (pa: PARequest) => {
    toast.success(`Case reassigned for ${pa.patientName}`);
  };

  const getPriorityLevel = (pa: PARequest) => {
    if (pa.retryCount >= 3) return 'high';
    if (pa.retryCount >= 2) return 'medium';
    return 'low';
  };

  const priorityConfig = {
    high: {
      label: 'High Priority',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
    },
    medium: {
      label: 'Medium Priority',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
    },
    low: {
      label: 'Low Priority',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Escalated Cases</h1>
          <p className="text-sm text-gray-500 mt-1">
            {escalatedCases.length} cases requiring human review
          </p>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-4">
          <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <div className="text-xs text-red-600 font-medium">High Priority</div>
            <div className="text-2xl font-bold text-red-700">
              {escalatedCases.filter(pa => getPriorityLevel(pa) === 'high').length}
            </div>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            <div className="text-xs text-yellow-600 font-medium">Medium Priority</div>
            <div className="text-2xl font-bold text-yellow-700">
              {escalatedCases.filter(pa => getPriorityLevel(pa) === 'medium').length}
            </div>
          </div>
        </div>
      </div>

      {/* Escalated Cases List */}
      {escalatedCases.length > 0 ? (
        <div className="space-y-4">
          {escalatedCases.map((pa) => {
            const priority = getPriorityLevel(pa);
            const config = priorityConfig[priority];

            return (
              <div
                key={pa.id}
                className={`bg-white p-6 rounded-xl border-2 ${config.borderColor} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <AlertCircle className={`w-5 h-5 ${config.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {pa.patientName}
                          </h3>
                          <StatusBadge status={pa.status} />
                          <span className={`px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {pa.procedureName} ({pa.procedureCode})
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Patient ID</p>
                        <p className="text-sm font-medium text-gray-900">{pa.patientId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Insurer</p>
                        <p className="text-sm font-medium text-gray-900">{pa.insurerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Retry Count</p>
                        <p className="text-sm font-medium text-gray-900">{pa.retryCount} attempts</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(pa.lastUpdated)}
                        </p>
                      </div>
                    </div>

                    {/* Denial Reason */}
                    {pa.denialReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-red-900 mb-1">Denial Reason:</p>
                            <p className="text-sm text-red-700">{pa.denialReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRowClick(pa)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleResolve(pa)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Resolved
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReassign(pa)}
                      >
                        <User className="w-4 h-4 mr-1" />
                        Reassign
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Add Note
                      </Button>
                    </div>
                  </div>

                  {/* Right Section - SLA Timer */}
                  <div className="text-right">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Time in Queue</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">2.5h</p>
                      <p className="text-xs text-gray-500 mt-1">SLA: 4h remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            All Clear! 🎉
          </h3>
          <p className="text-gray-600">
            No cases currently require human intervention.
          </p>
        </div>
      )}

      {/* Modal */}
      <PARequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paRequest={selectedPA}
      />
    </div>
  );
}
