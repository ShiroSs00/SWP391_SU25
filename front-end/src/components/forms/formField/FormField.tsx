import React from 'react';

export interface FormFieldProps {
    children: React.ReactNode;
    error?: string;
    required?: boolean;
    className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 children,
                                                 error,
                                                 required,
                                                 className = ''
                                             }) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && (child.props as any).label && required) {
                    const element = child as React.ReactElement<any>;
                    return React.cloneElement(element, {
                        ...element.props,
                        label: (
                            <span>
                {element.props.label}
                                <span className="text-red-500 ml-1">*</span>
            </span>
                        )
                    });
                }
                return child;
            })}
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
};

export default FormField;