import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers';
import { useDebounce } from '../../../hooks/useDebounce';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'suggestion' | 'location' | 'bloodType';
  icon?: React.ReactNode;
  metadata?: any;
}

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  className?: string;
  debounceMs?: number;
  maxSuggestions?: number;
  recentSearches?: string[];
  onClearRecentSearches?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Tìm kiếm...',
  value = '',
  onChange,
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  showSuggestions = true,
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
  debounceMs = 300,
  maxSuggestions = 8,
  recentSearches = [],
  onClearRecentSearches
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedValue = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange?.(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  const variantClasses = {
    default: 'border border-dark-300 bg-white focus:border-blood-500 focus:ring-2 focus:ring-blood-500/20',
    filled: 'border-0 bg-dark-50 focus:bg-white focus:ring-2 focus:ring-blood-500/20',
    outlined: 'border-2 border-dark-200 bg-transparent focus:border-blood-500'
  };

  const allSuggestions = [
    ...recentSearches.slice(0, 3).map(search => ({
      id: `recent-${search}`,
      text: search,
      type: 'recent' as const,
      icon: <ClockIcon className="w-4 h-4" />
    })),
    ...suggestions.slice(0, maxSuggestions - Math.min(recentSearches.length, 3))
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    
    if (showSuggestions && newValue.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (showSuggestions && (inputValue.length > 0 || recentSearches.length > 0)) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow for suggestion clicks
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || allSuggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(allSuggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch?.(inputValue.trim());
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.text);
    onChange?.(suggestion.text);
    onSuggestionSelect?.(suggestion);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon;
    
    switch (suggestion.type) {
      case 'recent':
        return <ClockIcon className="w-4 h-4" />;
      case 'location':
        return <MapPinIcon className="w-4 h-4" />;
      case 'bloodType':
        return <div className="w-4 h-4 bg-blood-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
          {suggestion.text}
        </div>;
      default:
        return <MagnifyingGlassIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-10 pr-10 rounded-xl transition-all duration-200',
            'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[size],
            variantClasses[variant],
            isFocused && 'shadow-lg'
          )}
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blood-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-dark-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto animate-slide-down"
        >
          {allSuggestions.length > 0 ? (
            <>
              {/* Recent Searches Header */}
              {recentSearches.length > 0 && inputValue.length === 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-dark-100">
                  <span className="text-sm font-medium text-dark-600">Tìm kiếm gần đây</span>
                  {onClearRecentSearches && (
                    <button
                      type="button"
                      onClick={onClearRecentSearches}
                      className="text-xs text-blood-600 hover:text-blood-700"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>
              )}

              {/* Suggestions List */}
              <div className="py-2">
                {allSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      'w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-dark-50 transition-colors',
                      selectedIndex === index && 'bg-blood-50 text-blood-700'
                    )}
                  >
                    <div className={cn(
                      'text-dark-400',
                      selectedIndex === index && 'text-blood-600'
                    )}>
                      {getSuggestionIcon(suggestion)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{suggestion.text}</div>
                      {suggestion.type === 'recent' && (
                        <div className="text-xs text-dark-500">Tìm kiếm gần đây</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : inputValue.length > 0 ? (
            <div className="px-4 py-8 text-center text-dark-500">
              <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 text-dark-300" />
              <div className="text-sm">Không tìm thấy kết quả</div>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-dark-500">
              <div className="text-sm">Nhập từ khóa để tìm kiếm</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;