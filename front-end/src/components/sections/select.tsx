import React from 'react';
import {clsx} from 'clsx';

interface SelectProps {
    options: { value: string; label: string}[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
    required?: boolean;
    className: string;
}

const select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    name,
    required = false,
    className = '',
}) => {
    return (
        <select
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        className={clsx(
            'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
            className
        )}
        >
    <option value= "" disabled>
        Select an option
    </option>
            {options.map((option) =>(
                <option key={option.value}  value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
export default select;