import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    pending: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    approved: { variant: 'default' as const, color: 'bg-green-100 text-green-800 hover:bg-green-100' },
    rejected: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800 hover:bg-red-100' }
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} className={config.color}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
