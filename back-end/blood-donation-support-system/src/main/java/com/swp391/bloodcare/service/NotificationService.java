package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.NotificationDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.Notification;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.DonationRegistrationRepository;
import com.swp391.bloodcare.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;
    private final DonationRegistrationRepository donationRegistrationRepository;

    public void sendNotification(NotificationDTO dto) {
        Account account = getAccountOrThrow(dto.getAccountId());
        Notification notification = toEntity(dto, account);
        notificationRepository.save(notification);
    }

    public int sendNotifications(List<NotificationDTO> dtoList) {
        if (dtoList.isEmpty()) return 0;

        List<String> accountIds = dtoList.stream()
                .map(NotificationDTO::getAccountId)
                .distinct()
                .collect(Collectors.toList());

        Map<String, Account> accountMap = accountRepository.findAllById(accountIds).stream()
                .collect(Collectors.toMap(Account::getAccountId, a -> a));

        List<Notification> notifications = dtoList.stream()
                .map(dto -> {
                    Account acc = accountMap.get(dto.getAccountId());
                    return acc != null ? toEntity(dto, acc) : null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        notificationRepository.saveAll(notifications);
        return notifications.size();
    }

    public void sendSystemNotification(String accountId, String title, String content) {
        Account account = getAccountOrThrow(accountId);
        Notification notification = Notification.builder()
                .notificationId(generateNotificationId())
                .account(account)
                .title(title)
                .content(content)
                .img(null)
                .createDate(new Date())
                .build();

        notificationRepository.save(notification);
    }

    public void notifyAchievementUnlocked(String accountId, String achievementName) {
        String title = "🎉 Chúc mừng bạn!";
        String content = "Bạn vừa đạt được thành tựu: " + achievementName + ". Hãy tiếp tục cố gắng nhé!";
        sendSystemNotification(accountId, title, content);
    }



    @Scheduled(cron = "0 0 8 * * ?") // 8h sáng mỗi ngày
    public void sendVaccinationReminders() {
        LocalDate today = LocalDate.now();

        List<DonationRegistration> todayRegistrations = donationRegistrationRepository.findByDonationDate(today);

        for (DonationRegistration reg : todayRegistrations) {
            Account acc = reg.getAccount();
            if (acc != null) {
                sendSystemNotification(
                        acc.getAccountId(),
                        "📅 Nhắc lịch hiến máu",
                        "Bạn có lịch hiến máu hôm nay (" + today.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "). Hãy đến đúng giờ nhé!"
                );
            }
        }
    }



    public List<NotificationDTO> getNotificationsByAccount(String accountId) {
        Account account = getAccountOrThrow(accountId);
        return account.getNotifications().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ======== Support methods ========

    private Account getAccountOrThrow(String accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy account: " + accountId));
    }

    private Notification toEntity(NotificationDTO dto, Account account) {
        return Notification.builder()
                .notificationId(dto.getNotificationId() != null ? dto.getNotificationId() : generateNotificationId())
                .account(account)
                .title(dto.getTitle())
                .content(dto.getContent())
                .img(dto.getImg())
                .createDate(dto.getCreateDate() != null ? dto.getCreateDate() : new Date())
                .build();
    }

    private NotificationDTO toDTO(Notification entity) {
        return NotificationDTO.builder()
                .notificationId(entity.getNotificationId())
                .accountId(entity.getAccount().getAccountId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .img(entity.getImg())
                .createDate(entity.getCreateDate())
                .build();
    }

    private String generateNotificationId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int randomNum = new Random().nextInt(900) + 100;
        return "NT-" + timestamp + "-" + randomNum;
    }
}
