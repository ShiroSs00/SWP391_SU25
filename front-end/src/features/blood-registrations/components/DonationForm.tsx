import React from 'react';
import { 
  UserIcon, 
  HeartIcon, 
  MapPinIcon, 
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Card from '../../../components/ui/card/Card';
import Input from '../../../components/ui/input/Input';
import Button from '../../../components/ui/button/Button';
import Badge from '../../../components/ui/badge/Badge';
import { DonationFormData, BloodType, DonationType } from '../types/donation.types';

interface DonationFormProps {
  onSubmit: (data: DonationFormData) => void;
  onDataChange: (data: Partial<DonationFormData>) => void;
  initialData?: Partial<DonationFormData>;
  isSubmitting?: boolean;
  className?: string;
}

const BLOOD_TYPES: { value: BloodType; label: string; description: string }[] = [
  { value: 'A+', label: 'A+', description: 'Phổ biến (34%)' },
  { value: 'A-', label: 'A-', description: 'Hiếm (6%)' },
  { value: 'B+', label: 'B+', description: 'Phổ biến (9%)' },
  { value: 'B-', label: 'B-', description: 'Hiếm (2%)' },
  { value: 'AB+', label: 'AB+', description: 'Hiếm (3%)' },
  { value: 'AB-', label: 'AB-', description: 'Rất hiếm (1%)' },
  { value: 'O+', label: 'O+', description: 'Phổ biến (38%)' },
  { value: 'O-', label: 'O-', description: 'Vạn năng (7%)' }
];

const DONATION_TYPES: { value: DonationType; label: string; description: string; duration: string; color: string }[] = [
  { 
    value: 'whole-blood', 
    label: 'Máu toàn phần', 
    description: 'Hiến máu truyền thống, phù hợp cho người mới bắt đầu',
    duration: '45 phút',
    color: 'blood'
  },
  { 
    value: 'plasma', 
    label: 'Huyết tương', 
    description: 'Hiến huyết tương giúp điều trị bệnh nhân bỏng, sốc',
    duration: '75 phút',
    color: 'emergency'
  },
  { 
    value: 'platelets', 
    label: 'Tiểu cầu', 
    description: 'Hiến tiểu cầu giúp bệnh nhân ung thư, bệnh máu',
    duration: '180 phút',
    color: 'success'
  },
  { 
    value: 'red-cells', 
    label: 'Hồng cầu', 
    description: 'Hiến hồng cầu giúp bệnh nhân thiếu máu, phẫu thuật',
    duration: '60 phút',
    color: 'info'
  }
];

const DonationForm: React.FC<DonationFormProps> = ({
  onSubmit,
  onDataChange,
  initialData = {},
  isSubmitting = false,
  className = ''
}) => {
  const [formData, setFormData] = React.useState<Partial<DonationFormData>>({
    donationType: 'whole-blood',
    gender: 'male',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Vietnam'
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    medicalHistory: {
      hasChronicIllness: false,
      takingMedications: false,
      hasAllergies: false,
      hasRecentSurgery: false,
      hasRecentTattoo: false,
      hasRecentTravel: false,
      hasRecentIllness: false,
      smokingStatus: 'never',
      alcoholConsumption: 'none'
    },
    consentToContact: false,
    acceptedTerms: false,
    marketingConsent: false,
    ...initialData
  });

  const [currentStep, setCurrentStep] = React.useState(1);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const totalSteps = 5;

  const updateFormData = (updates: Partial<DonationFormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onDataChange(newData);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName) newErrors.firstName = 'Vui lòng nhập họ tên';
        if (!formData.lastName) newErrors.lastName = 'Vui lòng nhập tên';
        if (!formData.email) newErrors.email = 'Vui lòng nhập email';
        if (!formData.phone) newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng nhập ngày sinh';
        if (!formData.bloodType) newErrors.bloodType = 'Vui lòng chọn nhóm máu';
        break;
      case 2: // Address & Contact
        if (!formData.address?.street) newErrors.street = 'Vui lòng nhập địa chỉ';
        if (!formData.address?.city) newErrors.city = 'Vui lòng chọn thành phố';
        if (!formData.emergencyContact?.name) newErrors.emergencyName = 'Vui lòng nhập tên người liên hệ khẩn cấp';
        if (!formData.emergencyContact?.phone) newErrors.emergencyPhone = 'Vui lòng nhập số điện thoại khẩn cấp';
        break;
      case 5: // Terms & Consent
        if (!formData.acceptedTerms) newErrors.acceptedTerms = 'Vui lòng đồng ý với điều khoản';
        if (!formData.consentToContact) newErrors.consentToContact = 'Vui lòng đồng ý cho phép liên hệ';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData as DonationFormData);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              step < currentStep 
                ? 'bg-life-500 text-white' 
                : step === currentStep 
                  ? 'bg-blood-600 text-white shadow-glow' 
                  : 'bg-dark-200 text-dark-500'
            }`}>
              {step < currentStep ? (
                <CheckCircleIcon className="w-6 h-6" />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                step < currentStep ? 'bg-life-500' : 'bg-dark-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-dark-900">
          Bước {currentStep} / {totalSteps}
        </h3>
        <p className="text-dark-600">
          {currentStep === 1 && 'Thông tin cá nhân'}
          {currentStep === 2 && 'Địa chỉ & Liên hệ khẩn cấp'}
          {currentStep === 3 && 'Tiền sử bệnh án'}
          {currentStep === 4 && 'Tùy chọn hiến máu'}
          {currentStep === 5 && 'Điều khoản & Đồng ý'}
        </p>
      </div>
    </div>
  );

  const renderPersonalInformation = () => (
    <Card variant="default" padding="lg" className="animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blood-100 rounded-xl flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-blood-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-dark-900">Thông tin cá nhân</h3>
          <p className="text-dark-600">Vui lòng cung cấp thông tin chính xác</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Họ"
          placeholder="Nhập họ của bạn"
          value={formData.firstName || ''}
          onChange={(e) => updateFormData({ firstName: e.target.value })}
          error={errors.firstName}
          leftIcon={<UserIcon className="w-5 h-5" />}
          required
        />

        <Input
          label="Tên"
          placeholder="Nhập tên của bạn"
          value={formData.lastName || ''}
          onChange={(e) => updateFormData({ lastName: e.target.value })}
          error={errors.lastName}
          leftIcon={<UserIcon className="w-5 h-5" />}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          value={formData.email || ''}
          onChange={(e) => updateFormData({ email: e.target.value })}
          error={errors.email}
          leftIcon={<EnvelopeIcon className="w-5 h-5" />}
          required
        />

        <Input
          label="Số điện thoại"
          type="tel"
          placeholder="0123 456 789"
          value={formData.phone || ''}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          error={errors.phone}
          leftIcon={<PhoneIcon className="w-5 h-5" />}
          required
        />

        <Input
          label="Ngày sinh"
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
          error={errors.dateOfBirth}
          leftIcon={<CalendarIcon className="w-5 h-5" />}
          required
        />

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({ gender: option.value as any })}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  formData.gender === option.value
                    ? 'border-blood-500 bg-blood-50 text-blood-700'
                    : 'border-dark-200 hover:border-dark-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blood Type Selection */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-dark-700 mb-4">
          Nhóm máu <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BLOOD_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateFormData({ bloodType: type.value })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 group ${
                formData.bloodType === type.value
                  ? 'border-blood-500 bg-blood-50'
                  : 'border-dark-200 hover:border-blood-300 hover:bg-blood-50'
              }`}
            >
              <div className={`text-2xl font-bold mb-1 ${
                formData.bloodType === type.value ? 'text-blood-600' : 'text-dark-700'
              }`}>
                {type.label}
              </div>
              <div className="text-xs text-dark-600">{type.description}</div>
            </button>
          ))}
        </div>
        {errors.bloodType && (
          <p className="mt-2 text-sm text-red-600">{errors.bloodType}</p>
        )}
      </div>
    </Card>
  );

  const renderAddressContact = () => (
    <Card variant="default" padding="lg" className="animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <MapPinIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-dark-900">Địa chỉ & Liên hệ khẩn cấp</h3>
          <p className="text-dark-600">Thông tin để liên hệ khi cần thiết</p>
        </div>
      </div>

      {/* Address */}
      <div className="mb-8">
        <h4 className="font-semibold text-dark-900 mb-4">Địa chỉ hiện tại</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Địa chỉ"
              placeholder="Số nhà, tên đường"
              value={formData.address?.street || ''}
              onChange={(e) => updateFormData({ 
                address: { ...formData.address, street: e.target.value }
              })}
              error={errors.street}
              leftIcon={<MapPinIcon className="w-5 h-5" />}
              required
            />
          </div>

          <Input
            label="Thành phố"
            placeholder="Chọn thành phố"
            value={formData.address?.city || ''}
            onChange={(e) => updateFormData({ 
              address: { ...formData.address, city: e.target.value }
            })}
            error={errors.city}
            required
          />

          <Input
            label="Mã bưu điện"
            placeholder="700000"
            value={formData.address?.zipCode || ''}
            onChange={(e) => updateFormData({ 
              address: { ...formData.address, zipCode: e.target.value }
            })}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h4 className="font-semibold text-dark-900 mb-4">Liên hệ khẩn cấp</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Họ tên người liên hệ"
            placeholder="Nhập họ tên"
            value={formData.emergencyContact?.name || ''}
            onChange={(e) => updateFormData({ 
              emergencyContact: { ...formData.emergencyContact, name: e.target.value }
            })}
            error={errors.emergencyName}
            leftIcon={<UserIcon className="w-5 h-5" />}
            required
          />

          <Input
            label="Mối quan hệ"
            placeholder="Ví dụ: Bố/Mẹ/Anh/Chị"
            value={formData.emergencyContact?.relationship || ''}
            onChange={(e) => updateFormData({ 
              emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
            })}
          />

          <Input
            label="Số điện thoại khẩn cấp"
            type="tel"
            placeholder="0123 456 789"
            value={formData.emergencyContact?.phone || ''}
            onChange={(e) => updateFormData({ 
              emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
            })}
            error={errors.emergencyPhone}
            leftIcon={<PhoneIcon className="w-5 h-5" />}
            required
          />
        </div>
      </div>
    </Card>
  );

  const renderMedicalHistory = () => (
    <Card variant="default" padding="lg" className="animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-dark-900">Tiền sử bệnh án</h3>
          <p className="text-dark-600">Thông tin y tế để đảm bảo an toàn</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Medical Questions */}
        {[
          { key: 'hasChronicIllness', label: 'Bạn có mắc bệnh mãn tính không?', description: 'Tiểu đường, cao huyết áp, tim mạch...' },
          { key: 'takingMedications', label: 'Bạn có đang dùng thuốc thường xuyên không?', description: 'Thuốc kê đơn hoặc không kê đơn' },
          { key: 'hasAllergies', label: 'Bạn có dị ứng với thuốc hoặc thực phẩm không?', description: 'Dị ứng nghiêm trọng cần lưu ý' },
          { key: 'hasRecentSurgery', label: 'Bạn có phẫu thuật trong 6 tháng qua không?', description: 'Bao gồm phẫu thuật nhỏ' },
          { key: 'hasRecentTattoo', label: 'Bạn có xăm hình trong 12 tháng qua không?', description: 'Bao gồm xỏ khuyên, châm cứu' },
          { key: 'hasRecentTravel', label: 'Bạn có đi du lịch nước ngoài gần đây không?', description: 'Trong vòng 3 tháng qua' },
          { key: 'hasRecentIllness', label: 'Bạn có bị ốm trong 2 tuần qua không?', description: 'Sốt, cảm cúm, nhiễm trùng...' }
        ].map((question) => (
          <div key={question.key} className="p-4 border border-dark-200 rounded-xl hover:border-dark-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-medium text-dark-900 mb-1">{question.label}</h5>
                <p className="text-sm text-dark-600">{question.description}</p>
              </div>
              <div className="flex space-x-3 ml-4">
                {[
                  { value: false, label: 'Không', color: 'life' },
                  { value: true, label: 'Có', color: 'emergency' }
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => updateFormData({
                      medicalHistory: {
                        ...formData.medicalHistory,
                        [question.key]: option.value
                      }
                    })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.medicalHistory?.[question.key as keyof typeof formData.medicalHistory] === option.value
                        ? option.color === 'life'
                          ? 'bg-life-500 text-white'
                          : 'bg-emergency-500 text-white'
                        : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderDonationPreferences = () => (
    <Card variant="default" padding="lg" className="animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blood-100 rounded-xl flex items-center justify-center">
          <HeartSolidIcon className="w-6 h-6 text-blood-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-dark-900">Tùy chọn hiến máu</h3>
          <p className="text-dark-600">Chọn loại hiến máu phù hợp với bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DONATION_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => updateFormData({ donationType: type.value })}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
              formData.donationType === type.value
                ? 'border-blood-500 bg-blood-50'
                : 'border-dark-200 hover:border-blood-300 hover:bg-blood-50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className={`font-semibold ${
                formData.donationType === type.value ? 'text-blood-700' : 'text-dark-900'
              }`}>
                {type.label}
              </h4>
              <Badge 
                variant={type.color as any} 
                size="sm"
                leftIcon={<ClockIcon className="w-3 h-3" />}
              >
                {type.duration}
              </Badge>
            </div>
            <p className="text-sm text-dark-600 leading-relaxed">
              {type.description}
            </p>
          </button>
        ))}
      </div>

      {/* Additional Preferences */}
      <div className="mt-8 p-6 bg-gradient-to-r from-life-50 to-life-100 rounded-xl border border-life-200">
        <div className="flex items-start space-x-3">
          <HeartSolidIcon className="w-6 h-6 text-life-600 mt-0.5 animate-heartbeat" />
          <div>
            <h4 className="font-semibold text-life-900 mb-2">Cảm ơn sự hào phóng của bạn!</h4>
            <p className="text-sm text-life-800 mb-3">
              Việc hiến máu của bạn có thể cứu sống tới 3 người. Mỗi lần hiến máu đều tạo ra 
              sự khác biệt đáng kể cho sức khỏe và ph福祉 của cộng đồng.
            </p>
            <ul className="text-sm text-life-800 space-y-1">
              <li>• Thông tin của bạn sẽ được bảo mật tuyệt đối</li>
              <li>• Sẽ có khám sàng lọc y tế trước khi hiến máu</li>
              <li>• Bạn có thể hủy hoặc đổi lịch hẹn bất cứ lúc nào</li>
              <li>• Chúng tôi sẽ chăm sóc và cung cấp đồ ăn nhẹ sau hiến máu</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTermsConsent = () => (
    <Card variant="default" padding="lg" className="animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-dark-900">Điều khoản & Đồng ý</h3>
          <p className="text-dark-600">Xác nhận thông tin và đồng ý các điều khoản</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Terms Checkboxes */}
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.acceptedTerms || false}
              onChange={(e) => updateFormData({ acceptedTerms: e.target.checked })}
              className="mt-1 w-5 h-5 text-blood-600 border-dark-300 rounded focus:ring-blood-500"
            />
            <div className="flex-1">
              <span className="text-dark-900 font-medium">
                Tôi đồng ý với <a href="/terms" className="text-blood-600 hover:underline">Điều khoản sử dụng</a> và 
                <a href="/privacy" className="text-blood-600 hover:underline ml-1">Chính sách bảo mật</a>
              </span>
              <p className="text-sm text-dark-600 mt-1">
                Bao gồm việc xử lý dữ liệu cá nhân và thông tin y tế
              </p>
            </div>
          </label>
          {errors.acceptedTerms && (
            <p className="text-sm text-red-600 ml-8">{errors.acceptedTerms}</p>
          )}

          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.consentToContact || false}
              onChange={(e) => updateFormData({ consentToContact: e.target.checked })}
              className="mt-1 w-5 h-5 text-blood-600 border-dark-300 rounded focus:ring-blood-500"
            />
            <div className="flex-1">
              <span className="text-dark-900 font-medium">
                Tôi đồng ý cho BloodConnect liên hệ khi cần thiết
              </span>
              <p className="text-sm text-dark-600 mt-1">
                Để thông báo về lịch hẹn, kết quả xét nghiệm và các thông tin quan trọng
              </p>
            </div>
          </label>
          {errors.consentToContact && (
            <p className="text-sm text-red-600 ml-8">{errors.consentToContact}</p>
          )}

          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.marketingConsent || false}
              onChange={(e) => updateFormData({ marketingConsent: e.target.checked })}
              className="mt-1 w-5 h-5 text-blood-600 border-dark-300 rounded focus:ring-blood-500"
            />
            <div className="flex-1">
              <span className="text-dark-900 font-medium">
                Tôi muốn nhận thông tin về các chương trình hiến máu (tùy chọn)
              </span>
              <p className="text-sm text-dark-600 mt-1">
                Nhận email về sự kiện, tin tức và cơ hội hiến máu mới
              </p>
            </div>
          </label>
        </div>

        {/* Important Notice */}
        <div className="p-6 bg-gradient-to-r from-emergency-50 to-emergency-100 rounded-xl border border-emergency-200">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-emergency-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emergency-900 mb-2">Lưu ý quan trọng</h4>
              <ul className="text-sm text-emergency-800 space-y-1">
                <li>• Vui lòng cung cấp thông tin chính xác để đảm bảo an toàn</li>
                <li>• Bạn sẽ được khám sàng lọc y tế trước khi hiến máu</li>
                <li>• Có quyền từ chối hiến máu nếu không đủ điều kiện sức khỏe</li>
                <li>• Liên hệ hotline 115 nếu có bất kỳ thắc mắc nào</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalInformation();
      case 2: return renderAddressContact();
      case 3: return renderMedicalHistory();
      case 4: return renderDonationPreferences();
      case 5: return renderTermsConsent();
      default: return null;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {renderStepIndicator()}
      
      <form onSubmit={handleSubmit}>
        {renderCurrentStep()}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            Quay lại
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              gradient
              onClick={handleNext}
              rightIcon={<ArrowRightIcon className="w-5 h-5" />}
            >
              Tiếp tục
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              gradient
              isLoading={isSubmitting}
              leftIcon={<HeartSolidIcon className="w-5 h-5" />}
            >
              Hoàn tất đăng ký
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DonationForm;