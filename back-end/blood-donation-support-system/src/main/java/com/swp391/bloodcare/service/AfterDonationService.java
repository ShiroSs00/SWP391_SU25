package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.AfterDonationBlood;
import com.swp391.bloodcare.entity.HealthCheck;
import com.swp391.bloodcare.repository.AfterDonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AfterDonationService {
    @Autowired
    private AfterDonationRepository afterDonationRepository;
    public AfterDonationBlood createAfterDonation(AfterDonationBlood afterDonationBlood, HealthCheck healthCheck) {
        afterDonationBlood.setHealthCheck(healthCheck);
        return afterDonationRepository.save(afterDonationBlood);
    }
    public AfterDonationBlood updateAfterDonation(AfterDonationBlood afterDonationBlood) {
        return afterDonationRepository.save(afterDonationBlood);
    }
    private void deleteAfterDonation(AfterDonationBlood afterDonationBlood) {
        afterDonationBlood.setHealthCheck(null);
        afterDonationRepository.delete(afterDonationBlood);
    }
    public List<AfterDonationBlood> getAllAfterDonations() {
        return afterDonationRepository.findAll();
    }
    public AfterDonationBlood getAfterDonationByHealthCheck(HealthCheck healthCheck) {
        return afterDonationRepository.getReferenceById((long)healthCheck.getHeathCheckId());
    }

}
