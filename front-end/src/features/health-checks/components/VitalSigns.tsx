import React from 'react';
import { Heart, Thermometer, Activity, Scale } from 'lucide-react';

interface VitalSignsProps {
  data: {
    weight: string;
    temperature: string;
    bloodPressure: string;
    pulse: string;
    hemoglobin: string;
    volumeToTake: string;
    note: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
  readOnly?: boolean;
}

export default function VitalSigns({ data, onChange, errors = {}, readOnly = false }: VitalSignsProps) {
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!readOnly) {
      onChange(field, e.target.value);
    }
  };

  const getInputClassName = (field: string) => {
    const baseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors";
    const errorClass = errors[field] ? "border-red-500 bg-red-50" : "border-gray-300";
    const readOnlyClass = readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white";
    return `${baseClass} ${errorClass} ${readOnlyClass}`;
  };

  const vitalSignsConfig = [
    { field: 'weight', label: 'Cân nặng', icon: Scale, placeholder: '65.5', suffix: 'kg', type: 'number', step: '0.1', min: '45', max: '200' },
    { field: 'temperature', label: 'Nhiệt độ', icon: Thermometer, placeholder: '36.5', suffix: '°C', type: 'number', step: '0.1', min: '36', max: '38' },
    { field: 'bloodPressure', label: 'Huyết áp', icon: Heart, placeholder: '120', suffix: 'mmHg', type: 'number', min: '90', max: '180' },
    { field: 'pulse', label: 'Nhịp tim', icon: Activity, placeholder: '75', suffix: 'bpm', type: 'number', min: '50', max: '100' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-6">
        <Heart className="h-6 w-6 text-red-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Chỉ số sinh hiệu</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vitalSignsConfig.map(({ field, label, icon: Icon, placeholder, suffix, type, step, min, max }) => (
          <div key={field} className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Icon className="h-4 w-4 mr-2 text-gray-500" />
              {label}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={type}
                value={data[field as keyof typeof data]}
                onChange={handleInputChange(field)}
                placeholder={placeholder}
                className={getInputClassName(field)}
                step={step}
                min={min}
                max={max}
                readOnly={readOnly}
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {suffix}
              </span>
            </div>
            {errors[field] && (
              <p className="text-red-600 text-sm flex items-center mt-1">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                {errors[field]}
              </p>
            )}
          </div>
        ))}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <div className="h-4 w-4 mr-2 bg-red-500 rounded-full"></div>
            Hemoglobin
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={data.hemoglobin}
              onChange={handleInputChange('hemoglobin')}
              placeholder="13.5"
              className={getInputClassName('hemoglobin')}
              step="0.1"
              min="12.5"
              max="18"
              readOnly={readOnly}
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              g/dL
            </span>
          </div>
          {errors.hemoglobin && (
            <p className="text-red-600 text-sm flex items-center mt-1">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {errors.hemoglobin}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <div className="h-4 w-4 mr-2 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
            Lượng máu lấy
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={data.volumeToTake}
              onChange={handleInputChange('volumeToTake')}
              placeholder="450"
              className={getInputClassName('volumeToTake')}
              min="350"
              max="500"
              step="50"
              readOnly={readOnly}
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              ml
            </span>
          </div>
          {errors.volumeToTake && (
            <p className="text-red-600 text-sm flex items-center mt-1">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {errors.volumeToTake}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <div className="h-4 w-4 mr-2 bg-gray-400 rounded"></div>
          Ghi chú
        </label>
        <textarea
          value={data.note}
          onChange={handleInputChange('note')}
          placeholder="Nhập ghi chú về tình trạng sức khỏe của người hiến máu..."
          className={getInputClassName('note')}
          rows={3}
          readOnly={readOnly}
        />
        {errors.note && (
          <p className="text-red-600 text-sm flex items-center mt-1">
            <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
            {errors.note}
          </p>
        )}
      </div>
    </div>
  );
}