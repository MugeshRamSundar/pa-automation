'use client';

import { useState, useMemo } from 'react';
import { mockPARequests, getUniqueInsurers, statusOptions, type PARequest } from '@/lib/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PARequestModal } from '@/components/dashboard/PARequestModal';
import { formatDate } from '@/lib/utils';
import { Filter, X, FileText } from 'lucide-react';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/lib/export';
import toast from 'react-hot-toast';

export default function PARequestsPage() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [insurerFilter, setInsurerFilter] = useState('');
  
  // State for modal
  const [selectedPA, setSelectedPA] = useState<PARequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique insurers
  const insurerOptions = useMemo(() => 
    getUniqueInsurers().map(insurer => ({ value: insurer, label: insurer })),
    []
  );

  // Filter logic
  const filteredRequests = useMemo(() => {
    return mockPARequests.filter((pa) => {
      // Search filter (patient name, ID, or procedure)
      const matchesSearch = searchQuery === '' ||
        pa.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pa.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pa.procedureName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === '' || pa.status === statusFilter;

      // Insurer filter
      const matchesInsurer = insurerFilter === '' || pa.insurerName === insurerFilter;

      return matchesSearch && matchesStatus && matchesInsurer;
    });
  }, [searchQuery, statusFilter, insurerFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setInsurerFilter('');
    setCurrentPage(1);
  };

  // Check if any filter is active
  const hasActiveFilters = searchQuery || statusFilter || insurerFilter;

  // Modal handlers
  const handleRowClick = (pa: PARequest) => {
    setSelectedPA(pa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPA(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All PA Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredRequests.length} of {mockPARequests.length} requests
          </p>
        </div>
      {/* </div>
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All PA Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Showing {filteredRequests.length} of {mockPARequests.length} requests
        </p>
      </div> */}
      
      {/* ADD THIS: */}
      <Button
        variant="secondary"
        onClick={() => {
          exportToCSV();
          toast.success('PA requests exported successfully!');
        }}
      >
        <Download className="w-4 h-4 mr-2" />
        Export to CSV
      </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <SearchBar
              value={searchQuery}
              onChange={handleFilterChange(setSearchQuery)}
              placeholder="Patient name, ID, or procedure..."
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
              options={statusOptions}
              placeholder="All Statuses"
            />
          </div>

          {/* Insurer Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurer
            </label>
            <Select
              value={insurerFilter}
              onChange={handleFilterChange(setInsurerFilter)}
              options={insurerOptions}
              placeholder="All Insurers"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {currentRequests.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
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
                  {currentRequests.map((pa) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of{' '}
                  {filteredRequests.length} results
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-sm text-gray-500 mb-4">
              Try adjusting your filters or search query
            </p>
            {hasActiveFilters && (
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <PARequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paRequest={selectedPA}
      />
    </div>
  );
}
