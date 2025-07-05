package com.swp391.bloodcare.dto.account;

import com.swp391.bloodcare.dto.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountRegistrationDTO {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 5, max = 20, message = "Username phải từ 5-20 ký tự")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hơp lệ")
    private String email;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String password;

    @NotBlank(message = "Role không được để trống")
    private String roleName;

    @NotBlank(message = "Tên không được để trống")
    private String name;

    @Pattern(regexp = "^(0[0-9]{9,10})$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @NotNull(message = "Ngày sinh không được bỏ trống")
    private Date dob;

    @NotNull(message = "Giới tính không được bỏ trống")
    private boolean gender;


    @Valid
    @NotNull(message = "Địa chỉ không được để trống")
    private AddressDTO address;

    


}
