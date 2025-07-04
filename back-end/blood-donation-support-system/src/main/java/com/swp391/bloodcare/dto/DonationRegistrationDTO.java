package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.DonationRegistration;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationRegistrationDTO {

    @NotBlank(message = "Mã đơn đăng ký không được để trống")
    private String registrationId;

    @NotNull(message = "Ngày tạo không được để trống")
    private Date dateCreated;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    @NotNull(message = "Ngày hiến máu không được để trống")
    @PastOrPresent(message = "Ngày hiến máu không được lớn hơn ngày hiện tại")
    private LocalDate donationDate;


    private String eventId;

    @NotBlank(message = "Tài khoản không được để trống")
    private String accountId;

    private String componentId;

    private String healthCheckId;

    private String donorFeedbackId;

    public static DonationRegistrationDTO toDTO(DonationRegistration reg) {
        return DonationRegistrationDTO.builder()
                .registrationId(reg.getRegistrationId())
                .dateCreated(reg.getDateCreated())
                .status(reg.getStatus())
                .eventId(reg.getEvent() != null ? reg.getEvent().getEventId() : null)
                .accountId(reg.getAccount() != null ? reg.getAccount().getAccountId() : null)
                .componentId(reg.getComponent() != null ? reg.getComponent().getComponent() : null)
                .healthCheckId(reg.getHealthCheck() != null ? reg.getHealthCheck().getHealthCheckId() : null)
                .donorFeedbackId(reg.getDonorFeedback() != null ? reg.getDonorFeedback().getFeedbackID() : null)
                .build();
    }
}

