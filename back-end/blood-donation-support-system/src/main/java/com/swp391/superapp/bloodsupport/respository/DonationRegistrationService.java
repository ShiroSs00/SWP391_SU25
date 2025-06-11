package com.swp391.superapp.bloodsupport.respository;

import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.entity.DonationRegistration;
import com.swp391.superapp.bloodsupport.entity.Profile;
import com.swp391.superapp.bloodsupport.repository.DonationRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DonationRegistrationService {
    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;
    public DonationRegistration createDonationRegistration(DonationRegistration donationRegistration, Profile profile) {
        donationRegistration.setProfile(profile);
        return donationRegistrationRepository.save(donationRegistration);
    }
    public DonationRegistration updateDonationRegistration(DonationRegistration donationRegistration) {
        return donationRegistrationRepository.save(donationRegistration);
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
