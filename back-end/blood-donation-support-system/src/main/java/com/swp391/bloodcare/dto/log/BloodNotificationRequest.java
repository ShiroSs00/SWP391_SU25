package com.swp391.bloodcare.dto.log;

import lombok.Data;
import java.util.List;

@Data
public class BloodNotificationRequest {
    private String district;
    private List<String> bloodGroups;
    private String subject;
    private String content;
}