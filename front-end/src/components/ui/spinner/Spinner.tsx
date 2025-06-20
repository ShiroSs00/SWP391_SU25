import React from 'react';

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white' | 'gray';
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
                                             size = 'md',
                                             color = 'primary',
                                             className = ''
                                         }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const colors = {
        primary: 'border-red-600 border-t-transparent',
        white: 'border-white border-t-transparent',
        gray: 'border-gray-600 border-t-transparent'
    };

    return (
        <div
            className={`${sizes[size]} border-2 ${colors[color]} rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;