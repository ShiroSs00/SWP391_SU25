import React from 'react';
import HealthCheckForm from '../components/HealthCheckForm';
import CheckupResultsPage from './CheckupResultsPage';

export default function HealthCheckPage() {
  const handleSuccess = (healthCheckId: string) => {
    alert(`Kiểm tra sức khỏe thành công! ID: ${healthCheckId}`);
  };

  const handleCancel = () => {
    alert('Đã hủy kiểm tra sức khỏe');
  };

  const donorInfo = {
    name: 'Nguyen Van A',
    id: 'D12345',
    bloodType: 'A+',
    lastDonation: '2025-06-01'
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kiểm tra sức khỏe hiến máu</h1>
      <HealthCheckForm 
        donationRegistrationId="REG123"
        donorInfo={donorInfo}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}