import React from 'react';
import clsx from 'clsx';
import Select from './select';

interface FilterSortProps {
    filterOptions: { value: string; label: string }[];
    sortOptions: { value: string; label: string }[];
    onFilterChange: (value: string) => void;
    onSortChange: (value: string) => void;
}

const FilterSort: React.FC<FilterSortProps> = ({
                                                   filterOptions,
                                                   sortOptions,
                                                   onFilterChange,
                                                   onSortChange,
                                               }) => {
    return (
        <div className={clsx('flex flex-col md:flex-row gap-4 mb-4')}>
            <Select
                options={filterOptions}
                value=""
                onChange={(e) => onFilterChange(e.target.value)}
                name="filter"
                className={clsx('w-full md:w-1/2')}
            />
            <Select
                options={sortOptions}
                value=""
                onChange={(e) => onSortChange(e.target.value)}
                name="sort"
                className={clsx('w-full md:w-1/2')}
            />
        </div>
    );
};

export default FilterSort;