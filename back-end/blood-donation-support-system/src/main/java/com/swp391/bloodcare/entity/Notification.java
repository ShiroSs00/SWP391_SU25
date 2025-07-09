package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @Column(name = "notification_id")
    private String notificationId;

    @ManyToOne
    @NotNull(message = "Account ID không được để trống")
    @JoinColumn(name = "account_id")
    private Account account;

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 100, message = "Tiêu đề không được vượt quá 100 ký tự")
    @Column(name = "title")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    @Size(max = 1000, message = "Nội dung không được vượt quá 1000 ký tự")
    @Column(name = "content")
    private String content;

    @Size(max = 255, message = "Đường dẫn ảnh không được vượt quá 255 ký tự")
    @Column(name = "img")
    private String img;

    @Column(name = "create_date")
    @NotNull
    private Date createDate;

    @Override
    public String toString() {
        return "Notification{" +
                "notificationId=" + notificationId +
                ", accountId=" + (account != null ? account.getAccountId() : "null") +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", img='" + img + '\'' +
                ", createDate=" + createDate +
                '}';
    }
}
