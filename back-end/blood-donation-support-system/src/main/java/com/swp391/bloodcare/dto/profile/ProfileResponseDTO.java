package com.swp391.bloodcare.dto.profile;

import com.swp391.bloodcare.dto.AddressDTO;
import com.swp391.bloodcare.entity.Blood;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponseDTO {
    private int profileId;
    private String accountId;
    private String username;
    private String email;
    private String name;
    private String phone;
    private Date dob;
    private boolean gender;
    private AddressDTO address;
    private int numberOfBloodDonation;
    private Blood bloodType; //chưa ổn
    private String achievementName;
    private LocalDate restDate;
    private LocalDate creationDate;
    private boolean isActive;
}
