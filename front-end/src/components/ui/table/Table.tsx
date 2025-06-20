import React, { useState, useMemo } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers';
import Button from '../button/Button';
import Input from '../input/Input';
import Spinner from '../spinner/Spinner';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  actions?: React.ReactNode;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Tìm kiếm...',
  sortConfig,
  onSort,
  onSearch,
  onRefresh,
  emptyMessage = 'Không có dữ liệu',
  className = '',
  rowClassName,
  onRowClick,
  pagination,
  actions
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSortConfig, setLocalSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const currentSortConfig = sortConfig || localSortConfig;

  const handleSort = (key: string) => {
    const direction = 
      currentSortConfig?.key === key && currentSortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';

    if (onSort) {
      onSort(key, direction);
    } else {
      setLocalSortConfig({ key, direction });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery || onSearch) return data;

    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, onSearch]);

  const sortedData = useMemo(() => {
    if (!currentSortConfig || onSort) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[currentSortConfig.key];
      const bValue = b[currentSortConfig.key];

      if (aValue < bValue) {
        return currentSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return currentSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, currentSortConfig, onSort]);

  const getSortIcon = (columnKey: string) => {
    if (currentSortConfig?.key !== columnKey) {
      return <div className="w-4 h-4" />;
    }

    return currentSortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  const renderCell = (column: TableColumn<T>, row: T, index: number) => {
    const value = row[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, row, index);
    }

    return value;
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-lg border border-dark-200', className)}>
      {/* Header */}
      {(searchable || onRefresh || actions) && (
        <div className="p-6 border-b border-dark-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {searchable && (
                <div className="max-w-md">
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                    variant="outlined"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={onRefresh}
                  leftIcon={<ArrowPathIcon className="w-4 h-4" />}
                  disabled={loading}
                >
                  Làm mới
                </Button>
              )}
              {actions}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-semibold text-dark-900',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-dark-100 transition-colors',
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key as string)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <Spinner size="lg" />
                    <span className="ml-3 text-dark-600">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-dark-500">
                    <FunnelIcon className="w-12 h-12 mx-auto mb-4 text-dark-300" />
                    <p className="text-lg font-medium mb-2">Không có dữ liệu</p>
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    'hover:bg-dark-50 transition-colors',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row, index)
                  )}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={cn(
                        'px-6 py-4 text-sm text-dark-900',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {renderCell(column, row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-dark-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-dark-600">
              Hiển thị {((pagination.currentPage - 1) * pagination.pageSize) + 1} đến{' '}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} trong{' '}
              {pagination.totalItems} kết quả
            </div>

            <div className="flex items-center gap-2">
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                className="px-3 py-1 border border-dark-300 rounded-lg text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Trước
                </Button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNumber = pagination.currentPage - 2 + i;
                  if (pageNumber < 1 || pageNumber > pagination.totalPages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === pagination.currentPage ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => pagination.onPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;