'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block font-mono font-bold text-sm text-black"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'border-4 border-black px-4 py-3 font-mono text-lg bg-white text-black transition-all duration-75 w-full',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          style={{boxShadow: 'none'}}
          onFocus={(e) => e.target.style.boxShadow = '2px 2px 0px 0px #000000'}
          onBlur={(e) => e.target.style.boxShadow = 'none'}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-red-600 font-mono font-bold"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };