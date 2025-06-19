package com.swp391.bloodcare.service;


import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public  class EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private AccountRepository accountRepository;

    public BloodDonationEvent createEventByUsername(String username, BloodDonationEvent event) {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        event.setAccount(account);
        return eventRepository.save(event);
    }

    public BloodDonationEvent  updateEvent(int id, BloodDonationEvent updatedEvent) {
        BloodDonationEvent existingEvent = eventRepository.findById((long) id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found with ID: " + id
                ));

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
