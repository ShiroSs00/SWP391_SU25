import React from 'react';
import { cn } from '../../../utils/helpers';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'blood' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  outline?: boolean;
  pulse?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    rounded = false,
    outline = false,
    pulse = false,
    leftIcon,
    rightIcon,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center font-medium transition-all duration-200',
      pulse && 'animate-pulse',
      rounded ? 'rounded-full' : 'rounded-lg'
    ].filter(Boolean).join(' ');

    const variants = {
      default: outline 
        ? 'bg-transparent border border-dark-300 text-dark-700'
        : 'bg-dark-100 text-dark-800',
      primary: outline
        ? 'bg-transparent border border-blood-300 text-blood-700'
        : 'bg-blood-100 text-blood-800',
      secondary: outline
        ? 'bg-transparent border border-dark-300 text-dark-600'
        : 'bg-dark-50 text-dark-600',
      success: outline
        ? 'bg-transparent border border-life-300 text-life-700'
        : 'bg-life-100 text-life-800',
      warning: outline
        ? 'bg-transparent border border-emergency-300 text-emergency-700'
        : 'bg-emergency-100 text-emergency-800',
      danger: outline
        ? 'bg-transparent border border-red-300 text-red-700'
        : 'bg-red-100 text-red-800',
      info: outline
        ? 'bg-transparent border border-blue-300 text-blue-700'
        : 'bg-blue-100 text-blue-800',
      blood: outline
        ? 'bg-transparent border border-blood-400 text-blood-700'
        : 'bg-blood-gradient text-white shadow-blood',
      emergency: outline
        ? 'bg-transparent border border-emergency-400 text-emergency-700'
        : 'bg-emergency-gradient text-white shadow-lg animate-pulse-slow'
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <span
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {leftIcon && (
          <span className={`${iconSizes[size]} mr-1`}>
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className={`${iconSizes[size]} ml-1`}>
            {rightIcon}
          </span>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;