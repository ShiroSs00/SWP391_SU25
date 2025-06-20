import React from 'react';
import { cn } from '../../../utils/helpers';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    inputSize = 'md',
    fullWidth = false,
    disabled,
    ...props
  }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    const baseClasses = [
      'transition-all duration-200 focus:outline-none',
      fullWidth && 'w-full',
      disabled && 'opacity-50 cursor-not-allowed'
    ].filter(Boolean).join(' ');

    const variants = {
      default: [
        'border border-dark-300 bg-white',
        'focus:border-blood-500 focus:ring-2 focus:ring-blood-500/20',
        hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        hasSuccess && 'border-life-500 focus:border-life-500 focus:ring-life-500/20'
      ].filter(Boolean).join(' '),
      
      filled: [
        'border-0 bg-dark-50',
        'focus:bg-white focus:ring-2 focus:ring-blood-500/20',
        hasError && 'bg-red-50 focus:ring-red-500/20',
        hasSuccess && 'bg-life-50 focus:ring-life-500/20'
      ].filter(Boolean).join(' '),
      
      outlined: [
        'border-2 border-dark-200 bg-transparent',
        'focus:border-blood-500 focus:bg-white',
        hasError && 'border-red-500 focus:border-red-500',
        hasSuccess && 'border-life-500 focus:border-life-500'
      ].filter(Boolean).join(' ')
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-3 text-base rounded-xl',
      lg: 'px-6 py-4 text-lg rounded-xl'
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-dark-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400">
              <div className={iconSizes[inputSize]}>
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input */}
          <input
            type={type}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[inputSize],
              leftIcon && 'pl-10',
              (rightIcon || hasError || hasSuccess) && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {/* Right Icon / Status */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasError ? (
              <ExclamationCircleIcon className={`${iconSizes[inputSize]} text-red-500`} />
            ) : hasSuccess ? (
              <CheckCircleIcon className={`${iconSizes[inputSize]} text-life-500`} />
            ) : rightIcon ? (
              <div className={`${iconSizes[inputSize]} text-dark-400`}>
                {rightIcon}
              </div>
            ) : null}
          </div>
        </div>

        {/* Helper Text / Error / Success */}
        {(error || success || helperText) && (
          <div className="mt-2">
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-life-600 flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p className="text-sm text-dark-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;