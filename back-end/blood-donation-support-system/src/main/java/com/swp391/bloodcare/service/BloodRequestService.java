package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.request.BloodRequestDTO;
import com.swp391.bloodcare.dto.request.BloodRequestResponseDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private EmailNotifier emailNotifier;

    @Autowired
    private BloodRepository bloodRepository;

    public List<Profile> matchTop20Donors(BloodRequest request) {
        return profileRepository.findAll().stream()
                .filter(p -> p.getAccount().getIsActive())
                .filter(this::isEligibleToDonate)
                .filter(p -> isBloodCompatible(p.getBloodCode(), request.getBloodCode()))
                .sorted(Comparator.comparingDouble(p -> distance(request, p)))
                .limit(20)
                .toList();
    }

    private boolean isEligibleToDonate(Profile profile) {
        return profile.getRestDate() == null || profile.getRestDate().isBefore(LocalDate.now());
    }

    private boolean isBloodCompatible(Blood donor, Blood needed) {
        return donor.getBloodMatch().contains(needed.getBloodCode());
    }

    @Transactional
    public void sendUrgentDonationRequest(BloodRequest request) {
        List<Profile> topDonors = matchTop20Donors(request);
        List<String> emails = topDonors.stream()
                .map(p -> p.getAccount().getEmail())
                .filter(email -> email != null && !email.isBlank())
                .toList();

        String subject = "[KHẨN CẤP] Yêu cầu hỗ trợ hiến máu gần bạn";
        String body = String.format("""
                🩸 Xin chào,

                Một người gần bạn đang cần hỗ trợ hiến máu. Dưới đây là thông tin:

                • Nhóm máu cần: %s (%s)
                • Lượng máu: %d ml
                • Ngày mong muốn: %s

                Nếu bạn có thể giúp đỡ, hãy phản hồi trong hệ thống hoặc liên hệ trực tiếp với nhân viên y tế.

                ❤️ Cảm ơn bạn vì tinh thần nhân ái.
                """,
                request.getBloodCode().getBloodType(),
                request.getBloodCode().getRh(),
                request.getVolume(),
                request.getRequestDate()
        );

        emailNotifier.sendToMany(emails, subject, body);
    }

    public BloodRequest getByIdRaw(String id) {
        return bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn với ID: " + id));
    }


    public BloodRequest createBloodRequest(@Valid BloodRequestDTO bloodRequestDTO, String accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + accountId));

        validateBloodRequest(bloodRequestDTO, account);

        Blood blood = bloodRepository.findByBloodCode(bloodRequestDTO.getBloodCode())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại máu: " + bloodRequestDTO.getBloodCode()));

        BloodRequest br = new BloodRequest();
        br.setIdBloodRequest(generateBloodRequestId());
        br.setAccount(account);
        br.setBloodCode(blood);
        br.setPatientName(bloodRequestDTO.getPatientName());
        br.setRequestDate(bloodRequestDTO.getRequestDate());
        br.setVolume(bloodRequestDTO.getVolume());
        br.setEmergency(bloodRequestDTO.isEmergency());
        br.setStatus("Đang xử lý");
        br.setRequestCreationDate(LocalDate.now());

        return bloodRequestRepository.save(br);
    }

    public BloodRequestResponseDTO convertToResponseDTO(BloodRequest request) {
        BloodRequestResponseDTO dto = new BloodRequestResponseDTO();
        dto.setIdBloodRequest(request.getIdBloodRequest());
        dto.setRequesterName(request.getAccount().getProfile().getName());
        dto.setAccountName(request.getAccount().getUserName());
        dto.setPatientName(request.getPatientName());
        dto.setRequestDate(request.getRequestDate());
        dto.setBloodType(request.getBloodCode().getBloodCode());
        dto.setEmergency(request.isEmergency());
        dto.setStatus(request.getStatus());
        dto.setVolume(request.getVolume());
        dto.setRequestCreationDate(request.getRequestCreationDate());
        return dto;
    }

    public List<BloodRequestResponseDTO> getAllBloodRequests() {
        return bloodRequestRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BloodRequestResponseDTO> getBloodRequestsByAccount(String accountId) {
        return bloodRequestRepository.findByAccount_AccountId(accountId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<BloodRequestResponseDTO> getBloodRequestById(String id) {
        return bloodRequestRepository.findById(id).map(this::convertToResponseDTO);
    }

    public BloodRequestResponseDTO updateStatus(String id, String nStatus) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin máu: " + id));
        request.setStatus(nStatus);
        return convertToResponseDTO(bloodRequestRepository.save(request));
    }

    public List<BloodRequestResponseDTO> getEmergencyRequests() {
        return bloodRequestRepository.findByIsEmergencyTrue().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private String generateBloodRequestId() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int random = new Random().nextInt(900) + 100;
        return "BR-" + dateStr + random;
    }

    private void validateBloodRequest(BloodRequestDTO dto, Account account) {
        if (account.getProfile() == null || account.getProfile().getName() == null) {
            throw new IllegalArgumentException("Tên người đăng ký không được để trống. Vui lòng cập nhật thông tin profile.");
        }

        if (dto.getRequestDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Ngày yêu cầu đã qua.");
        }

        long todayCount = bloodRequestRepository.countByRequestCreationDate(LocalDate.now());
        if (todayCount > 100) {
            throw new RuntimeException("Hệ thống đã đạt giới hạn đơn xin máu trong ngày.");
        }
    }

    private double distance(BloodRequest request, Profile profile) {
        try {
            Address from = request.getAccount().getProfile().getAddress();
            Address to = profile.getAddress();

            if (from == null || to == null || from.getLatitude() == null || to.getLatitude() == null)
                return Double.MAX_VALUE;

            return haversine(from.getLatitude(), from.getLongitude(), to.getLatitude(), to.getLongitude());
        } catch (Exception e) {
            return Double.MAX_VALUE;
        }
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
