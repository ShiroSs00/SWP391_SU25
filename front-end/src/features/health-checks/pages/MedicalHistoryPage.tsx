import React from 'react';
import MedicalHistory from '../components/MedicalHistory';

export default function MedicalHistoryPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lịch sử khám sức khỏe</h1>
      <MedicalHistory donorId="D12345" donorName="Nguyen Van A" showTrends={true} limit={5} />
    </div>
  );
}