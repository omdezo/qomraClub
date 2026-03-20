import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'accent';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-white/10 text-white/70': variant === 'default',
          'bg-success/10 text-success': variant === 'success',
          'bg-error/10 text-error': variant === 'error',
          'bg-accent/10 text-accent': variant === 'accent',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
