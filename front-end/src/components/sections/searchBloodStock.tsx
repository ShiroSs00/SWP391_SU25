import React from 'react';
import clsx from 'clsx';
import Select from './select';
import Button from './button';

interface BloodStock {
    bloodType: string;
    units: number;
}

interface SearchBloodStockProps {
    bloodTypes: BloodStock[];
    onSearch: (bloodType: string) => void;
}

const SearchBloodStock: React.FC<SearchBloodStockProps> = ({ bloodTypes, onSearch }) => {
    const [selectedBloodType, setSelectedBloodType] = React.useState('');

    const bloodTypeOptions = [
        { value: '', label: 'All Blood Types' },
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
            <h3 className={clsx('text-lg font-semibold mb-4')}>Search Blood Stock</h3>
            <div className={clsx('flex gap-4')}>
                <Select
                    options={bloodTypeOptions}
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    name="bloodType"
                    className={clsx('w-full')}
                />
                <Button variant="primary" onClick={() => onSearch(selectedBloodType)}>
                    Search
                </Button>
            </div>
            <ul className={clsx('mt-4')}>
                {bloodTypes.map((stock) => (
                    <li key={stock.bloodType} className={clsx('py-2')}>
                        {stock.bloodType}: {stock.units} units
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBloodStock;