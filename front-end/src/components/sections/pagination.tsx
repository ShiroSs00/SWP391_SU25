import React from 'react';
import clsx from 'clsx';
import Button from './button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={clsx('flex justify-center gap-2 mt-4')}>
            <Button
                variant="secondary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            {pages.map((page) => (
                <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'secondary'}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}
            <Button
                variant="secondary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;