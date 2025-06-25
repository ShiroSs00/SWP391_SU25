import React from 'react';
import CheckupResults from '../components/CheckupResults';
import { useHealthCheck } from '../hooks/useHealthCheck';

export default function CheckupResultsPage() {
  const { getHealthCheck, healthCheck } = useHealthCheck();

  React.useEffect(() => {
    getHealthCheck('HC12345');
  }, [getHealthCheck]);

  if (!healthCheck) return <div>Đang tải...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kết quả kiểm tra</h1>
      <CheckupResults healthCheck={healthCheck} />
    </div>
  );
}