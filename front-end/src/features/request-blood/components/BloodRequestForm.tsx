import React, { useState, useEffect } from 'react';
import { Heart, AlertTriangle, Droplets, CheckCircle, Clock, Package, ArrowRight, Shield, Activity } from 'lucide-react';
import { useRequestBlood } from '../hooks/useRequest-Blood';
import { useBloodComponents, useBloodCodes } from '../hooks/useBloodData';
import { getProfile } from '../services/user.serviecs';
import type { BloodRequestPayload,  UserProfile,  BloodComponent } from '../types/request-blood.types';
import { createBloodRequest } from '../services/blood-request.services';

/**
 * BLOOD REQUEST FORM COMPONENT - ENHANCED UI
 * 
 * UI/UX Improvements:
 * 1. Modern card-based design with gradients
 * 2. Step-by-step visual indicators
 * 3. Smooth animations and transitions
 * 4. Better form validation feedback
 * 5. Interactive elements with hover states
 * 6. Progress indicators
 * 7. Improved loading states
 * 8. Better mobile responsiveness
 */

interface VolumeOptionType {
  value: number;
  label: string;
  description: string;
  isStandard: boolean;
}

const VOLUME_OPTIONS_BY_COMPONENT = {
  'Toàn phần': [
    { value: 250, label: '250ml', description: '1 đơn vị nhỏ', isStandard: true },
    { value: 350, label: '350ml', description: '1 đơn vị chuẩn', isStandard: true },
    { value: 450, label: '450ml', description: '1 đơn vị lớn', isStandard: true },
  ],
  'Hồng cầu': [
    { value: 120, label: '120ml', description: '1 đơn vị nhỏ', isStandard: true },
    { value: 200, label: '200ml', description: '1 đơn vị chuẩn', isStandard: true },
  ],
  'Tiểu cầu': [
    { value: 60, label: '60ml', description: '1 đơn vị nhỏ', isStandard: true },
  ],
  'Huyết tương': [
    { value: 200, label: '200ml', description: '1 đơn vị nhỏ', isStandard: true },
    { value: 300, label: '300ml', description: '1 đơn vị chuẩn', isStandard: true },
  ],
};

interface BloodRequestFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  defaultPatientName?: string;
}

const BloodRequestForm: React.FC<BloodRequestFormProps> = ({ onSuccess, onError, defaultPatientName }) => {
  const { createRequest, loading, error } = useRequestBlood();
  const { components, loading: componentsLoading } = useBloodComponents();
  const { bloodCodes, loading: bloodCodesLoading } = useBloodCodes();

  // Form state theo đúng backend payload
  const [formData, setFormData] = useState<BloodRequestPayload & {
    selectedComponent: string;
    customVolume: string;
    bloodCode: string;
  }>({
    requestDate: new Date().toISOString().split('T')[0],
    bloodCode: '',
    componentId: '',
    emergency: false,
    volume: 0,
    selectedComponent: '',
    customVolume: ''
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Volume options theo giao diện trong ảnh
// CÁCH 2: Tạo volume options dựa trên component type
const getVolumeOptions = (): VolumeOptionType[] => {
  if (!formData.componentId) {
    console.log('No componentId selected');
    return VOLUME_OPTIONS_BY_COMPONENT['Toàn phần'];
  }

  // Tìm component được chọn
  const selectedComponent = components.find(c => c.componentId === formData.componentId);
  if (!selectedComponent) {
    console.log('Component not found for ID:', formData.componentId);
    return VOLUME_OPTIONS_BY_COMPONENT['Toàn phần'];
  }

  console.log('Selected component:', selectedComponent);
  
  // Map component type với volume options
  const componentType = selectedComponent.type.toLowerCase();
  console.log('Component type:', componentType);
  
  let volumeKey: keyof typeof VOLUME_OPTIONS_BY_COMPONENT = 'Toàn phần'; // Specify type
  
  if (componentType.includes('hồng cầu') || componentType.includes('hong cau')) {
    volumeKey = 'Hồng cầu';
  } else if (componentType.includes('tiểu cầu') || componentType.includes('tieu cau')) {
    volumeKey = 'Tiểu cầu';
  } else if (componentType.includes('huyết tương') || componentType.includes('huyet tuong')) {
    volumeKey = 'Huyết tương';
  }
  
  console.log('Volume key:', volumeKey);
  console.log('Volume options:', VOLUME_OPTIONS_BY_COMPONENT[volumeKey]);
  
  return VOLUME_OPTIONS_BY_COMPONENT[volumeKey];
};


  /**
   * LẤY THÀNH PHẦN MÁU KHẢ DỤNG DỰA TRÊN MÃ MÁU ĐÃ CHỌN
   */
  const getAvailableComponents = (): BloodComponent[] => {
    if (!formData.bloodCode || components.length === 0) {
      return [];
    }
    
    const selectedBloodCode = bloodCodes.find(code => code.bloodCode === formData.bloodCode);
    if (!selectedBloodCode) {
      return [];
    }
    
    const availableComponents = components.filter(component => {
      return true;
    });
    
    return availableComponents;
  };

  /**
   * LOAD USER PROFILE KHI COMPONENT MOUNT
   */
  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const profile = await getProfile(token);
        setUserProfile(profile);

        setFormData(prev => ({
          ...prev,
          patientName: profile.name || ''
        }));
      } catch (err) {
        console.error('Error loading user profile:', err);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    if (defaultPatientName) {
      setFormData(prev => ({
        ...prev,
        patientName: defaultPatientName
      }));
    }
  }, [defaultPatientName]);

  /**
   * VALIDATION FUNCTIONS
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.bloodCode) {
      errors.bloodCode = 'Vui lòng chọn mã máu cần thiết';
    }

    if (!formData.selectedComponent) {
      errors.selectedComponent = 'Vui lòng chọn thành phần máu';
    }

    if (!formData.volume || formData.volume <= 0) {
      errors.volume = 'Vui lòng chọn thể tích máu';
    }

    if (!formData.requestDate) {
      errors.requestDate = 'Ngày yêu cầu là bắt buộc';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * HANDLE BLOOD CODE SELECTION
   */
  const handleBloodCodeChange = (bloodCode: string) => {
    setFormData(prev => ({
      ...prev,
      bloodCode: bloodCode,
      selectedComponent: '',
      volume: 0,
      customVolume: ''
    }));
    if (bloodCode) setCurrentStep(2);
  };

  /**
   * HANDLE COMPONENT SELECTION
   */
  const handleComponentChange = (componentId: string) => {
    const selectedComponent = components.find(c => c.componentId === componentId);
    setFormData(prev => ({
      ...prev,
      selectedComponent: selectedComponent?.componentId || '',
      componentId: componentId,
      volume: 0,
      customVolume: ''
    }));
    if (componentId) setCurrentStep(3);
  };

  /**
   * HANDLE VOLUME SELECTION
   */
  const handleVolumeSelect = (volume: number) => {
    setFormData(prev => ({
      ...prev,
      volume: volume,
      customVolume: ''
    }));
    if (volume > 0) setCurrentStep(4);
  };

  const handleCustomVolumeChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      volume: numValue,
      customVolume: value
    }));
  };

  /**
   * FORM SUBMIT HANDLER
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: BloodRequestPayload = {
      requestDate: formData.requestDate,
      bloodCode: formData.bloodCode,
      componentId: formData.componentId,
      emergency: formData.emergency,
      volume: formData.volume
    };

    try {
      await createBloodRequest(payload);
      console.log('Payload sent: ',payload)
      setShowSuccess(true);

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (err) {
      console.error('Error creating request:', err);
      if (onError) onError('Có lỗi xảy ra khi tạo yêu cầu. Đã quá số hạn để cho máu của cơ sơ của chúng tôi. Mong bạn thứ lỗi cho chúng tôi.');
    }
  };

  // Kiểm tra token
  const token = localStorage.getItem('authToken');
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Cần đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để tạo yêu cầu nhận máu.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-green-100">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Gửi yêu cầu thành công!</h2>
          <p className="text-gray-600 mb-6">
            Yêu cầu nhận máu của bạn đã được gửi. Hệ thống sẽ kiểm tra kho máu và thông báo kết quả sớm nhất.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Đang chuyển về trang chính...</span>
          </div>
        </div>
      </div>
    );
  }

  // Progress Steps
  const steps = [
    { id: 1, name: 'Chọn mã máu', icon: Droplets },
    { id: 2, name: 'Chọn thành phần', icon: Package },
    { id: 3, name: 'Chọn thể tích', icon: Activity },
    { id: 4, name: 'Hoàn tất', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-400 border border-gray-200'
                }`}>
                  <step.icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className={`w-4 h-4 ${currentStep > step.id ? 'text-red-500' : 'text-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
          {/* Header với gradient đẹp hơn */}
          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Đăng Ký Yêu Cầu Nhận Máu</h1>
                  <p className="text-red-100 text-sm mt-1">Vui lòng điền đầy đủ thông tin bên dưới</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content với spacing tốt hơn */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Thông Tin Yêu Cầu Máu */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thông Tin Yêu Cầu Máu</h3>
              </div>

              {/* Blood Code Selection - Enhanced */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Mã máu cần thiết <span className="text-red-500">*</span>
                </label>
                {bloodCodesLoading ? (
                  <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full mr-3"></div>
                    <span className="text-gray-600">Đang tải danh sách mã máu...</span>
                  </div>
                ) : (
                  <select
                    value={formData.bloodCode}
                    onChange={(e) => handleBloodCodeChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-red-100 focus:border-red-500 ${
                      validationErrors.bloodCode ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option value="">Chọn mã máu cần thiết</option>
                    {bloodCodes.map((code) => (
                      <option key={code.bloodCode} value={code.bloodCode}>
                        {code.bloodCode} 
                      </option>
                    ))}
                  </select>
                )}
                {validationErrors.bloodCode && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{validationErrors.bloodCode}</span>
                  </div>
                )}
              </div>

              {/* Component Selection - Enhanced */}
              {formData.bloodCode && (
                <div className="space-y-3 animate-fade-in">
                  <label className="block text-sm font-semibold text-gray-700">
                    Thành phần máu <span className="text-red-500">*</span>
                  </label>
                  
                  {componentsLoading ? (
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full mr-3"></div>
                      <span className="text-gray-600">Đang tải thành phần máu...</span>
                    </div>
                  ) : getAvailableComponents().length > 0 ? (
                    <select
                      value={formData.componentId}
                      onChange={(e) => {
                        const selectedComponent = getAvailableComponents().find(c => c.componentId === e.target.value);
                        handleComponentChange(e.target.value);
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-red-100 focus:border-red-500 ${
                        validationErrors.selectedComponent ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <option value="">Chọn thành phần máu</option>
                      {getAvailableComponents().map((component) => (
                        <option key={component.componentId} value={component.componentId}>
                          {component.type} - {component.description}
                          {component.expirationDays && ` (Hạn sử dụng: ${component.expirationDays} ngày)`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-center">
                      Không có thành phần máu khả dụng cho mã máu này
                    </div>
                  )}
                  
                  {validationErrors.selectedComponent && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{validationErrors.selectedComponent}</span>
                    </div>
                  )}

                  {/* Thông tin về blood code */}
                  {formData.bloodCode && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-blue-900">Thông tin đã chọn</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        <strong>Mã máu:</strong> {formData.bloodCode}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Tìm thấy <strong>{getAvailableComponents().length}</strong> thành phần máu khả dụng
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Volume Selection - Enhanced */}
              {formData.selectedComponent && (
                <div className="space-y-4 animate-fade-in">
                  <label className="block text-sm font-semibold text-gray-700">
                    Thể tích cần thiết <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {getVolumeOptions().map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleVolumeSelect(option.value)}
                        className={`p-4 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                          formData.volume === option.value
                            ? 'border-red-500 bg-gradient-to-br from-red-50 to-pink-50 text-red-700 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="font-bold text-lg">{option.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                      </button>
                    ))}
                  </div>
                  {validationErrors.volume && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{validationErrors.volume}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Request Date - Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ngày yêu cầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestDate: e.target.value }))}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-red-100 focus:border-red-500 ${
                      validationErrors.requestDate ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {validationErrors.requestDate && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{validationErrors.requestDate}</span>
                    </div>
                  )}
                </div>

                {/* Emergency Checkbox - Enhanced */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Loại yêu cầu</label>
                  <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      id="emergency"
                      checked={formData.emergency}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergency: e.target.checked }))}
                      className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="emergency" className="text-sm font-medium text-gray-700 flex items-center cursor-pointer">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Đây là trường hợp khẩn cấp
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display - Enhanced */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 animate-shake">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button - Enhanced */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              {loading && (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              <Heart className="w-6 h-6" />
              <span>{loading ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Hiến Máu'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BloodRequestForm;