package com.swp391.bloodcare.dto.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountSearchDTO {
    private String accountId;
    private String username;
    private String email;
    private String name;
    private String phone;
    private boolean isActive;
    private LocalDate creationDate;
    private String roleName;
    private String hospitalName;
    private int numberOfBloodDonation;
}
