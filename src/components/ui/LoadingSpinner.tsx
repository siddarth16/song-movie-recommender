'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-current border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-surface-200 rounded skeleton"
          style={{ width: `${100 - (i * 10)}%` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border-2 border-surface-300 rounded-lg p-6 brutal-shadow-soft">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-surface-200 rounded-full mx-auto skeleton" />
        <Skeleton lines={2} />
      </div>
    </div>
  );
}