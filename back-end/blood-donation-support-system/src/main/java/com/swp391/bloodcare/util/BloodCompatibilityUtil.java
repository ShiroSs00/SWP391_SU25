package com.swp391.bloodcare.util;

import com.swp391.bloodcare.entity.Blood;

import java.util.*;

public class BloodCompatibilityUtil{

    private static final Map<String, List<String>> bloodTypeCompatibility = new HashMap<>();
    private static final Map<String, List<String>> componentCompatibility = new HashMap<>();

    static {
        // Nhóm máu tương thích
        bloodTypeCompatibility.put("O-", List.of("O-"));
        bloodTypeCompatibility.put("O+", List.of("O-", "O+"));
        bloodTypeCompatibility.put("A-", List.of("O-", "A-"));
        bloodTypeCompatibility.put("A+", List.of("O-", "O+", "A-", "A+"));
        bloodTypeCompatibility.put("B-", List.of("O-", "B-"));
        bloodTypeCompatibility.put("B+", List.of("O-", "O+", "B-", "B+"));
        bloodTypeCompatibility.put("AB-", List.of("O-", "A-", "B-", "AB-"));
        bloodTypeCompatibility.put("AB+", List.of("O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"));

        // Tương thích component
        componentCompatibility.put("Whole", List.of("Whole"));
        componentCompatibility.put("Plasma", List.of("Plasma", "Whole"));
        componentCompatibility.put("Platelet", List.of("Platelet", "Whole"));
        componentCompatibility.put("Red Cells", List.of("Red Cells", "Whole"));
    }

    public static boolean isCompatible(Blood receiver, Blood donor) {
        String receiverBloodType = receiver.getBloodType().name() + (receiver.getRh() == Blood.RhFactor.POSITIVE ? "+" : "-");
        String donorBloodType = donor.getBloodType().name() + (donor.getRh() == Blood.RhFactor.POSITIVE ? "+" : "-");

        boolean bloodCompatible = bloodTypeCompatibility.getOrDefault(receiverBloodType, List.of()).contains(donorBloodType);

        String receiverComponent = receiver.getComponent() != null ? receiver.getComponent().getComponent() : null;
        String donorComponent = donor.getComponent() != null ? donor.getComponent().getComponent() : null;

        boolean componentCompatible = true; // Nếu không có component thì bỏ qua
        if (receiverComponent != null && donorComponent != null) {
            componentCompatible = componentCompatibility.getOrDefault(receiverComponent, List.of()).contains(donorComponent);
        }

        return bloodCompatible && componentCompatible;
    }

    public static List<String> getCompatibleDonorBloodTypes(String receiverBloodType) {
        return bloodTypeCompatibility.getOrDefault(receiverBloodType, List.of());
    }

    public static List<String> getCompatibleDonorComponents(String receiverComponent) {
        return componentCompatibility.getOrDefault(receiverComponent, List.of());
    }
}
