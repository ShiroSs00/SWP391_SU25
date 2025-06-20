import React from 'react';
import { cn } from '../../../utils/helpers';
import { ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export interface FormFieldProps {
  label?: string;
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: string;
  disabled?: boolean;
  tooltip?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  helperText,
  required = false,
  className = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  layout = 'vertical',
  labelWidth = '150px',
  disabled = false,
  tooltip
}) => {
  const isHorizontal = layout === 'horizontal';

  return (
    <div className={cn(
      'form-field',
      isHorizontal ? 'flex items-start gap-4' : 'space-y-2',
      disabled && 'opacity-60',
      className
    )}>
      {/* Label */}
      {label && (
        <div 
          className={cn(
            'flex items-center gap-2',
            isHorizontal && 'flex-shrink-0',
            labelClassName
          )}
          style={isHorizontal ? { width: labelWidth } : undefined}
        >
          <label className={cn(
            'text-sm font-medium text-dark-700',
            disabled && 'text-dark-500'
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {tooltip && (
            <div className="relative group">
              <InformationCircleIcon className="w-4 h-4 text-dark-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-dark-900"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Container */}
      <div className={cn(
        'form-field-input',
        isHorizontal && 'flex-1'
      )}>
        {children}
        
        {/* Error Message */}
        {error && (
          <div className={cn(
            'flex items-center gap-2 mt-2 text-sm text-red-600',
            errorClassName
          )}>
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Helper Text */}
        {helperText && !error && (
          <div className={cn(
            'mt-2 text-sm text-dark-500',
            helperClassName
          )}>
            {helperText}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormField;