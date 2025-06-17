package com.swp391.bloodcare.dto.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountRegistrationResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
