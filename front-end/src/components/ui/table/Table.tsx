import React from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

export interface Column<T> {
    key: keyof T | 'actions';
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
    width?: string;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    searchable?: boolean;
    filterable?: boolean;
    onSearch?: (query: string) => void;
    onFilter?: () => void;
    sortConfig?: {
        key: keyof T;
        direction: 'asc' | 'desc';
    };
    onSort?: (key: keyof T) => void;
    emptyMessage?: string;
}

function Table<T extends Record<string, any>>({
                                                  data,
                                                  columns,
                                                  loading = false,
                                                  pagination,
                                                  searchable = false,
                                                  filterable = false,
                                                  onSearch,
                                                  onFilter,
                                                  sortConfig,
                                                  onSort,
                                                  emptyMessage = 'No data available'
                                              }: TableProps<T>) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    };

    const renderSortIcon = (columnKey: keyof T) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <ChevronUp className="w-4 h-4 opacity-0 group-hover:opacity-50" />;
        }

        return sortConfig.direction === 'asc' ?
            <ChevronUp className="w-4 h-4 text-red-600" /> :
            <ChevronDown className="w-4 h-4 text-red-600" />;
    };

    return (
        <div className="space-y-4">
            {(searchable || filterable) && (
                <div className="flex items-center gap-4">
                    {searchable && (
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    )}
                    {filterable && (
                        <button
                            onClick={onFilter}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    )}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${
                                        column.sortable ? 'cursor-pointer group hover:bg-gray-100 transition-colors duration-200' : ''
                                    }`}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && onSort?.(column.key as keyof T)}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable && renderSortIcon(column.key as keyof T)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-gray-500">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                    {columns.map((column) => (
                                        <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-900">
                                            {column.render
                                                ? column.render(row[column.key], row)
                                                : String(row[column.key] || '-')
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {pagination && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Table;