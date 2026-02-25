import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--color-primary-val)] text-[var(--color-bg)] font-bold hover:opacity-90 shadow-glow-lg transform hover:-translate-y-1',
  secondary:
    'bg-transparent border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:border-[var(--color-text)] hover:bg-[var(--color-text)]/5 backdrop-blur-sm',
  ghost:
    'bg-[var(--color-primary-val)]/10 border border-[var(--color-primary-val)] text-[var(--color-text)] font-bold hover:bg-[var(--color-primary-val)] hover:text-[var(--color-bg)]',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
};

const shapeForVariant: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'rounded-full',
  secondary: 'rounded-full',
  ghost: 'rounded-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        flex items-center justify-center gap-2
        transition-all duration-300
        cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${shapeForVariant[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
