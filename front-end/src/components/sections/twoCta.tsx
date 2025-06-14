import React from 'react';
import clsx from 'clsx';

interface BloodStock {
    bloodType: string;
    units: number;
}

interface TwoCtaProps {
    title: string;
    subtitle: string;
    primaryText: string;
    secondaryText: string;
    onPrimaryClick: () => void;
    onSecondaryClick: () => void;
    theme?: 'light' | 'dark';
}

interface SearchBloodStockProps {
    bloodTypes: BloodStock[];
    onSearch: (bloodType: string) => void;
}

// Basic Select component
const Select: React.FC<{
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
    className?: string;
}> = ({ options, value, onChange, name, className }) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className={clsx(
            'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500',
            className
        )}
    >
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

// Basic Button component
const Button: React.FC<{
    variant?: 'primary' | 'secondary';
    onClick: () => void;
    children: React.ReactNode;
}> = ({ variant = 'primary', onClick, children }) => (
    <button
        onClick={onClick}
        className={clsx(
            'px-4 py-2 rounded-md font-medium transition-colors',
            variant === 'primary'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        )}
    >
        {children}
    </button>
);

const SearchBloodStock: React.FC<SearchBloodStockProps> = ({ bloodTypes, onSearch }) => {
    const [selectedBloodType, setSelectedBloodType] = React.useState('');

    const bloodTypeOptions = [
        { value: '', label: 'Tất cả nhóm máu' },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' },
    ];

    return (
        <div className={clsx('bg-white p-6 rounded-lg shadow-md')}>
            <h3 className={clsx('text-lg font-semibold mb-4')}>Tìm kiếm tồn kho máu</h3>
            <div className={clsx('flex gap-4')}>
                <Select
                    options={bloodTypeOptions}
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    name="bloodType"
                    className={clsx('flex-1')}
                />
                <Button variant="primary" onClick={() => onSearch(selectedBloodType)}>
                    Tìm kiếm
                </Button>
            </div>
            {bloodTypes.length > 0 && (
                <ul className={clsx('mt-4 space-y-2')}>
                    {bloodTypes.map((stock) => (
                        <li key={stock.bloodType} className={clsx('py-2 px-3 bg-gray-50 rounded flex justify-between')}>
                            <span className="font-medium">Nhóm máu {stock.bloodType}:</span>
                            <span className={clsx('font-semibold', stock.units < 10 ? 'text-red-600' : 'text-green-600')}>
                                {stock.units} đơn vị
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const TwoCta: React.FC<TwoCtaProps> = ({
                                           title,
                                           subtitle,
                                           primaryText,
                                           secondaryText,
                                           onPrimaryClick,
                                           onSecondaryClick,
                                           theme = 'light'
                                       }) => {
    const isDark = theme === 'dark';

    return (
        <div className="text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
            }`}>
                {title}
            </h2>

            <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto ${
                isDark ? 'text-white/90' : 'text-gray-600'
            }`}>
                {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                    onClick={onPrimaryClick}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                        isDark
                            ? 'bg-white text-red-600 hover:bg-gray-100'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    {primaryText}
                </button>

                <button
                    onClick={onSecondaryClick}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                        isDark
                            ? 'border-white text-white hover:bg-white hover:text-red-600'
                            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                    }`}
                >
                    {secondaryText}
                </button>
            </div>
        </div>
    );
};

export default TwoCta;
export { SearchBloodStock };
export type { BloodStock, SearchBloodStockProps };