import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  Phone,
  Calendar,
  Droplet,
  Layers,
  CheckCircle,
  Heart,
} from "lucide-react";
import {
  validateAge,
  validateEmail,
  validatePhone,
  type ValidationError,
} from "../../utils/validateForm";
import { formatDateForInput } from "../../utils/formatDate.ts";
import { BLOOD_TYPES, BLOOD_COMPONENTS } from "../../utils/constants";
import "./BloodDonationForm.css";
import api from "../../api/api";
import axios from "axios";

const DonorRegisterForm: React.FC = () => {
  const isStaffOrAdmin = false; // Hardcode for demo, change to true to test staff/admin UI
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    bloodType: "",
    component: "",
    eventId: "",
    status: "pending",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.push({ field: "fullName", message: "Họ và tên là bắt buộc" });
    } else if (formData.fullName.trim().length < 2) {
      errors.push({ field: "fullName", message: "Họ và tên phải có ít nhất 2 ký tự" });
    }

    // Date of birth validation
    if (!formData.dob) {
      errors.push({ field: "dob", message: "Ngày sinh là bắt buộc" });
    } else {
      const ageValidation = validateAge(formData.dob);
      if (!ageValidation.isValid) {
        errors.push({
          field: "dob",
          message: "Tuổi phải từ 18 đến 65",
        });
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.push({ field: "email", message: "Email là bắt buộc" });
    } else if (!validateEmail(formData.email.trim())) {
      errors.push({ field: "email", message: "Email không hợp lệ" });
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.push({ field: "phone", message: "Số điện thoại là bắt buộc" });
    } else if (!validatePhone(formData.phone.trim())) {
      errors.push({ field: "phone", message: "Số điện thoại không hợp lệ" });
    }

    // Staff/Admin specific validations
    if (isStaffOrAdmin) {
      if (formData.bloodType && !BLOOD_TYPES.includes(formData.bloodType as any)) {
        errors.push({ field: 'bloodType', message: 'Nhóm máu không hợp lệ' });
      }
      if (formData.component && !BLOOD_COMPONENTS.includes(formData.component as any)) {
        errors.push({ field: 'component', message: 'Thành phần máu không hợp lệ' });
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors([]);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      // Format data according to API requirements
      const donationData = {
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        email: formData.email.trim().toLowerCase(), // Normalize email
        phone: formData.phone.trim(),
        bloodType: formData.bloodType || null,
        component: formData.component || null,
        eventId: formData.eventId.trim() || null,
        status: formData.status || "pending",
        // Add timestamp for registration
        dateCreated: new Date().toISOString(),
      };

      console.log('Submitting donation data:', donationData);

      // Updated endpoint to match your schema
      const response = await api.post("/donation-registration", donationData);

      if (response.data) {
        setSuccess(true);
        console.log('Registration successful:', response.data);
        
        // Reset form
        setFormData({
          fullName: "",
          dob: "",
          email: "",
          phone: "",
          bloodType: "",
          component: "",
          eventId: "",
          status: "pending",
        });

        // Redirect after showing success message
        setTimeout(() => {
          navigate("/");
        }, 3000); // Increased time to 3 seconds
      }
    } catch (err) {
      console.error('Submission error:', err);
      
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const errorData = err.response?.data;
        let errorMsg = "Có lỗi xảy ra khi đăng ký hiến máu";

        // Handle specific status codes
        switch (status) {
          case 400:
            errorMsg = errorData?.message || "Dữ liệu không hợp lệ";
            // Handle field-specific errors if provided by API
            if (errorData?.errors && Array.isArray(errorData.errors)) {
              setErrors(errorData.errors);
              return;
            }
            break;
          case 409:
            errorMsg = "Email hoặc số điện thoại đã được đăng ký";
            break;
          case 422:
            errorMsg = "Dữ liệu không đúng định dạng";
            break;
          case 500:
            errorMsg = "Lỗi máy chủ. Vui lòng thử lại sau";
            break;
          default:
            errorMsg = errorData?.message || errorMsg;
        }

        setErrors([{ field: "general", message: errorMsg }]);
      } else {
        // Handle network errors
        setErrors([
          {
            field: "general",
            message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!",
          },
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field === fieldName);
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
          <p className="donor-header-subtitle">
            Hành động của bạn có thể cứu sống nhiều người!
          </p>
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
            {getFieldError("general") && (
              <div className="donor-general-error">
                {getFieldError("general")?.message}
              </div>
            )}
            
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

            <form onSubmit={handleSubmit} className="donor-slide-in" noValidate>
              <div className="donor-form-section">
                <h3 className="donor-section-header">
                  <User className="h-5 w-5" /> Thông tin cá nhân
                </h3>
                <div className="donor-form-row">
                  <div className="donor-form-group">
                    <label className="donor-form-label" htmlFor="fullName">
                      <User className="h-5 w-5" /> Họ và tên *
                    </label>
                    <div className="donor-input-group donor-input-with-icon">
                      <User className="donor-input-icon h-5 w-5" />
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        className={`donor-form-input ${
                          getFieldError("fullName") ? "error" : ""
                        }`}
                        placeholder="Nhập họ và tên"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        aria-describedby="fullName-error"
                        autoComplete="name"
                      />
                    </div>
                    {getFieldError("fullName") && (
                      <p id="fullName-error" className="donor-form-error">
                        {getFieldError("fullName")?.message}
                      </p>
                    )}
                  </div>

                  <div className="donor-form-group">
                    <label className="donor-form-label" htmlFor="dob">
                      <Calendar className="h-5 w-5" /> Ngày sinh *
                    </label>
                    <div className="donor-input-group donor-input-with-icon">
                      <Calendar className="donor-input-icon h-5 w-5" />
                      <input
                        id="dob"
                        type="date"
                        name="dob"
                        className={`donor-form-input ${
                          getFieldError("dob") ? "error" : ""
                        }`}
                        value={formData.dob}
                        onChange={handleChange}
                        max={formatDateForInput(new Date())}
                        required
                        aria-describedby="dob-error"
                        autoComplete="bday"
                      />
                    </div>
                    {getFieldError("dob") && (
                      <p id="dob-error" className="donor-form-error">
                        {getFieldError("dob")?.message}
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
                    <label className="donor-form-label" htmlFor="email">
                      <Mail className="h-5 w-5" /> Email *
                    </label>
                    <div className="donor-input-group donor-input-with-icon">
                      <Mail className="donor-input-icon h-5 w-5" />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        className={`donor-form-input ${
                          getFieldError("email") ? "error" : ""
                        }`}
                        placeholder="Nhập email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-describedby="email-error"
                        autoComplete="email"
                      />
                    </div>
                    {getFieldError("email") && (
                      <p id="email-error" className="donor-form-error">
                        {getFieldError("email")?.message}
                      </p>
                    )}
                  </div>

                  <div className="donor-form-group">
                    <label className="donor-form-label" htmlFor="phone">
                      <Phone className="h-5 w-5" /> Số điện thoại *
                    </label>
                    <div className="donor-input-group donor-input-with-icon">
                      <Phone className="donor-input-icon h-5 w-5" />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        className={`donor-form-input ${
                          getFieldError("phone") ? "error" : ""
                        }`}
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        aria-describedby="phone-error"
                        autoComplete="tel"
                      />
                    </div>
                    {getFieldError("phone") && (
                      <p id="phone-error" className="donor-form-error">
                        {getFieldError("phone")?.message}
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
                            className={`donor-blood-type-option ${
                              formData.bloodType === type ? "selected" : ""
                            }`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                bloodType: prev.bloodType === type ? "" : type,
                              }))
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setFormData((prev) => ({
                                  ...prev,
                                  bloodType: prev.bloodType === type ? "" : type,
                                }));
                              }
                            }}
                            aria-label={`Chọn nhóm máu ${type}`}
                          >
                            <Droplet className="h-5 w-5" />
                            <span>{type}</span>
                          </div>
                        ))}
                      </div>
                      {getFieldError("bloodType") && (
                        <p className="donor-form-error">
                          {getFieldError("bloodType")?.message}
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
                          className={`donor-component-option ${
                            formData.component === comp ? "selected" : ""
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              component: prev.component === comp ? "" : comp,
                            }))
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                component: prev.component === comp ? "" : comp,
                              }));
                            }
                          }}
                          aria-label={`Chọn thành phần máu ${comp}`}
                        >
                          <Layers className="h-5 w-5" />
                          <span>
                            {comp
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                    {getFieldError("component") && (
                      <p className="donor-form-error">
                        {getFieldError("component")?.message}
                      </p>
                    )}
                  </div>

                  <div className="donor-form-group">
                    <label className="donor-form-label">
                      <CheckCircle className="h-5 w-5" /> Trạng thái đăng ký
                    </label>
                    <div className="donor-status-toggle">
                      {["pending", "approved", "rejected"].map((status) => (
                        <div
                          key={status}
                          className={`donor-status-option ${status} ${
                            formData.status === status ? "selected" : ""
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, status }))
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setFormData((prev) => ({ ...prev, status }));
                            }
                          }}
                          aria-label={`Chọn trạng thái ${status}`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            {status === "pending"
                              ? "Chờ duyệt"
                              : status === "approved"
                              ? "Đã duyệt"
                              : "Từ chối"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="donor-form-group">
                <label className="donor-form-label" htmlFor="eventId">
                  <Calendar className="h-5 w-5" /> Mã sự kiện (tùy chọn)
                </label>
                <input
                  id="eventId"
                  type="text"
                  name="eventId"
                  className="donor-form-input"
                  placeholder="Nhập mã sự kiện"
                  value={formData.eventId}
                  onChange={handleChange}
                  aria-describedby="eventId-info"
                />
                <p id="eventId-info" className="donor-field-info">
                  Mã sự kiện là tùy chọn và chỉ cần thiết nếu bạn đang tham gia
                  một sự kiện hiến máu cụ thể.
                </p>
              </div>

              <div className="donor-form-actions">
                <button
                  type="submit"
                  className={`donor-submit-btn ${
                    isSubmitting ? "loading" : ""
                  }`}
                  disabled={isSubmitting}
                  aria-label="Đăng ký hiến máu"
                >
                  {isSubmitting ? (
                    <>
                      <span className="donor-spinner" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      Đăng ký ngay
                    </>
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