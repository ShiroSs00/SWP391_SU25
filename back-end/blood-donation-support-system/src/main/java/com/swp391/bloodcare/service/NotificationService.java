package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Notification;
import com.swp391.bloodcare.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void sendNotificationToAccount(Account account, String title, String content, String img) {
        Notification noti = createNotification(account, title, content, img);
        notificationRepository.save(noti);
    }

    public void sendNotificationsToAccounts(List<Account> accounts, String title, String content, String img) {
        for (Account account : accounts) {
            notificationRepository.save(createNotification(account, title, content, img));
        }
    }

    private Notification createNotification(Account account, String title, String content, String img) {
        return Notification.builder()
                .notificationId(generateNotificationId())
                .account(account)
                .title(title)
                .content(content)
                .img(img)
                .build();
    }

    private String generateNotificationId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int randomNum = new Random().nextInt(900) + 100;
        return "NT-" + timestamp + "-" + randomNum;
    }
}


