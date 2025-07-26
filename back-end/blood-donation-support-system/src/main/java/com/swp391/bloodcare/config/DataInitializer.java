package com.swp391.bloodcare.config;

import com.swp391.bloodcare.entity.*;

import com.swp391.bloodcare.repository.*;
import com.swp391.bloodcare.service.BloodCompatibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@org.springframework.stereotype.Component
@RequiredArgsConstructor
public class DataInitializer {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;

    private final ComponentRepository componentRepository;
    private final BloodRepository bloodRepository;
    private final BloodCompatibilityService bloodCompatibilityService;

    private final PasswordEncoder passwordEncoder;

    private final AchievementRepository achievementRepository;


    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        // Tạo role ADMIN nếu chưa có
        if (!roleRepository.existsById("ADMIN")) {
            Role adminRole = new Role();
            adminRole.setRole("ADMIN");
            adminRole.setDescription("System Administrator");
            roleRepository.save(adminRole);
        }

        // Tạo role STAFF nếu chưa có
        if (!roleRepository.existsById("STAFF")) {
            Role staffRole = new Role();
            staffRole.setRole("STAFF");
            staffRole.setDescription("Hospital Staff");
            roleRepository.save(staffRole);
        }

        // Tạo tài khoản admin nếu chưa tồn tại
        if (!accountRepository.existsByUserNameIgnoreCase("admin")) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = ThreadLocalRandom.current().nextInt(1000);
            String randomPart = String.format("%03d", randomCode);
            String accountId = "AC-" + timestamp + "-" + randomPart;

            Account admin = new Account();
            admin.setAccountId(accountId);
            admin.setUserName("admin");
            admin.setPassword(passwordEncoder.encode("12345678"));
            admin.setEmail("admin@system.local");
            admin.setIsActive(true);
            Role role = roleRepository.findById("ADMIN").orElseThrow();
            admin.setRole(role);
            accountRepository.save(admin);
            System.out.println("Admin account created: admin / 12345678");
        } else {
            System.out.println("Admin account already exists.");
        }

        // Tạo tài khoản staff nếu chưa tồn tại
        if (!accountRepository.existsByUserNameIgnoreCase("staff")) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = ThreadLocalRandom.current().nextInt(1000);
            String randomPart = String.format("%03d", randomCode);
            String accountId = "AC-" + timestamp + "-" + randomPart;

            Account staff = new Account();
            staff.setAccountId(accountId);
            staff.setUserName("staff");
            staff.setPassword(passwordEncoder.encode("12345678"));
            staff.setEmail("staff@hospital.local");
            staff.setIsActive(true);
            Role role = roleRepository.findById("STAFF").orElseThrow();
            staff.setRole(role);
            accountRepository.save(staff);
            System.out.println("Staff account created: staff / 12345678");
        } else {
            System.out.println("Staff account already exists.");
        }
        // Tạo role MEMBER nếu chưa có
        if (!roleRepository.existsById("MEMBER")) {
            Role memberRole = new Role();
            memberRole.setRole("MEMBER");
            memberRole.setDescription("Normal user role");
            roleRepository.save(memberRole);
        }



// === Khởi tạo các thành phần máu (Component) mặc định ===
        String[] componentIds = {"101", "102", "103", "104"};
        String[] componentTypes = {"Toàn phần", "Hồng cầu", "Tiểu cầu", "Huyết tương"};
        int[] shelfLifeInDays = {35, 42, 5, 365}; // Số ngày hạn sử dụng tương ứng

        for (int i = 0; i < componentIds.length; i++) {
            String id = componentIds[i];
            String type = componentTypes[i];
            int daysToExpire = shelfLifeInDays[i];

            if (!componentRepository.existsById(id)) {
                Component newComponent = Component.builder()
                        .componentId(id)
                        .type(type)
                        .description("Thành phần máu: " + type)
                        .expirationDays(daysToExpire)
                        .build();

                componentRepository.save(newComponent);
            }
        }

        List<Blood> bloodList = bloodRepository.findAll();
        for (Blood blood : bloodList) {
            if (blood.getBloodMatch() == null || blood.getBloodMatch().isBlank()) {
                blood.setBloodMatch("UNKNOWN");
            }
        }
        bloodRepository.saveAll(bloodList);
        System.out.println("✅ Đã cập nhật số lượng túi máu (VALID) cho tất cả Blood.");


        List<Achievement> defaultAchievements = List.of(
                Achievement.builder()
                        .achievementName("Giọt Máu Đầu Tiên")
                        .description("Đánh dấu lần hiến đầu tiên")
                        .minValue(1L).maxValue(2L).build(),

                Achievement.builder()
                        .achievementName("Người Chia Sẻ Yêu Thương")
                        .description("Bắt đầu hình thành thói quen")
                        .minValue(3L).maxValue(4L).build(),

                Achievement.builder()
                        .achievementName("Anh Hùng Máu Ẩn Danh")
                        .description("Thường xuyên giúp đỡ người khác")
                        .minValue(5L).maxValue(9L).build(),

                Achievement.builder()
                        .achievementName("Người Cứu Mạng")
                        .description("Đã gián tiếp cứu sống nhiều người")
                        .minValue(10L).maxValue(14L).build(),

                Achievement.builder()
                        .achievementName("Huy hiệu Vàng")
                        .description("Cam kết bền vững với cộng đồng")
                        .minValue(15L).maxValue(19L).build(),

                Achievement.builder()
                        .achievementName("Người Hùng Hiến Máu")
                        .description("Có thể nhận giấy khen từ địa phương")
                        .minValue(20L).maxValue(29L).build(),

                Achievement.builder()
                        .achievementName("Huyền Thoại Hiến Máu")
                        .description("Tôn vinh người hiến nhiều nhất")
                        .minValue(30L).maxValue(49L).build(),

                Achievement.builder()
                        .achievementName("Người Cống Hiến Trọn Đời")
                        .description("Biểu tượng cống hiến lâu dài")
                        .minValue(50L).maxValue(9999L).build()
        );
        achievementRepository.saveAll(defaultAchievements);
        System.out.println("✅ Đã thêm thành tựu mặc định vào bảng achievement");

        if (bloodRepository.count() == 0) {
            for (Blood.BloodType type : Blood.BloodType.values()) {
                for (Blood.RhFactor rh : Blood.RhFactor.values()) {
                    String code = generateBloodCode(type, rh);

                    Blood blood = new Blood();
                    blood.setBloodCode(code);
                    blood.setBloodType(type);
                    blood.setRh(rh);
                    blood.setIsRareBlood(isRare(type, rh));
                    blood.setQuantity(0L);
                    blood.setBloodMatch(generateCompatibleGroups(type, rh)); // <<< đây nè

                    bloodRepository.save(blood);
                }
            }
            System.out.println("✅ Đã khởi tạo dữ liệu nhóm máu.");
        }


    }
    private String generateBloodCode(Blood.BloodType type, Blood.RhFactor rh) {
        return type.name() + (rh == Blood.RhFactor.POSITIVE ? "+" : "-");
    }

    private boolean isRare(Blood.BloodType type, Blood.RhFactor rh) {
        String code = generateBloodCode(type, rh);
        return List.of("AB-", "B-", "A-", "O-").contains(code);
    }



    private String generateCompatibleGroups(Blood.BloodType type, Blood.RhFactor rh) {
        String bloodCode = generateBloodCode(type, rh);
        List<String> recipients = bloodCompatibilityService.getCompatibleRecipients(bloodCode);

        // Sắp xếp để dễ nhìn
        Collections.sort(recipients);

        return String.join(", ", recipients);
    }

}
