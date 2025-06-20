import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
                                                              className = '',
                                                              variant = 'default',
                                                              padding = 'md',
                                                              hover = false,
                                                              children,
                                                              ...props
                                                          }, ref) => {
    const baseStyles = 'rounded-xl transition-all duration-200';

    const variants = {
        default: 'bg-white border border-gray-200 shadow-sm',
        elevated: 'bg-white shadow-lg',
        bordered: 'bg-white border-2 border-gray-100',
        gradient: 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-100'
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

    return (
        <div
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export default Card;