package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
