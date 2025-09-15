'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  tilt?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, tilt = false, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'bg-white border-2 border-gray-200 rounded-lg p-6 brutal-shadow-soft',
          interactive && 'cursor-pointer hover-lift hover:brutal-shadow-gentle transition-all duration-200 ripple-effect focus-visible',
          tilt && 'hover:rotate-1',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pb-4', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-heading font-mono font-black text-surface-800', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-4', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-4 flex gap-2', className)} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardContent, CardFooter };