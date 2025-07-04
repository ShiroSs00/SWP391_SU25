package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodDonationHistoryDTO;
import com.swp391.bloodcare.dto.BloodDonationStatisticsDTO;
import com.swp391.bloodcare.entity.AfterDonationBlood;
import com.swp391.bloodcare.entity.BloodDonationHistory;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
import com.swp391.bloodcare.repository.BloodDonationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    //update from healthCheck
    public BloodDonationHistory updateFromHealthCheck(HealthCheck healthCheck) {
        DonationRegistration registration = healthCheck.getDonationRegistration();

        BloodDonationHistory history = repository
                .findByDonationRegistration(registration)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng kí: " + registration.getRegistrationId()));

        // Chỉ cập nhật status
        if (healthCheck.isFitToDonate()) {
            history.setStatus("HEALTH_CHECK_PASSED");
        } else {
            history.setStatus("HEALTH_CHECK_FAILED");
        }

        return repository.save(history);
    }

    //update from after
    public BloodDonationHistory updateFromAfterDonation(AfterDonationBlood afterDonationBlood) {
        HealthCheck healthCheck = afterDonationBlood.getHealthCheck();
        DonationRegistration registration = healthCheck.getDonationRegistration();

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

    //. thông số
//    public BloodDonationStatisticsDTO getStatisticsByAccountId(String accountId){
//        List<BloodDonationHistory> histories = repository.findAll();
//
//        BloodDonationStatisticsDTO dto = new BloodDonationStatisticsDTO();
//        dto.setTotalDonations(histories.size());
//
//        long completedCount = histories.stream().filter(h ->h.getStatus() != null && h.getStatus().contains("COMPLETED")).count();
//        dto.setCompletedDonations((int)completedCount);
//
//        long failedCount = histories.stream().filter(h->h.getStatus() != null && h.getStatus().contains("FAILED") || h.getStatus().contains("REJECTED")).count();
//        dto.setFailedDonations((int)failedCount);
//
//        long pendingCount = histories.stream().filter(h->h.getStatus() != null && h.getStatus().contains("PENDING")  || h.getStatus().contains("PROCESSING")).count();
//        dto.setPendingDonations((int)pendingCount);
//
//        long totalVolume = histories.stream()
//                .filter(h -> h.getHealthCheck() != null)
//                .mapToLong(h -> h.getHealthCheck().getVolumeToTake())
//                .sum();
//        dto.setTotalVolumeToTake(totalVolume);
//
//        // Most recent donation
//        histories.stream()
//                .filter(h -> h.getDonationRegistration() != null && h.getDonationRegistration().getEvent().get != null)
//                .findFirst()
//                .ifPresent(h -> stats.setMostRecentDonationDate(h.getDonationRegistration().getRegistrationDate().toString()));
//    }


    public BloodDonationHistoryDTO convertToDTO(BloodDonationHistory bloodDonationHistory) {
        BloodDonationHistoryDTO dto = new BloodDonationHistoryDTO();
        dto.setId(bloodDonationHistory.getHistoryId());
        //lấy tên người hiến
        if(bloodDonationHistory.getAccount() != null) {
            dto.setName(bloodDonationHistory.getAccount().getProfile().getName());
        }

        //Lấy sự kiện
        if(bloodDonationHistory.getDonationRegistration() != null) {
            dto.setEvent(bloodDonationHistory.getDonationRegistration().getEvent().getNameOfEvent());

        }

        HealthCheck healCheck = null;
        HealthCheck healthCheck = null;
        if (bloodDonationHistory.getDonationRegistration() != null) {
            healthCheck = bloodDonationHistory.getDonationRegistration().getHealthCheck();
        }

        if (healthCheck != null) {
            // Gán volume
            dto.setVolumeToTake(healthCheck.getVolumeToTake());

            // Gán ID của HealthCheck
            dto.setHealCheck(healthCheck.getHealthCheckId());

            // Lấy AfterDonationBlood từ HealthCheck
            AfterDonationBlood after = healthCheck.getAfterDonationBlood();
            if (after != null && after.getBlood() != null) {
                dto.setBloodCode(after.getBlood().getBloodCode());
                dto.setAfterDonationBlood(after.getStatus());
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

    private String mapRegistrationStatusToHistoryStatus(String registrationStatus) {
        if (registrationStatus == null) return "PENDING";

        switch (registrationStatus.toUpperCase()) {
            case "CONFIRMED":
            case "APPROVED":
                return "REGISTERED";
            case "CANCELLED":
                return "REGISTRATION_CANCELLED";
            case "REJECTED":
                return "REGISTRATION_REJECTED";
            default:
                return "PENDING";
        }
    }

    private String mapAfterDonationStatusToHistoryStatus(AfterDonationBlood afterDonation) {
        String status = afterDonation.getStatus();
        Boolean isUsable = afterDonation.getIsBloodUsable();

        if (status == null) return "DONATION_UNDER_REVIEW";

        switch (status.toUpperCase()) {
            case "COMPLETED":
                return isUsable != null && isUsable ? "DONATION_COMPLETED_USABLE" : "DONATION_COMPLETED_UNUSABLE";
            case "PROCESSING":
                return "DONATION_PROCESSING";
            case "REJECTED":
                return "DONATION_REJECTED";
            default:
                return "DONATION_UNDER_REVIEW";
        }
    }

}

