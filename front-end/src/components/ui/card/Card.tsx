import React from 'react';
import { cn } from '../../../utils/helpers';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    hover = false,
    glow = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'rounded-2xl transition-all duration-300',
      hover && 'hover:scale-105 cursor-pointer',
      glow && 'hover:shadow-glow'
    ].filter(Boolean).join(' ');

    const variants = {
      default: 'bg-white border border-dark-200 shadow-lg',
      elevated: 'bg-white shadow-dark-lg border-0',
      outlined: 'bg-white border-2 border-blood-200 shadow-sm',
      glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl',
      gradient: 'bg-gradient-to-br from-blood-50 to-blood-100 border border-blood-200 shadow-blood'
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    };

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;