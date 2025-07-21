package com.swp391.bloodcare.dto.log;


import com.swp391.bloodcare.dto.AddressDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleAccountCompletionDTO {
    private String password;
    private String name;
    private String phone;
    private Date dob;
    private boolean gender;

    private AddressDTO address;
}
