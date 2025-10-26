import { cn } from '@/lib/utils';

type Status = 'pending' | 'approved' | 'denied' | 'resubmitted' | 'escalated';

// Define colors for each status
const statusStyles: Record<Status, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  approved: 'bg-green-100 text-green-800 border-green-300',
  denied: 'bg-red-100 text-red-800 border-red-300',
  resubmitted: 'bg-blue-100 text-blue-800 border-blue-300',
  escalated: 'bg-purple-100 text-purple-800 border-purple-300',
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusStyles[status]
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
