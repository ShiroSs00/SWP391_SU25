package com.swp391.bloodcare.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private String notificationId; // Có thể null khi tạo mới

    @NotNull(message = "Account ID không được để trống")
    private String accountId;

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 100, message = "Tiêu đề không được vượt quá 100 ký tự")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    @Size(max = 1000, message = "Nội dung không được vượt quá 1000 ký tự")
    private String content;

    @Size(max = 255, message = "Đường dẫn ảnh không được vượt quá 255 ký tự")
    private String img;

    private Date createDate = new Date();

}
