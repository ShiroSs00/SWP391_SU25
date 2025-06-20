import React from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'filled';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
                                                                  className = '',
                                                                  label,
                                                                  error,
                                                                  hint,
                                                                  leftIcon,
                                                                  rightIcon,
                                                                  variant = 'default',
                                                                  type = 'text',
                                                                  ...props
                                                              }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const baseInputStyles = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

    const variants = {
        default: `bg-white border-gray-300 focus:border-red-500 focus:ring-red-500 ${error ? 'border-red-500 focus:border-red-600 focus:ring-red-600' : ''}`,
        filled: `bg-gray-50 border-gray-200 focus:bg-white focus:border-red-500 focus:ring-red-500 ${error ? 'border-red-500 focus:border-red-600 focus:ring-red-600' : ''}`
    };

    const sizeStyles = leftIcon || rightIcon || type === 'password' ? 'px-10 py-3' : 'px-4 py-3';

    return (
        <div className="w-full">
            {label && (
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${focused ? 'text-red-600' : 'text-gray-700'}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={inputType}
                    className={`${baseInputStyles} ${variants[variant]} ${sizeStyles} ${className}`}
                    onFocus={(e) => {
                        setFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
                {type === 'password' && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
                {rightIcon && type !== 'password' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        {rightIcon}
                    </div>
                )}
                {error && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
            {hint && !error && (
                <p className="mt-2 text-sm text-gray-500">{hint}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;