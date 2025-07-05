package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.NotificationDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Notification;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;

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
