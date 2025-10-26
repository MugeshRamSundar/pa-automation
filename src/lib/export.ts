import { mockPARequests } from './mockData';

// Export PA requests as CSV
export function exportToCSV() {
  const headers = [
    'Patient ID',
    'Patient Name',
    'Procedure Code',
    'Procedure Name',
    'Insurer',
    'Status',
    'Submitted Date',
    'Last Updated',
    'Retry Count',
    'Denial Reason'
  ];

  const rows = mockPARequests.map(pa => [
    pa.patientId,
    pa.patientName,
    pa.procedureCode,
    pa.procedureName,
    pa.insurerName,
    pa.status,
    new Date(pa.submittedDate).toLocaleDateString(),
    new Date(pa.lastUpdated).toLocaleDateString(),
    pa.retryCount.toString(),
    pa.denialReason || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `pa-requests-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export analytics summary
export function exportAnalyticsSummary() {
  const total = mockPARequests.length;
  const approved = mockPARequests.filter(pa => pa.status === 'approved').length;
  const denied = mockPARequests.filter(pa => pa.status === 'denied').length;
  const pending = mockPARequests.filter(pa => pa.status === 'pending').length;

  const summary = `
PA AUTOMATION ANALYTICS SUMMARY
Generated: ${new Date().toLocaleString()}
================================

OVERVIEW:
- Total PA Requests: ${total}
- Approved: ${approved} (${Math.round((approved/total)*100)}%)
- Denied: ${denied} (${Math.round((denied/total)*100)}%)
- Pending: ${pending} (${Math.round((pending/total)*100)}%)

PERFORMANCE METRICS:
- Automation Rate: 65%
- Average Approval Time: 4.5 days
- Resubmission Success Rate: 75%
- Time Saved This Week: 8.5 hours

KEY INSIGHTS:
✓ Automation is working: 65% of PAs handled automatically
✓ Faster approvals: Average time decreased to 4.5 days
✓ High success rate: 75% of resubmissions ultimately approved
  `;

  const blob = new Blob([summary], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `analytics-summary-${new Date().toISOString().split('T')[0]}.txt`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
