import React from 'react';
import {clsx } from 'clsx';

interface InputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    required?: boolean;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    name,
    required = false,
    className= '',
}) => {
    return (
        <input
            type={type  }
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            className={clsx(
                    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
                className
            )}
        />
    );
};

export default Input;