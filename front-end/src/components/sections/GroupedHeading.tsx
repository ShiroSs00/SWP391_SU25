import React from 'react';
import clsx from 'clsx';

interface GroupedHeadingProps {
    title: string;
    description: string;
}

const GroupedHeading: React.FC<GroupedHeadingProps> = ({ title, description }) => {
    return (
        <div className={clsx('text-center mb-8')}>
            <h2 className={clsx('text-2xl font-bold text-gray-800')}>{title}</h2>
            <p className={clsx('mt-2 text-gray-600')}>{description}</p>
        </div>
    );
};

export default GroupedHeading;