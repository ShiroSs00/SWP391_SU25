package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "account")
@Data // => tự sinh getter/setter/toString/hashCode/equals
@NoArgsConstructor
@AllArgsConstructor
@Builder // để dùng Account.builder() khi tạo object
public class Account {

    @Id
    @Column(name = "id")
    private String accountId;

    @Column(name = "username", unique = true, nullable = false)
    @NotBlank(message = "Tên người dùng không được để trống")
    @Size(min = 4, max = 50, message = "Tên người dùng phải từ 4 đến 50 ký tự")
    private String userName;

    @Column(name = "email", unique = true, nullable = false)
    @Email(message = "Email không đúng định dạng")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$",
            message = "Email không hợp lệ. Ví dụ: example@gmail.com"
    )
    @NotBlank(message = "Email không được để trống")
    private String email;

    @Column(name = "password")
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String password;

    @Column(name = "is_active")
    @NotNull(message = "Trạng thái hoạt động không được để trống")
    private Boolean isActive;

    @Column(name = "creation_date")
    @NotNull(message = "Ngày tạo không được để trống")
    private LocalDate creationDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_name")
    @NotNull(message = "Quyền tài khoản không được để trống")
    private Role role;

    @OneToMany(mappedBy = "account")
    private List<BloodRequest> bloodRequests;

    @OneToMany(mappedBy = "account")
    private List<Blog> blogs;

    @OneToMany(mappedBy = "account")
    private List<DonationRegistration> donationRegistrations;

    @OneToOne
    private BloodDonationHistory bloodDonationHistory;

    @OneToMany(mappedBy = "account")
    private List<Notification> notifications;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    private Profile profile;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BloodDonationEvent> events;

    @PrePersist
    public void prePersist() {
        if (creationDate == null) {
            creationDate = LocalDate.now();
        }
    }

}
