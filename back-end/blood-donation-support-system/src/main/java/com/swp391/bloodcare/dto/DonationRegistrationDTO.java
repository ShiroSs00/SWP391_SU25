package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.DonationRegistration;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationRegistrationDTO {
    private String registrationId;
    private Date dateCreated;
    private String status;

    private String eventId;
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
