import React from 'react';
import clsx from 'clsx';

interface ProcessStepProps {
    stepNumber: number;
    title: string;
    description: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ stepNumber, title, description }) => {
    return (
        <div className={clsx('flex items-start gap-4')}>
            <div
                className={clsx(
                    'bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center'
                )}
            >
                {stepNumber}
            </div>
            <div>
                <h4 className={clsx('text-lg font-semibold')}>{title}</h4>
                <p className={clsx('text-gray-600')}>{description}</p>
            </div>
        </div>
    );
};

export default ProcessStep;