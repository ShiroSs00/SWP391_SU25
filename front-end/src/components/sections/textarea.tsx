import React from 'react';
import clsx from 'clsx';

interface TextareaProps {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name: string;
    required?: boolean;
    className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
                                               placeholder,
                                               value,
                                               onChange,
                                               name,
                                               required = false,
                                               className = '',
                                           }) => {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            className={clsx(
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
                className
            )}
            rows={4}
        />
    );
};

export default Textarea;