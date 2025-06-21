import React from 'react';
import EventTable from '../components/EventTable';

const EventPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#b71c1c] mb-6">Quản lý sự kiện</h1>
      <EventTable />
    </div>
  );
};

export default EventPage;
