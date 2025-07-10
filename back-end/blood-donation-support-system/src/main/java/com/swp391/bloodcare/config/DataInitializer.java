package com.swp391.bloodcare.config;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Blood;

import com.swp391.bloodcare.entity.Component;
import com.swp391.bloodcare.entity.Role;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import com.swp391.bloodcare.repository.ComponentRepository;
import com.swp391.bloodcare.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.ThreadLocalRandom;

@org.springframework.stereotype.Component
@RequiredArgsConstructor
public class DataInitializer {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;

    private final ComponentRepository componentRepository;
    private final BloodRepository bloodRepository;

    private final PasswordEncoder passwordEncoder;

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
            admin.setActive(true);
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
            staff.setActive(true);
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

// Tạo tài khoản member nếu chưa tồn tại
        if (!accountRepository.existsByUserNameIgnoreCase("member")) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = ThreadLocalRandom.current().nextInt(1000);
            String randomPart = String.format("%03d", randomCode);
            String accountId = "AC-" + timestamp + "-" + randomPart;

            Account member = new Account();
            member.setAccountId(accountId);
            member.setUserName("member");
            member.setPassword(passwordEncoder.encode("12345678"));
            member.setEmail("member@user.local");
            member.setActive(true);
            Role role = roleRepository.findById("MEMBER").orElseThrow();
            member.setRole(role);
            accountRepository.save(member);
            System.out.println("Member account created: member / 12345678");
        } else {
            System.out.println("Member account already exists.");
        }

// === Khởi tạo các thành phần máu (Component) mặc định ===
        String[] ids = {"101", "102", "103", "104"};
        String[] types = {"Toàn phần", "Hồng cầu", "Tiểu cầu", "Huyết tương"};
        int[] shelfLifeDays = {35, 42, 5, 365}; // hạn sử dụng tương ứng

        for (int i = 0; i < ids.length; i++) {
            String id = ids[i];
            if (!componentRepository.existsById(id)) {
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.DAY_OF_YEAR, shelfLifeDays[i]);
                Date expirationDate = cal.getTime();

                Component component = Component.builder()
                        .componentId(id)
                        .type(types[i])
                        .description("Thành phần máu: " + types[i])
                        .expirationDate(expirationDate)
                        .build();

                componentRepository.save(component);
            }
        }


        // === Khởi tạo các loại máu ===
        List<String> rareBloodTypes = List.of("AB_NEGATIVE", "B_NEGATIVE", "A_NEGATIVE", "O_NEGATIVE");

        for (Blood.BloodType type : Blood.BloodType.values()) {
            for (Blood.RhFactor rh : Blood.RhFactor.values()) {
                String code = type.name() + "_" + rh.name(); // Ví dụ: A_POSITIVE
                if (!bloodRepository.existsById(code)) {
                    Blood blood = new Blood();
                    blood.setBloodCode(code);
                    blood.setBloodType(type);
                    blood.setRh(rh);
                    blood.setIsRareBlood(rareBloodTypes.contains(code));
                    blood.setQuantity(0);
                    blood.setBloodMatch("");

                    bloodRepository.save(blood);
                }
            }
        }

    }
}
