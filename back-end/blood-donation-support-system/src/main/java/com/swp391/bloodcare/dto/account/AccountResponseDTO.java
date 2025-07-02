package com.swp391.bloodcare.dto.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponseDTO {
    private String accountId;
    private String userName;
    private String email;
    private String password;
    private String role;
    private String profileId;
    private LocalDate creationDate;
}
