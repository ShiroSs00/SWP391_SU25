import React from 'react';
import clsx from 'clsx';

interface WrapperSectionProps {
    children: React.ReactNode;
    className?: string;
}

const WrapperSection: React.FC<WrapperSectionProps> = ({ children, className = '' }) => {
    return (
        <section className={clsx('py-12 bg-white', className)}>
            <div className={clsx('container mx-auto px-4')}>{children}</div>
        </section>
    );
};

export default WrapperSection;