package com.swp391.bloodcare.dto.account;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePassDTO {
    @NotBlank(message = "Mật khẩu cũ không được để trống")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu mới không được để trống")
    private String confirmPassword;

}
