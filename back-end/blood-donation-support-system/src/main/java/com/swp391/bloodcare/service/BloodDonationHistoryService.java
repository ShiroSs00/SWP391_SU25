package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodDonationHistoryDTO;

import com.swp391.bloodcare.entity.AfterDonationBlood;
import com.swp391.bloodcare.entity.BloodDonationHistory;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
import com.swp391.bloodcare.repository.BloodDonationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodDonationHistoryService {

    @Autowired
    private BloodDonationHistoryRepository repository;

    //tạo hoặc update
    public BloodDonationHistory create(DonationRegistration donationRegistration){
        Optional<BloodDonationHistory> exist = repository.findByDonationRegistration(donationRegistration);

        BloodDonationHistory history;
        if (exist.isPresent()) {
            history = exist.get();
        } else {
            history = new BloodDonationHistory();
            history.setHistoryId(generateHistoryId());
            history.setAccount(donationRegistration.getAccount());
            history.setDonationRegistration(donationRegistration);
        }

        history.setStatus(mapRegistrationStatusToHistoryStatus(donationRegistration.getStatus()));
        return repository.save(history);
    }

    @Transactional
    public BloodDonationHistory updateFromHealthCheck(HealthCheck healthCheck) {
        DonationRegistration registration = healthCheck.getDonationRegistration();

        BloodDonationHistory history = repository.findByDonationRegistration(registration)
                .orElseThrow(() -> new IllegalStateException(
                        "Không tồn tại lịch sử hiến máu cho đơn đăng ký: " + registration.getRegistrationId()
                ));

        switch (registration.getStatus()) {
            case COMPLETED:
                history.setStatus("HEALTH_CHECK_PASSED");
                break;
            case CANCELLED:
                history.setStatus("HEALTH_CHECK_FAILED");
                break;
            default:
                history.setStatus("");
                break;
        }

        return repository.save(history);
    }



    //update from after
    public BloodDonationHistory updateFromAfterDonation(AfterDonationBlood afterDonationBlood) {
        HealthCheck healthCheck = afterDonationBlood.getHealthCheck();
        if (afterDonationBlood == null || healthCheck == null) {
            throw new IllegalArgumentException("Thông tin AfterDonationBlood hoặc HealthCheck không hợp lệ.");
        }
        DonationRegistration registration = healthCheck.getDonationRegistration();
        if (registration == null) {
            throw new IllegalStateException("AfterDonationBlood không liên kết với bất kỳ đơn đăng ký nào.");
        }
        BloodDonationHistory history = repository
                .findByDonationRegistration(registration)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng kí: " + registration.getRegistrationId()));

        // Chỉ cập nhật trạng thái theo afterDonationBlood
        history.setStatus(mapAfterDonationStatusToHistoryStatus(afterDonationBlood));

        return repository.save(history);
    }

    //Toàn bộ lịch sử theo accountId
    public List<BloodDonationHistoryDTO> getHistoryByAccountId(String id){
        List<BloodDonationHistory> histories = repository.findAll();
        return toDTOList(histories);
    }

    //tìm kiếm theo nhiều tiêu chí
    public List<BloodDonationHistoryDTO> searchHistoryByAccountId(String accountId, LocalDate startDate, LocalDate endDate, String event, String status){
        List<BloodDonationHistory> histories = repository.searchByAccountWithFilters(accountId, startDate, endDate, event, status);
        return toDTOList(histories);
    }


    public BloodDonationHistoryDTO convertToDTO(BloodDonationHistory bloodDonationHistory) {
        BloodDonationHistoryDTO dto = new BloodDonationHistoryDTO();
        dto.setId(bloodDonationHistory.getHistoryId());
        //lấy tên người hiến
        if(bloodDonationHistory.getAccount() != null) {
            dto.setName(bloodDonationHistory.getAccount().getProfile().getName());
        }

        //Lấy sự kiện
        if (bloodDonationHistory.getDonationRegistration() != null &&
                bloodDonationHistory.getDonationRegistration().getEvent() != null) {

            dto.setEvent(bloodDonationHistory.getDonationRegistration().getEvent().getNameOfEvent());

        } else {
            dto.setEvent(null);
        }

        
        HealthCheck healthCheck = null;
        if (bloodDonationHistory.getDonationRegistration() != null) {
            healthCheck = bloodDonationHistory.getDonationRegistration().getHealthCheck();
        }

        if (healthCheck != null) {

            // Gán ID của HealthCheck
            dto.setHealCheck(healthCheck.getHealthCheckId());

            // Lấy AfterDonationBlood từ HealthCheck
            AfterDonationBlood after = healthCheck.getAfterDonationBlood();
            if (after != null && after.getBlood() != null) {
                dto.setBloodCode(after.getBlood().getBloodCode());
                dto.setAfterDonationBlood(after.getStatus().name());
            }
        }


        dto.setStatus(bloodDonationHistory.getStatus());
        return dto;
    }

    private String generateHistoryId(){
        String datePart = LocalDate.now().toString().replace("-", ""); // yyyyMMdd
        int randomNum = (int)(Math.random() * 900) + 100; // Tạo số từ 100 - 999
        return "HIS-" + datePart + "-" + randomNum;
    }

    public List<BloodDonationHistoryDTO> toDTOList(List<BloodDonationHistory> bloodDonationHistoryList) {
        return bloodDonationHistoryList.stream().map(bloodDonationHistory -> convertToDTO(bloodDonationHistory)).collect(Collectors.toList());
    }

    private String mapRegistrationStatusToHistoryStatus(DonationRegistration.Status registrationStatus) {
        if (registrationStatus == null) return "PENDING";

        switch (registrationStatus) {
            case COMPLETED:
                return "REGISTERED";
            case CANCELLED:
                return "REGISTRATION_CANCELLED";
            default:
                return "PENDING";
        }
    }

    private String mapAfterDonationStatusToHistoryStatus(AfterDonationBlood afterDonation) {
        if (afterDonation == null || afterDonation.getStatus() == null) {
            return "DONATION_UNDER_REVIEW";
        }

        AfterDonationBlood.Status status = afterDonation.getStatus();
        Boolean isUsable = afterDonation.getIsBloodUsable();

        switch (status) {
            case PASSED:
                return (isUsable != null && isUsable)
                        ? "DONATION_COMPLETED_USABLE"
                        : "DONATION_COMPLETED_UNUSABLE";
            case FAILED:
                return "DONATION_REJECTED";
            case SEPARATED:
                return "DONATION_PROCESSING";
            default:
                return "DONATION_UNDER_REVIEW";
        }
    }


}

