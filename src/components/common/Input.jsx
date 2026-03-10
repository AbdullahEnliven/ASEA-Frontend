import { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white
            placeholder:text-gray-500 outline-none transition-colors
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50
            ${error ? 'border-red-500' : 'border-white/10'}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
