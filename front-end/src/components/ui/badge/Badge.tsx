import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'blood-type';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
                                                                 className = '',
                                                                 variant = 'default',
                                                                 size = 'md',
                                                                 dot = false,
                                                                 children,
                                                                 ...props
                                                             }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full transition-all duration-200';

    const variants = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800 border border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        danger: 'bg-red-100 text-red-800 border border-red-200',
        info: 'bg-blue-100 text-blue-800 border border-blue-200',
        'blood-type': 'bg-red-600 text-white shadow-sm'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs gap-1',
        md: 'px-2.5 py-1 text-sm gap-1.5',
        lg: 'px-3 py-1.5 text-sm gap-2'
    };

    return (
        <span
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
      {dot && (
          <span className={`w-2 h-2 rounded-full ${
              variant === 'default' ? 'bg-gray-400' :
                  variant === 'success' ? 'bg-green-500' :
                      variant === 'warning' ? 'bg-yellow-500' :
                          variant === 'danger' ? 'bg-red-500' :
                              variant === 'info' ? 'bg-blue-500' :
                                  'bg-white'
          }`} />
      )}
            {children}
    </span>
    );
});

Badge.displayName = 'Badge';

export default Badge;