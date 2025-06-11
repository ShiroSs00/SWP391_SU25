package com.swp391.superapp.bloodsupport.respository;


import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.entity.BloodDonationEvent;
import com.swp391.superapp.bloodsupport.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public  class EventService {

    @Autowired
    private EventRepository eventRepository;

    public BloodDonationEvent createEvent(Account account, BloodDonationEvent bloodDonationEvent) {
        bloodDonationEvent.setAccount(account);
        return eventRepository.save(bloodDonationEvent);
    }
    public BloodDonationEvent updateEvent( BloodDonationEvent bloodDonationEvent) {
        return eventRepository.save(bloodDonationEvent);
    }
    public List<BloodDonationEvent> getAllEvent(){
        return eventRepository.findAll();
    }
    public List<BloodDonationEvent> getEventByDate(Date startTime, Date endTime){
       return eventRepository.findByCreationDateBetween(startTime, endTime);
    }
    public void deleteAndReturn(BloodDonationEvent bloodDonationEvent) {
        eventRepository.delete(bloodDonationEvent);
    }


}
