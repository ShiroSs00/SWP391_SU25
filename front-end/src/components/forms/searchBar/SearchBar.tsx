import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onFilter?: () => void;
    showFilter?: boolean;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 value,
                                                 onChange,
                                                 placeholder = 'Search...',
                                                 onFilter,
                                                 showFilter = false,
                                                 className = ''
                                             }) => {
    const handleClear = () => {
        onChange('');
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {showFilter && (
                <button
                    onClick={onFilter}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            )}
        </div>
    );
};

export default SearchBar;