import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/Button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { CheckCircle, AlertTriangle, User, Calendar, Clock, Save, X } from 'lucide-react';
import VitalSigns from './VitalSigns';
import { useHealthCheck } from '../hooks/useHealthCheck';
import type { HealthCheckFormData } from '../types/health.types';

interface HealthCheckFormProps {
  donationRegistrationId: string;
  donorInfo?: {
    name: string;
    id: string;
    bloodType: string;
    lastDonation?: string;
  };
  onSuccess?: (healthCheckId: string) => void;
  onCancel?: () => void;
}

export default function HealthCheckForm({ 
  donationRegistrationId, 
  donorInfo, 
  onSuccess, 
  onCancel 
}: HealthCheckFormProps) {
  const { createHealthCheck, validateForm, submitting, error, clearError } = useHealthCheck();
  
  const [formData, setFormData] = useState<HealthCheckFormData>({
    weight: '',
    temperature: '',
    bloodPressure: '',
    pulse: '',
    hemoglobin: '',
    volumeToTake: '450',
    note: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePreview = () => {
    const validation = validateForm(formData);
    if (validation.isValid) {
      setShowPreview(true);
    } else {
      setErrors(validation.errors);
    }
  };

  const handleSubmit = async () => {
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const numericData = {
      weight: parseFloat(formData.weight),
      temperature: parseFloat(formData.temperature),
      bloodPressure: parseFloat(formData.bloodPressure),
      pulse: parseInt(formData.pulse),
      hemoglobin: parseFloat(formData.hemoglobin),
      volumeToTake: parseInt(formData.volumeToTake),
      note: formData.note,
      fitToDonate: determineFitness(formData)
    };

    const result = await createHealthCheck(donationRegistrationId, numericData);
    if (result) {
      onSuccess?.(result.healthCheckId);
    }
  };

  const determineFitness = (data: HealthCheckFormData): boolean => {
    const weight = parseFloat(data.weight);
    const temperature = parseFloat(data.temperature);
    const bloodPressure = parseFloat(data.bloodPressure);
    const pulse = parseInt(data.pulse);
    const hemoglobin = parseFloat(data.hemoglobin);

    return weight >= 45 && 
           temperature <= 37.5 && 
           bloodPressure >= 100 && bloodPressure <= 160 &&
           pulse >= 60 && pulse <= 100 &&
           hemoglobin >= 13.0;
  };

  const getFitnessStatus = () => {
    if (!formData.weight || !formData.temperature || !formData.bloodPressure || 
        !formData.pulse || !formData.hemoglobin) {
      return null;
    }
    const fit = determineFitness(formData);
    return {
      fit,
      message: fit ? 'Đủ điều kiện hiến máu' : 'Chưa đủ điều kiện hiến máu'
    };
  };

  const fitnessStatus = getFitnessStatus();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  if (showPreview) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center text-blue-900">
            <CheckCircle className="h-6 w-6 mr-3" />
            Xác nhận thông tin khám sức khỏe
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {donorInfo && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Thông tin người hiến máu</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Họ tên:</span> {donorInfo.name}</div>
                <div><span className="font-medium">Nhóm máu:</span> {donorInfo.bloodType}</div>
                <div><span className="font-medium">Mã hiến máu:</span> {donorInfo.id}</div>
                {donorInfo.lastDonation && (
                  <div><span className="font-medium">Lần hiến cuối:</span> {donorInfo.lastDonation}</div>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Cân nặng:</span>
                <span>{formData.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Nhiệt độ:</span>
                <span>{formData.temperature} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Huyết áp:</span>
                <span>{formData.bloodPressure} mmHg</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Nhịp tim:</span>
                <span>{formData.pulse} bpm</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Hemoglobin:</span>
                <span>{formData.hemoglobin} g/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Lượng máu lấy:</span>
                <span>{formData.volumeToTake} ml</span>
              </div>
            </div>
          </div>
          {formData.note && (
            <div className="mb-6">
              <span className="font-medium">Ghi chú:</span>
              <p className="mt-1 text-gray-700">{formData.note}</p>
            </div>
          )}
          {fitnessStatus && (
            <Alert className={`mb-6 ${fitnessStatus.fit ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
              <div className="flex items-center">
                {fitnessStatus.fit ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                )}
                <AlertDescription className={fitnessStatus.fit ? 'text-green-800' : 'text-orange-800'}>
                  {fitnessStatus.message}
                </AlertDescription>
              </div>
            </Alert>
          )}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
              disabled={submitting}
            >
              <X className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu kết quả
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
        <CardTitle className="flex items-center text-red-900">
          <User className="h-6 w-6 mr-3" />
          Khám sức khỏe trước khi hiến máu
        </CardTitle>
        <div className="flex items-center text-sm text-red-700 mt-2">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date().toLocaleDateString('vi-VN')} - {new Date().toLocaleTimeString('vi-VN')}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {donorInfo && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Thông tin người hiến máu</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Họ tên:</span> {donorInfo.name}</div>
              <div><span className="font-medium">Nhóm máu:</span> {donorInfo.bloodType}</div>
              <div><span className="font-medium">Mã hiến máu:</span> {donorInfo.id}</div>
              {donorInfo.lastDonation && (
                <div><span className="font-medium">Lần hiến cuối:</span> {donorInfo.lastDonation}</div>
              )}
            </div>
          </div>
        )}
        <VitalSigns
          data={formData}
          onChange={handleFieldChange}
          errors={errors}
        />
        {fitnessStatus && (
          <Alert className={`mt-6 ${fitnessStatus.fit ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex items-center">
              {fitnessStatus.fit ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
              )}
              <AlertDescription className={fitnessStatus.fit ? 'text-green-800' : 'text-orange-800'}>
                {fitnessStatus.message}
              </AlertDescription>
            </div>
          </Alert>
        )}
        {error && (
          <Alert className="mt-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end space-x-3 mt-8">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
          )}
          <Button
            onClick={handlePreview}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Xem trước kết quả
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}