package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
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
    private String userName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_name")
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
}
