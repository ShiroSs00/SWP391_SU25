package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.DonationRegistrationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DonationRegistrationService {
    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;
    @Autowired
    private AccountRepository accountRepository;
    public DonationRegistration createDonationByUsername(String username, DonationRegistration donationRegistration) {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        donationRegistration.setAccount(account);
        return donationRegistrationRepository.save(donationRegistration);
    }
    public DonationRegistration updateDonationRegistration(int id, DonationRegistration updatedData) {
        DonationRegistration existing = donationRegistrationRepository.findById((long) id)
                .orElseThrow(() -> new EntityNotFoundException("DonationRegistration not found with id: " + id));

        // Cập nhật các field cần thiết
        existing.setDateCreated(updatedData.getDateCreated());
        existing.setStatus(updatedData.getStatus());
        existing.setEvent(updatedData.getEvent());
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

    public DonationRegistration getDonationRegistrationById(long id) {
        return donationRegistrationRepository.findById(id).orElse(null);
    }
}
