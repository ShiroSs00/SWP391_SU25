package com.swp391.bloodcare.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BloodCompatibilityService {

    private static final Map<String, BloodCompatibilityInfo> BLOOD_COMPATIBILITY_MATRIX = new HashMap<>();
    static {
        // O- - Universal donor
        BLOOD_COMPATIBILITY_MATRIX.put("O-", new BloodCompatibilityInfo(
                Arrays.asList("O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"),
                Arrays.asList("O-"),
                "Người hiến máu toàn năng"
        ));

        // O+
        BLOOD_COMPATIBILITY_MATRIX.put("O+", new BloodCompatibilityInfo(
                Arrays.asList("O+", "A+", "B+", "AB+"),
                Arrays.asList("O+", "O-"),
                "Có thể hiến cho các nhóm máu Rh+"
        ));

        // A-
        BLOOD_COMPATIBILITY_MATRIX.put("A-", new BloodCompatibilityInfo(
                Arrays.asList("A+", "A-", "AB+", "AB-"),
                Arrays.asList("A-", "O-"),
                "Có thể hiến cho nhóm máu A và AB"
        ));

        // A+
        BLOOD_COMPATIBILITY_MATRIX.put("A+", new BloodCompatibilityInfo(
                Arrays.asList("A+", "AB+"),
                Arrays.asList("A+", "A-", "O+", "O-"),
                "Có thể hiến cho nhóm máu A+ và AB+"
        ));

        // B-
        BLOOD_COMPATIBILITY_MATRIX.put("B-", new BloodCompatibilityInfo(
                Arrays.asList("B+", "B-", "AB+", "AB-"),
                Arrays.asList("B-", "O-"),
                "Có thể hiến cho nhóm máu B và AB"
        ));

        // B+
        BLOOD_COMPATIBILITY_MATRIX.put("B+", new BloodCompatibilityInfo(
                Arrays.asList("B+", "AB+"),
                Arrays.asList("B+", "B-", "O+", "O-"),
                "Có thể hiến cho nhóm máu B+ và AB+"
        ));

        // AB-
        BLOOD_COMPATIBILITY_MATRIX.put("AB-", new BloodCompatibilityInfo(
                Arrays.asList("AB+", "AB-"),
                Arrays.asList("AB-", "A-", "B-", "O-"),
                "Có thể hiến cho nhóm máu AB"
        ));

        // AB+ - Universal recipient
        BLOOD_COMPATIBILITY_MATRIX.put("AB+", new BloodCompatibilityInfo(
                Arrays.asList("AB+"),
                Arrays.asList("AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"),
                "Người nhận máu toàn năng"
        ));
    }

    public boolean isCompatible(String donorBloodType, String recipientBloodType) {
        BloodCompatibilityInfo info = BLOOD_COMPATIBILITY_MATRIX.get(donorBloodType);
        return info != null && info.getCanDonateTo().contains(recipientBloodType);
    }

    public List<String> getCompatibleDonors(String recipientBloodType) {
        return BLOOD_COMPATIBILITY_MATRIX.entrySet().stream()
                .filter(entry -> entry.getValue().getCanDonateTo().contains(recipientBloodType))
                .map(Map.Entry::getKey)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    public List<String> getCompatibleRecipients(String donorBloodType) {
        BloodCompatibilityInfo info = BLOOD_COMPATIBILITY_MATRIX.get(donorBloodType);
        return info != null ? new ArrayList<>(info.getCanDonateTo()) : new ArrayList<>();
    }

    public String getBloodTypeDescription(String bloodType) {
        BloodCompatibilityInfo info = BLOOD_COMPATIBILITY_MATRIX.get(bloodType);
        return info != null ? info.getDescription() : "Không có thông tin";
    }

    private static class BloodCompatibilityInfo {
        private final List<String> canDonateTo;
        private final List<String> canReceiveFrom;
        private final String description;

        public BloodCompatibilityInfo(List<String> canDonateTo, List<String> canReceiveFrom, String description) {
            this.canDonateTo = canDonateTo;
            this.canReceiveFrom = canReceiveFrom;
            this.description = description;
        }

        public List<String> getCanDonateTo() { return canDonateTo; }
        public List<String> getCanReceiveFrom() { return canReceiveFrom; }
        public String getDescription() { return description; }
    }
}
