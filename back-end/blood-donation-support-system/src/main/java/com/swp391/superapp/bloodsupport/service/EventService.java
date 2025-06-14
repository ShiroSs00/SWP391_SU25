package com.swp391.superapp.bloodsupport.service;


import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.entity.BloodDonationEvent;
import com.swp391.superapp.bloodsupport.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public  class EventService {

    private EventRepository eventRepository;

    public BloodDonationEvent createEvent(Account account, BloodDonationEvent bloodDonationEvent) {
        if (bloodDonationEvent == null) {
            throw new IllegalArgumentException("Event must not be null");
        }
        bloodDonationEvent.setAccount(account);
        return eventRepository.save(bloodDonationEvent);
    }
    public BloodDonationEvent updateEvent(int id, BloodDonationEvent updatedEvent) {
        BloodDonationEvent existingEvent = eventRepository.findById((long) id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));

        // Cập nhật các field
        existingEvent.setNameOfEvent(updatedEvent.getNameOfEvent());
        existingEvent.setCreationDate(updatedEvent.getCreationDate());
        existingEvent.setStartDate(updatedEvent.getStartDate());
        existingEvent.setEndDate(updatedEvent.getEndDate());
        existingEvent.setExpectedBloodVolume(updatedEvent.getExpectedBloodVolume());
        existingEvent.setActualVolume(updatedEvent.getActualVolume());
        existingEvent.setLocation(updatedEvent.getLocation());
        existingEvent.setStatus(updatedEvent.getStatus());

        return eventRepository.save(existingEvent);
    }



    public List<BloodDonationEvent> getAllEvent(){
        return eventRepository.findAll();
    }
    public List<BloodDonationEvent> getEventByDate(Date startTime, Date endTime){
       return eventRepository.findByCreationDateBetween(startTime, endTime);
    }
    public void deleteEvent(int id) {
        BloodDonationEvent event = eventRepository.findById((long) id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));

        eventRepository.delete(event);
    }



}
