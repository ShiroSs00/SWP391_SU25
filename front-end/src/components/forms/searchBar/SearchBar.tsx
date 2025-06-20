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
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
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
  onRecentSearchAdd?: (search: string) => void;
  onRecentSearchClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Tìm kiếm...',
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
  onRecentSearchAdd,
  onRecentSearchClear
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    if (debouncedValue && onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allSuggestions = [
    ...recentSearches.slice(0, 3).map(search => ({
      id: `recent-${search}`,
      text: search,
      type: 'recent' as const,
      icon: <ClockIcon className="w-4 h-4" />
    })),
    ...suggestions.slice(0, maxSuggestions - recentSearches.length)
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setHighlightedIndex(-1);
    
    if (showSuggestions && newValue.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (showSuggestions && (value.length > 0 || recentSearches.length > 0)) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow for suggestion clicks
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    setShowDropdown(false);
    
    if (onSearch) {
      onSearch(suggestion.text);
    }
    
    if (onRecentSearchAdd && suggestion.type !== 'recent') {
      onRecentSearchAdd(suggestion.text);
    }
    
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || allSuggestions.length === 0) {
      if (e.key === 'Enter' && value.trim()) {
        if (onSearch) {
          onSearch(value);
        }
        if (onRecentSearchAdd) {
          onRecentSearchAdd(value);
        }
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(allSuggestions[highlightedIndex]);
        } else if (value.trim()) {
          if (onSearch) {
            onSearch(value);
          }
          if (onRecentSearchAdd) {
            onRecentSearchAdd(value);
          }
          setShowDropdown(false);
          inputRef.current?.blur();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    onChange('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-4 text-lg';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return 'bg-dark-50 border-0 focus:bg-white focus:ring-2 focus:ring-blood-500/20';
      case 'outlined':
        return 'border-2 border-dark-200 bg-transparent focus:border-blood-500';
      default:
        return 'border border-dark-300 bg-white focus:border-blood-500 focus:ring-2 focus:ring-blood-500/20';
    }
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon;
    
    switch (suggestion.type) {
      case 'location':
        return <MapPinIcon className="w-4 h-4" />;
      case 'recent':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return <MagnifyingGlassIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-10 pr-10 rounded-xl transition-all duration-200',
            'focus:outline-none',
            getSizeClasses(),
            getVariantClasses(),
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        />

        {(value || loading) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-blood-600 border-t-transparent rounded-full" />
            ) : (
              <button
                onClick={clearSearch}
                className="text-dark-400 hover:text-dark-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && showSuggestions && allSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-dark-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
        >
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-dark-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark-600">Tìm kiếm gần đây</span>
                {onRecentSearchClear && (
                  <button
                    onClick={onRecentSearchClear}
                    className="text-xs text-blood-600 hover:text-blood-700 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="py-2">
            {allSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'w-full px-4 py-3 text-left flex items-center gap-3 transition-colors',
                  'hover:bg-dark-50',
                  highlightedIndex === index && 'bg-blood-50 text-blood-700'
                )}
              >
                <div className={cn(
                  'text-dark-400',
                  highlightedIndex === index && 'text-blood-600'
                )}>
                  {getSuggestionIcon(suggestion)}
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium">{suggestion.text}</div>
                  {suggestion.metadata?.description && (
                    <div className="text-xs text-dark-500 mt-1">
                      {suggestion.metadata.description}
                    </div>
                  )}
                </div>

                {suggestion.type === 'recent' && (
                  <div className="text-xs text-dark-400">Gần đây</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;