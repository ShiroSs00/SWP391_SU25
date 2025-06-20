import React, { useState } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon
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
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  headerClassName?: string;
  bodyClassName?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Tìm kiếm...',
  sortConfig,
  onSort,
  onRowClick,
  emptyMessage = 'Không có dữ liệu',
  className = '',
  rowClassName,
  headerClassName = '',
  bodyClassName = '',
  pagination
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  React.useEffect(() => {
    if (!searchable || !searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, searchTerm, searchable]);

  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const direction = 
      sortConfig?.key === key && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    onSort(key, direction);
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <div className="w-4 h-4" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4" />
      : <ChevronDownIcon className="w-4 h-4" />;
  };

  const renderCell = (column: TableColumn<T>, row: T, index: number) => {
    const value = column.key.toString().includes('.') 
      ? column.key.toString().split('.').reduce((obj, key) => obj?.[key], row)
      : row[column.key as keyof T];

    if (column.render) {
      return column.render(value, row, index);
    }

    return value;
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-lg border border-dark-200 overflow-hidden', className)}>
      {/* Header with Search */}
      {searchable && (
        <div className="p-6 border-b border-dark-200 bg-dark-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark-900">Dữ liệu</h3>
            <div className="flex items-center space-x-4">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                className="w-64"
              />
              <Button variant="outline" size="sm" leftIcon={<FunnelIcon className="w-4 h-4" />}>
                Lọc
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className={cn('bg-dark-50 border-b border-dark-200', headerClassName)}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-semibold text-dark-900',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-dark-100 transition-colors'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key.toString())}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key.toString())}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className={cn('divide-y divide-dark-100', bodyClassName)}>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Spinner size="md" />
                    <span className="text-dark-600">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-dark-500">
                    <div className="text-lg font-medium mb-2">Không có dữ liệu</div>
                    <div className="text-sm">{emptyMessage}</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    'hover:bg-dark-50 transition-colors',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row, rowIndex)
                  )}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'px-6 py-4 text-sm text-dark-900',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {renderCell(column, row, rowIndex)}
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
        <div className="px-6 py-4 border-t border-dark-200 bg-dark-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-dark-600">
              Hiển thị {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} trong tổng số {pagination.totalItems} kết quả
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Page Size Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-dark-600">Hiển thị:</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                  className="border border-dark-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blood-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                >
                  Trước
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => pagination.onPageChange(page)}
                        className={cn(
                          'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                          page === pagination.currentPage
                            ? 'bg-blood-600 text-white'
                            : 'text-dark-600 hover:bg-dark-100'
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
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