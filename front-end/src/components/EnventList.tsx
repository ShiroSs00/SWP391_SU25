// front-end/src/components/sections/EventList.tsx
import React from 'react';
import type { BloodDonationEvent } from '../../types/types';

interface Props {
    events: BloodDonationEvent[];
}

const EventList: React.FC<Props> = ({ events }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
                <div key={event.eventId} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">{event.nameOfEvent}</h3>
                    <p className="text-gray-600 mb-2">{event.location}</p>
                    <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm">
                            <span>Expected Volume:</span>
                            <span>{event.expectedVolume} ml</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Actual Volume:</span>
                            <span>{event.actualVolume} ml</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventList;