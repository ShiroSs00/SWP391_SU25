import React from 'react';
import { cn } from '../../../utils/helpers';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'emergency';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  gradient?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    gradient = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transform hover:scale-105 active:scale-95',
      fullWidth && 'w-full'
    ].filter(Boolean).join(' ');

    const variants = {
      primary: gradient 
        ? 'bg-blood-gradient text-white shadow-blood hover:shadow-blood-lg focus:ring-blood-500'
        : 'bg-blood-600 text-white hover:bg-blood-700 shadow-blood focus:ring-blood-500',
      secondary: 'bg-dark-100 text-dark-900 hover:bg-dark-200 focus:ring-dark-500',
      outline: 'border-2 border-blood-600 text-blood-600 hover:bg-blood-600 hover:text-white focus:ring-blood-500',
      ghost: 'text-blood-600 hover:bg-blood-50 focus:ring-blood-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg focus:ring-red-500',
      success: 'bg-life-600 text-white hover:bg-life-700 shadow-lg focus:ring-life-500',
      emergency: 'bg-emergency-600 text-white hover:bg-emergency-700 shadow-lg focus:ring-emergency-500 animate-pulse-slow'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-base rounded-xl',
      lg: 'px-6 py-3 text-lg rounded-xl',
      xl: 'px-8 py-4 text-xl rounded-2xl'
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;