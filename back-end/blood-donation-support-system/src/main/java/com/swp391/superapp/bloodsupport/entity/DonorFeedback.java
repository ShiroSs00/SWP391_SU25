package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

@Entity
public class DonorFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedbackID")
    private int feedbackID;
    @Column(name = "process", nullable = false)
    private int process;
    @Column(name = "bloodTest", nullable = false)
    private int bloodTest;
    @Column(name = "postDonationCare", nullable = false)
    private int postDonationCare;
    @Column(name = "comfortable", nullable = false)
    private int comfortable;
    @Column(name = "description")
    private String description;

    public DonorFeedback() {
    }

    public DonorFeedback(int process, int bloodTest, int postDonationCare, int comfortable, String description) {
        this.process = process;
        this.bloodTest = bloodTest;
        this.postDonationCare = postDonationCare;
        this.comfortable = comfortable;
        this.description = description;
    }

    public int getFeedbackID() {
        return feedbackID;
    }

    public void setFeedbackID(int feedbackID) {
        this.feedbackID = feedbackID;
    }

    public int getProcess() {
        return process;
    }

    public void setProcess(int process) {
        this.process = process;
    }

    public int getBloodTest() {
        return bloodTest;
    }

    public void setBloodTest(int bloodTest) {
        this.bloodTest = bloodTest;
    }

    public int getPostDonationCare() {
        return postDonationCare;
    }

    public void setPostDonationCare(int postDonationCare) {
        this.postDonationCare = postDonationCare;
    }

    public int getComfortable() {
        return comfortable;
    }

    public void setComfortable(int comfortable) {
        this.comfortable = comfortable;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "DonorFeedback{" +
                "feedbackID=" + feedbackID +
                ", process=" + process +
                ", bloodTest=" + bloodTest +
                ", postDonationCare=" + postDonationCare +
                ", comfortable=" + comfortable +
                ", description='" + description + '\'' +
                '}';
    }
}
