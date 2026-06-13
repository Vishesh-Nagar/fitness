import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  className = '',
  id,
  type = 'text',
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
      <input
        ref={ref}
        id={id}
        type={type}
        style={{ colorScheme: 'dark' }}
        className={`
          w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)]
          rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-text)]
          placeholder:text-[var(--color-text-faint)]
          focus:outline-none focus:border-[var(--color-text-muted)]
          transition-colors duration-150
          ${error ? 'border-[var(--color-error)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
