'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const getVariantStyles = (variant: string, disabled: boolean, loading: boolean) => {
      const base = 'font-sans font-semibold border-2 rounded-lg transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-soft hover:shadow-soft-md';
      let bg = 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 focus:ring-gray-500';

      if (variant === 'primary') bg = 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 focus:ring-orange-500';
      if (variant === 'accent') bg = 'bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600 focus:ring-cyan-500';

      const state = disabled || loading ? 'opacity-50 cursor-not-allowed hover:bg-current' : '';

      return `${base} ${bg} ${state}`;
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-lg',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-12 py-6 text-2xl'
    };

    return (
      <button
        className={cn(
          getVariantStyles(variant, disabled || loading, loading),
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };