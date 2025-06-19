package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "FeedbackOfDonor")
public class DonorFeedback {
    @Id
    @Column(name = "feed_back_id")
    private String feedbackID;
    @Column(name = "process", nullable = false)
    private long process;
    @Column(name = "blood_test", nullable = false)
    private long bloodTest;
    @Column(name = "post_donation_care", nullable = false)
    private long postDonationCare;
    @Column(name = "comfortable", nullable = false)
    private long comfortable;
    @Column(name = "description")
    private String description;
    @OneToOne
    @JoinColumn(name = "registration_id")
    private DonationRegistration registration;

    public DonorFeedback() {
    }

    public DonorFeedback(long process, long bloodTest, long postDonationCare, long comfortable, String description) {
        this.process = process;
        this.bloodTest = bloodTest;
        this.postDonationCare = postDonationCare;
        this.comfortable = comfortable;
        this.description = description;
    }

    public DonationRegistration getRegistration() {
        return registration;
    }

    public void setRegistration(DonationRegistration registration) {
        this.registration = registration;
    }

    public String getFeedbackID() {
        return feedbackID;
    }

    public void setFeedbackID(String feedbackID) {
        this.feedbackID = feedbackID;
    }

    public long getProcess() {
        return process;
    }

    public void setProcess(long process) {
        this.process = process;
    }

    public long getBloodTest() {
        return bloodTest;
    }

    public void setBloodTest(long bloodTest) {
        this.bloodTest = bloodTest;
    }

    public long getPostDonationCare() {
        return postDonationCare;
    }

    public void setPostDonationCare(long postDonationCare) {
        this.postDonationCare = postDonationCare;
    }

    public long getComfortable() {
        return comfortable;
    }

    public void setComfortable(long comfortable) {
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
