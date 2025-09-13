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
          'bg-white border-4 border-black p-6',
          interactive && 'cursor-pointer hover:transform hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-75',
          tilt && 'hover:rotate-1',
          className
        )}
        style={{boxShadow: '4px 4px 0px 0px #000000'}}
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
      className={cn('text-heading font-mono font-black text-black', className)}
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