import React from 'react';

const Select = React.forwardRef(({
  label,
  error,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`
          w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)]
          rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-text)]
          focus:outline-none focus:border-[var(--color-text-muted)]
          transition-colors duration-150 appearance-none
          cursor-pointer
          ${error ? 'border-[var(--color-error)]' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
