package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

import java.util.Date;

// chưa xử lí Enum
@Table(name = "waiting_list")
@Entity
public class WaitingList {

    @Id
    @Column(name = "wait_list_id")
    private String waitListId;

    @ManyToOne
    @JoinColumn(name ="idBloodRequest")
    private BloodRequest bloodRequest;

    @ManyToOne
    @JoinColumn(name ="bag_id")
    private BloodBag bloodBag;

    @Column(name = "match_date")
    private Date matchDate;

    @Column(name = "status")
    private StatusEnum status;

    @Column(name = "note")
    private String note;

    public WaitingList() {
    }

    public WaitingList(String waitListId, BloodRequest bloodRequest, BloodBag bloodBag, Date matchDate, StatusEnum status, String note) {
        this.waitListId = waitListId;
        this.bloodRequest = bloodRequest;
        this.bloodBag = bloodBag;
        this.matchDate = matchDate;
        this.status = status;
        this.note = note;
    }

    public String getWaitListId() {
        return waitListId;
    }

    public void setWaitListId(String waitListId) {
        this.waitListId = waitListId;
    }

    public BloodRequest getBloodRequest() {
        return bloodRequest;
    }

    public void setBloodRequest(BloodRequest bloodRequest) {
        this.bloodRequest = bloodRequest;
    }

    public BloodBag getBloodBag() {
        return bloodBag;
    }

    public void setBloodBag(BloodBag bloodBag) {
        this.bloodBag = bloodBag;
    }

    public Date getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(Date matchDate) {
        this.matchDate = matchDate;
    }

    public StatusEnum getStatus() {
        return status;
    }

    public void setStatus(StatusEnum status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @Override
    public String toString() {
        return "WaitingList{" +
                "waitListId='" + waitListId + '\'' +
                ", bloodRequest=" + bloodRequest +
                ", bloodBag=" + bloodBag +
                ", matchDate=" + matchDate +
                ", status=" + status +
                ", note='" + note + '\'' +
                '}';
    }

    public enum StatusEnum{
        PENDING,
        APPROVED,
        REJECTED
    }
}
