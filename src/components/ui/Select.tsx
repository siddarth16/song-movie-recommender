'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={selectId}
            className="block font-mono font-bold text-sm text-black"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            'border-4 border-black px-4 py-3 font-mono text-lg bg-white text-black transition-all duration-75 w-full cursor-pointer',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          style={{boxShadow: 'none'}}
          onFocus={(e) => e.target.style.boxShadow = '2px 2px 0px 0px #000000'}
          onBlur={(e) => e.target.style.boxShadow = 'none'}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p 
            id={`${selectId}-error`}
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

Select.displayName = 'Select';

export { Select };