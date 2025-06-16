package com.swp391.superapp.bloodsupport.DTO.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Date;

public class AccountRegistration {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 5, max = 20, message = "Username phải từ 5-20 ký tự")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hơp lệ")
    private String email;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 8, message = "pas")
    private String password;

    @NotBlank(message = "")
    private String name;

    @NotBlank(message = "")
    private String phone;

    @NotBlank(message = "")
    private Date dob;

    @NotBlank(message = "")
    private boolean gender;

    @NotBlank(message = "")
    private String city;

    @NotBlank(message = "")
    private String district;

    @NotBlank(message = "")
    private String ward;

    @NotBlank(message = "")
    private String address;
}
