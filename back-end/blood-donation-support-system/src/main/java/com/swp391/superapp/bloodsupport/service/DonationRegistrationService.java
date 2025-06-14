package com.swp391.superapp.bloodsupport.service;

import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.entity.DonationRegistration;
import com.swp391.superapp.bloodsupport.entity.Profile;
import com.swp391.superapp.bloodsupport.repository.DonationRegistrationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DonationRegistrationService {
    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;
    public DonationRegistration createDonationRegistration(DonationRegistration donationRegistration, Account account) {
        donationRegistration.setAccount(account);
        return donationRegistrationRepository.save(donationRegistration);
    }
    public DonationRegistration updateDonationRegistration(int id, DonationRegistration updatedData) {
        DonationRegistration existing = donationRegistrationRepository.findById((long) id)
                .orElseThrow(() -> new EntityNotFoundException("DonationRegistration not found with id: " + id));

        // Cập nhật các field cần thiết
        existing.setDateCreated(updatedData.getDateCreated());
        existing.setStatus(updatedData.getStatus());
        existing.setBloodDonationEvent(updatedData.getBloodDonationEvent());
        existing.setHealthCheck(updatedData.getHealthCheck());
        existing.setDonorFeedback(updatedData.getDonorFeedback());
        existing.setComponent(updatedData.getComponent());

        // Không cập nhật profile (tránh thay đổi người tạo bản ghi)

        return donationRegistrationRepository.save(existing);
    }

    public DonationRegistration deleteDonationRegistration(long id) {
        DonationRegistration donorRegis = donationRegistrationRepository.findById(id).orElse(null);
        if (donorRegis != null) {
            donationRegistrationRepository.delete(donorRegis);
        }
        return donorRegis;
    }
    public List<DonationRegistration> getAllDonationRegistrations() {
        return donationRegistrationRepository.findAll();
    }
}
