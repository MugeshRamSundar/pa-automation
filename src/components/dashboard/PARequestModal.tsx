'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PARequest } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

import {
  FileText,
  Clock,
  AlertCircle,
  User,
  Building2,
  Calendar,
  RefreshCw,
  Download,
  Send,
} from 'lucide-react';

interface PARequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  paRequest: PARequest | null;
}

export function PARequestModal({ isOpen, onClose, paRequest }: PARequestModalProps) {
  if (!paRequest) return null;

  // Mock status history (in real app, fetch from API)
  const statusHistory = [
    {
      status: 'submitted',
      timestamp: paRequest.submittedDate,
      by: 'System',
      notes: 'PA request submitted to insurer',
    },
    {
      status: 'pending',
      timestamp: paRequest.lastUpdated,
      by: 'Insurance Reviewer',
      notes: 'Under review',
    },
  ];

  if (paRequest.status === 'denied' && paRequest.denialReason) {
    statusHistory.push({
      status: 'denied',
      timestamp: paRequest.lastUpdated,
      by: 'Insurance Reviewer',
      notes: paRequest.denialReason,
    });
  }

  // Mock documents
  const documents = [
    { name: 'Clinical Notes.pdf', type: 'Clinical Note', uploadedAt: paRequest.submittedDate },
    { name: 'Lab Results.pdf', type: 'Lab Result', uploadedAt: paRequest.submittedDate },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'ai-analysis', label: 'AI Analysis', icon: AlertCircle },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PA Request Details" size="xl">
      <Tabs tabs={tabs}>
        {(activeTab) => (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                    <div className="mt-2">
                      <StatusBadge status={paRequest.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-gray-500">Retry Count</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{paRequest.retryCount}</p>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Patient Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Patient Name</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{paRequest.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Patient ID</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{paRequest.patientId}</p>
                    </div>
                  </div>
                </div>

                {/* Procedure Information */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Procedure Details</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Procedure Name</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{paRequest.procedureName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Procedure Code</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{paRequest.procedureCode}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance Information */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Insurance Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Insurer Name</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{paRequest.insurerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Provider ID</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{paRequest.providerId}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Important Dates</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatDate(paRequest.submittedDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatDate(paRequest.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Denial Reason (if denied) */}
                {paRequest.denialReason && (
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-1">Denial Reason</h3>
                        <p className="text-sm text-red-700">{paRequest.denialReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                {statusHistory.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      {index < statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-2" />
                      )}
                    </div>

                    {/* Event details */}
                    <div className="flex-1 pb-8">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 capitalize">{event.status}</h4>
                          <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{event.notes}</p>
                        <p className="text-xs text-gray-500">By: {event.by}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type} • {formatDate(doc.uploadedAt)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="secondary" className="w-full mt-4">
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Additional Document
                </Button>
              </div>
            )}

            {/* AI Analysis Tab */}
            {activeTab === 'ai-analysis' && (
              <div className="space-y-4">
                {paRequest.status === 'denied' && paRequest.denialReason ? (
                  <>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-900 mb-2">Denial Analysis</h3>
                      <p className="text-sm text-red-700">{paRequest.denialReason}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">AI Recommendation</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Based on the denial reason, the AI suggests uploading the following documents:
                      </p>
                      <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        <li>Updated clinical notes with detailed diagnosis</li>
                        <li>Recent lab results supporting medical necessity</li>
                        <li>Letter of medical necessity from treating physician</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Success Probability</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-green-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600" style={{ width: '75%' }} />
                        </div>
                        <span className="text-sm font-bold text-green-900">75%</span>
                      </div>
                      <p className="text-xs text-green-700 mt-2">
                        Based on similar cases, there's a 75% chance of approval after resubmission.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">
                      No AI analysis available for {paRequest.status} requests.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* Action Buttons (Footer) */}
      {paRequest.status === 'denied' && (
        <Button 
          variant="primary"
          onClick={() => {
            toast.success('PA resubmitted successfully!');
            onClose();
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Resubmit PA
        </Button>
      )}

      {(paRequest.status === 'pending' || paRequest.status === 'denied') && (
        <Button 
          variant="danger"
          onClick={() => {
            toast.success('Case escalated to human reviewer');
            onClose();
          }}
        >
          <Send className="w-4 h-4 mr-2" />
          Escalate to Human
        </Button>
      )}

      <Button 
        variant="secondary"
        onClick={() => {
          toast.success('Summary downloaded successfully!');
        }}
      >
        <Download className="w-4 h-4 mr-2" />
        Download Summary
      </Button>
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        
        {paRequest.status === 'denied' && (
          <Button variant="primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Resubmit PA
          </Button>
        )}
        
        {(paRequest.status === 'pending' || paRequest.status === 'denied') && (
          <Button variant="danger">
            <Send className="w-4 h-4 mr-2" />
            Escalate to Human
          </Button>
        )}
        
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Download Summary
        </Button>
      </div>
    </Modal>
  );
}
