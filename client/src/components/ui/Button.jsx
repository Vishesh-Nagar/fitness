import React from 'react';

const variants = {
  primary: 'bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dim)] font-semibold',
  ghost: 'bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)]',
  danger: 'bg-transparent text-[var(--color-error)] border border-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-[var(--radius-md)] transition-all duration-150
        cursor-pointer select-none tracking-tight
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
