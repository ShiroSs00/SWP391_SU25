// front-end/src/components/sections/HealthCheckTable.tsx
import React from 'react';
import type { HealthCheck } from '../../types/types';

interface Props {
    healthChecks: HealthCheck[];
}

const HealthCheckTable: React.FC<Props> = ({ healthChecks }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Pressure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hemoglobin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {healthChecks.map((check) => (
                    <tr key={check.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{check.weight} kg</td>
                        <td className="px-6 py-4 whitespace-nowrap">{check.temperature}°C</td>
                        <td className="px-6 py-4 whitespace-nowrap">{check.bloodPressure}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{check.hemoglobin} g/dL</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${check.isPEDetails ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {check.isPEDetails ? 'Passed' : 'Failed'}
                </span>
                        </td>
                        <td className="px-6 py-4">{check.note || '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default HealthCheckTable;