import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface CheckupResultsProps {
  healthCheck: {
    healthCheckId: string;
    weight: number;
    temperature: number;
    bloodPressure: number;
    pulse: number;
    hemoglobin: number;
    volumeToTake: number;
    note: string;
    fitToDonate: boolean;
  };
}

export default function CheckupResults({ healthCheck }: CheckupResultsProps) {
  const isFit = healthCheck.fitToDonate;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className={`bg-${isFit ? 'green' : 'red'}-50`}>
        <CardTitle className="flex items-center text-gray-900">
          {isFit ? (
            <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
          ) : (
            <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
          )}
          Kết quả kiểm tra sức khỏe
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Cân nặng:</span>
              <span>{healthCheck.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Nhiệt độ:</span>
              <span>{healthCheck.temperature} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Huyết áp:</span>
              <span>{healthCheck.bloodPressure} mmHg</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Nhịp tim:</span>
              <span>{healthCheck.pulse} bpm</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Hemoglobin:</span>
              <span>{healthCheck.hemoglobin} g/dL</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Lượng máu lấy:</span>
              <span>{healthCheck.volumeToTake} ml</span>
            </div>
          </div>
        </div>
        {healthCheck.note && (
          <div className="mb-6">
            <span className="font-medium">Ghi chú:</span>
            <p className="mt-1 text-gray-700">{healthCheck.note}</p>
          </div>
        )}
        <div className={`p-4 rounded-lg ${isFit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`font-semibold ${isFit ? 'text-green-800' : 'text-red-800'}`}>
            {isFit ? 'Đủ điều kiện hiến máu' : 'Không đủ điều kiện hiến máu'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}