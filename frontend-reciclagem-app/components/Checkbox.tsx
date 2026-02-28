import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={`
              w-4 h-4 text-blue-600 border-gray-300 rounded
              focus:ring-2 focus:ring-blue-500
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

