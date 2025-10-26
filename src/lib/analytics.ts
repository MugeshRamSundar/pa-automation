import { mockPARequests } from './mockData';

// Calculate status distribution
export function getStatusDistribution() {
  const statusCount: Record<string, number> = {
    pending: 0,
    approved: 0,
    denied: 0,
    resubmitted: 0,
    escalated: 0,
  };

  mockPARequests.forEach((pa) => {
    statusCount[pa.status]++;
  });

  return [
    { name: 'Pending', value: statusCount.pending, color: '#f59e0b' },
    { name: 'Approved', value: statusCount.approved, color: '#10b981' },
    { name: 'Denied', value: statusCount.denied, color: '#ef4444' },
    { name: 'Resubmitted', value: statusCount.resubmitted, color: '#3b82f6' },
    { name: 'Escalated', value: statusCount.escalated, color: '#8b5cf6' },
  ];
}

// Calculate weekly trends (mock data for demo)
export function getWeeklyTrends() {
  return [
    { date: 'Oct 19', submitted: 12, approved: 8, denied: 2 },
    { date: 'Oct 20', submitted: 15, approved: 10, denied: 3 },
    { date: 'Oct 21', submitted: 10, approved: 7, denied: 1 },
    { date: 'Oct 22', submitted: 18, approved: 12, denied: 4 },
    { date: 'Oct 23', submitted: 14, approved: 9, denied: 3 },
    { date: 'Oct 24', submitted: 16, approved: 11, denied: 2 },
    { date: 'Oct 25', submitted: 20, approved: 14, denied: 3 },
  ];
}

// Calculate average approval time by insurer (mock data)
export function getInsurerPerformance() {
  return [
    { insurer: 'Blue Cross', avgDays: 3.5 },
    { insurer: 'Aetna', avgDays: 4.2 },
    { insurer: 'United Healthcare', avgDays: 2.8 },
    { insurer: 'Cigna', avgDays: 5.1 },
  ];
}

// Calculate automation rate
export function getAutomationRate() {
  const totalPAs = mockPARequests.length;
  const automated = mockPARequests.filter(
    (pa) => pa.status === 'approved' && pa.retryCount === 0
  ).length;
  
  return Math.round((automated / totalPAs) * 100);
}

// Calculate average approval time
export function getAverageApprovalTime() {
  const approvedPAs = mockPARequests.filter((pa) => pa.status === 'approved');
  
  if (approvedPAs.length === 0) return 0;
  
  const totalDays = approvedPAs.reduce((sum, pa) => {
    const submitted = new Date(pa.submittedDate);
    const updated = new Date(pa.lastUpdated);
    const days = Math.ceil((updated.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);
  
  return Math.round((totalDays / approvedPAs.length) * 10) / 10; // One decimal place
}

// Calculate resubmission success rate
export function getResubmissionSuccessRate() {
  const resubmitted = mockPARequests.filter((pa) => pa.retryCount > 0);
  const successful = resubmitted.filter((pa) => pa.status === 'approved');
  
  if (resubmitted.length === 0) return 0;
  
  return Math.round((successful.length / resubmitted.length) * 100);
}

// Calculate time saved (mock calculation)
export function getTimeSaved() {
  const automated = mockPARequests.filter(
    (pa) => pa.status === 'approved' && pa.retryCount === 0
  ).length;
  
  // Assume 30 minutes saved per automated PA
  const minutesSaved = automated * 30;
  return Math.round((minutesSaved / 60) * 10) / 10; // Convert to hours
}
