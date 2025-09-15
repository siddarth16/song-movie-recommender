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
      const base = 'font-sans font-black border-3 rounded-lg transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 hover-lift brutal-shadow-color';
      let bg = 'bg-gradient-to-r from-white to-surface-50 text-surface-900 border-surface-600 hover:from-surface-100 hover:to-surface-200 focus:ring-surface-500';

      if (variant === 'primary') bg = 'bg-gradient-to-r from-primary-500 to-pink-500 text-white border-surface-800 hover:from-primary-600 hover:to-pink-600 focus:ring-primary-500';
      if (variant === 'accent') bg = 'bg-gradient-to-r from-accent-500 to-emerald-500 text-white border-surface-800 hover:from-accent-600 hover:to-emerald-600 focus:ring-accent-500';

      const state = disabled || loading ? 'opacity-50 cursor-not-allowed hover:transform-none' : '';

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