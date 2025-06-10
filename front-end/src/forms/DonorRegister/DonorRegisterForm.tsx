import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Phone, Calendar, Droplet, Layers, CheckCircle, Heart } from 'lucide-react';
import { validateAge, validateEmail, validatePhone, type ValidationError } from '../../utils/validateForm';
import { formatDateForInput } from '../../utils/formatDate.ts';
import { BLOOD_TYPES, BLOOD_COMPONENTS } from '../../utils/constants';
import './BloodDonationForm.css';

const DonorRegisterForm: React.FC = () => {
  const isStaffOrAdmin = false; // Hardcode for demo, change to true to test staff/admin UI
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    bloodType: '',
    component: '',
    eventId: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.fullName.trim()) {
      errors.push({ field: 'fullName', message: 'Họ và tên là bắt buộc' });
    }

    if (!formData.dob) {
      errors.push({ field: 'dob', message: 'Ngày sinh là bắt buộc' });
    } else {
      const ageValidation = validateAge(formData.dob);
      if (!ageValidation.isValid) {
        errors.push({
          field: 'dob',
          message: 'Tuổi phải từ 18 đến 65',
        });
      }
    }

    if (!formData.email) {
      errors.push({ field: 'email', message: 'Email là bắt buộc' });
    } else if (!validateEmail(formData.email)) {
      errors.push({ field: 'email', message: 'Email không hợp lệ' });
    }

    if (!formData.phone) {
      errors.push({ field: 'phone', message: 'Số điện thoại là bắt buộc' });
    } else if (!validatePhone(formData.phone)) {
      errors.push({ field: 'phone', message: 'Số điện thoại không hợp lệ' });
    }
    //
    // if (isStaffOrAdmin && formData.bloodType && !BLOOD_TYPES.includes(formData.bloodType)) {
    //   errors.push({ field: 'bloodType', message: 'Nhóm máu không hợp lệ' });
    // }
    // if (isStaffOrAdmin && formData.component && !BLOOD_COMPONENTS.includes(formData.component)) {
    //   errors.push({ field: 'component', message: 'Thành phần máu không hợp lệ' });
    // }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setSuccess(true);
        setIsSubmitting(false);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }, 1000);
    }
  };

  return (
      <div className="donor-register-container">
        <div className="donor-background-hearts">
          <Heart className="donor-heart left" />
          <Heart className="donor-heart right" />
        </div>
        <div className="donor-form-header">
          <div className="donor-header-background">
            <div className="donor-header-pattern" />
          </div>
          <div className="donor-header-content">
            <div className="donor-header-icon">
              <Droplet className="h-8 w-8" />
            </div>
            <h2 className="donor-header-title">Đăng ký hiến máu</h2>
            <p className="donor-header-subtitle">Hành động của bạn có thể cứu sống nhiều người!</p>
          </div>
        </div>

        <div className="donor-form">
          {success ? (
              <div className="donor-success-animation">
                <CheckCircle className="donor-success-icon h-16 w-16 text-green-500 mx-auto" />
                <h3 className="donor-success-title">Đăng ký thành công!</h3>
                <p className="donor-success-message">
                  Cảm ơn bạn đã đăng ký hiến máu. Chúng tôi sẽ liên hệ với bạn sớm.
                  Đang chuyển về trang chủ...
                </p>
              </div>
          ) : (
              <>
                <div className="donor-requirements-info">
                  <h3 className="donor-requirements-title">
                    <CheckCircle className="h-5 w-5" /> Yêu cầu hiến máu
                  </h3>
                  <ul className="donor-requirements-list">
                    <li>Tuổi từ 18 đến 65</li>
                    <li>Cân nặng trên 45kg</li>
                    <li>Không mắc các bệnh truyền nhiễm</li>
                    <li>Không sử dụng ma túy hoặc chất kích thích</li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="donor-slide-in">
                  <div className="donor-form-section">
                    <h3 className="donor-section-header">
                      <User className="h-5 w-5" /> Thông tin cá nhân
                    </h3>
                    <div className="donor-form-row">
                      <div className="donor-form-group">
                        <label className="donor-form-label">
                          <User className="h-5 w-5" /> Họ và tên
                        </label>
                        <div className="donor-input-group donor-input-with-icon">
                          <User className="donor-input-icon h-5 w-5" />
                          <input
                              type="text"
                              name="fullName"
                              className={`donor-form-input ${errors.find((e) => e.field === 'fullName') ? 'error' : ''}`}
                              placeholder="Nhập họ và tên"
                              value={formData.fullName}
                              onChange={handleChange}
                              required
                              aria-describedby="fullName-error"
                          />
                        </div>
                        {errors.find((e) => e.field === 'fullName') && (
                            <p id="fullName-error" className="donor-form-error">
                              {errors.find((e) => e.field === 'fullName')?.message}
                            </p>
                        )}
                      </div>

                      <div className="donor-form-group">
                        <label className="donor-form-label">
                          <Calendar className="h-5 w-5" /> Ngày sinh
                        </label>
                        <div className="donor-input-group donor-input-with-icon">
                          <Calendar className="donor-input-icon h-5 w-5" />
                          <input
                              type="date"
                              name="dob"
                              className={`donor-form-input ${errors.find((e) => e.field === 'dob') ? 'error' : ''}`}
                              value={formData.dob}
                              onChange={handleChange}
                              max={formatDateForInput(new Date())}
                              required
                              aria-describedby="dob-error"
                          />
                        </div>
                        {errors.find((e) => e.field === 'dob') && (
                            <p id="dob-error" className="donor-form-error">
                              {errors.find((e) => e.field === 'dob')?.message}
                            </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="donor-form-section">
                    <h3 className="donor-section-header">
                      <Mail className="h-5 w-5" /> Thông tin liên hệ
                    </h3>
                    <div className="donor-form-row">
                      <div className="donor-form-group">
                        <label className="donor-form-label">
                          <Mail className="h-5 w-5" /> Email
                        </label>
                        <div className="donor-input-group donor-input-with-icon">
                          <Mail className="donor-input-icon h-5 w-5" />
                          <input
                              type="email"
                              name="email"
                              className={`donor-form-input ${errors.find((e) => e.field === 'email') ? 'error' : ''}`}
                              placeholder="Nhập email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              aria-describedby="email-error"
                          />
                        </div>
                        {errors.find((e) => e.field === 'email') && (
                            <p id="email-error" className="donor-form-error">
                              {errors.find((e) => e.field === 'email')?.message}
                            </p>
                        )}
                      </div>

                      <div className="donor-form-group">
                        <label className="donor-form-label">
                          <Phone className="h-5 w-5" /> Số điện thoại
                        </label>
                        <div className="donor-input-group donor-input-with-icon">
                          <Phone className="donor-input-icon h-5 w-5" />
                          <input
                              type="tel"
                              name="phone"
                              className={`donor-form-input ${errors.find((e) => e.field === 'phone') ? 'error' : ''}`}
                              placeholder="Nhập số điện thoại"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              aria-describedby="phone-error"
                          />
                        </div>
                        {errors.find((e) => e.field === 'phone') && (
                            <p id="phone-error" className="donor-form-error">
                              {errors.find((e) => e.field === 'phone')?.message}
                            </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {isStaffOrAdmin && (
                      <div className="donor-staff-section">
                        <h3 className="donor-section-header">
                          <Droplet className="h-5 w-5" /> Thông tin y tế
                        </h3>
                        <div className="donor-form-row">
                          <div className="donor-form-group">
                            <label className="donor-form-label">
                              <Droplet className="h-5 w-5" /> Nhóm máu
                            </label>
                            <div className="donor-blood-type-grid">
                              {BLOOD_TYPES.map((type) => (
                                  <div
                                      key={type}
                                      className={`donor-blood-type-option ${formData.bloodType === type ? 'selected' : ''}`}
                                      onClick={() => setFormData((prev) => ({ ...prev, bloodType: type }))}
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          setFormData((prev) => ({ ...prev, bloodType: type }));
                                        }
                                      }}
                                      aria-label={`Chọn nhóm máu ${type}`}
                                  >
                                    <Droplet className="h-5 w-5" />
                                    <span>{type}</span>
                                  </div>
                              ))}
                            </div>
                            {errors.find((e) => e.field === 'bloodType') && (
                                <p className="donor-form-error">
                                  {errors.find((e) => e.field === 'bloodType')?.message}
                                </p>
                            )}
                          </div>
                        </div>

                        <div className="donor-form-group">
                          <label className="donor-form-label">
                            <Layers className="h-5 w-5" /> Thành phần máu hiến
                          </label>
                          <div className="donor-component-grid">
                            {BLOOD_COMPONENTS.map((comp) => (
                                <div
                                    key={comp}
                                    className={`donor-component-option ${formData.component === comp ? 'selected' : ''}`}
                                    onClick={() => setFormData((prev) => ({ ...prev, component: comp }))}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        setFormData((prev) => ({ ...prev, component: comp }));
                                      }
                                    }}
                                    aria-label={`Chọn thành phần máu ${comp}`}
                                >
                                  <Layers className="h-5 w-5" />
                                  <span>{comp.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                                </div>
                            ))}
                          </div>
                          {errors.find((e) => e.field === 'component') && (
                              <p className="donor-form-error">
                                {errors.find((e) => e.field === 'component')?.message}
                              </p>
                          )}
                        </div>

                        <div className="donor-form-group">
                          <label className="donor-form-label">
                            <CheckCircle className="h-5 w-5" /> Trạng thái đăng ký
                          </label>
                          <div className="donor-status-toggle">
                            {['pending', 'approved', 'rejected'].map((status) => (
                                <div
                                    key={status}
                                    className={`donor-status-option ${status} ${formData.status === status ? 'selected' : ''}`}
                                    onClick={() => setFormData((prev) => ({ ...prev, status }))}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        setFormData((prev) => ({ ...prev, status }));
                                      }
                                    }}
                                    aria-label={`Chọn trạng thái ${status}`}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span>
                            {status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                          </span>
                                </div>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  <div className="donor-form-group">
                    <label className="donor-form-label">
                      <span className="h-5 w-5" /> Mã sự kiện (nếu có)
                    </label>
                    <input
                        type="text"
                        name="eventId"
                        className="donor-form-input"
                        placeholder="Nhập mã sự kiện"
                        value={formData.eventId}
                        onChange={handleChange}
                        aria-describedby="eventId-info"
                    />
                    <p id="eventId-info" className="donor-sr-only">
                      Mã sự kiện là tùy chọn và chỉ cần thiết nếu bạn đang tham gia một sự kiện hiến máu cụ thể.
                    </p>
                  </div>

                  <div className="donor-form-actions">
                    <button
                        type="submit"
                        className={`donor-submit-btn ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                        aria-label="Đăng ký hiến máu"
                    >
                      {isSubmitting ? (
                          <>
                            <span className="donor-spinner" />
                            Đang xử lý...
                          </>
                      ) : (
                          'Đăng ký ngay'
                      )}
                    </button>
                  </div>
                </form>
              </>
          )}
        </div>
      </div>
  );
};

export default DonorRegisterForm;