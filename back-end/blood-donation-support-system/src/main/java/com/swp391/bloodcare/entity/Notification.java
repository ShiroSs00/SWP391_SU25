package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import lombok.*;

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
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "img")
    private String img;

    @Override
    public String toString() {
        return "Notification{" +
                "notificationId=" + notificationId +
                ", accountId=" + (account != null ? account.getAccountId() : "null") +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", img='" + img + '\'' +
                '}';
    }
}
