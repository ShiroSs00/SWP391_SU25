package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

@Entity
public class HealthCheck {
    @Column(name = "health_check_id")
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int heathCheckId;
    @Column(name = "weight",columnDefinition = "DOUBLE DEFAULT 0")
    private double weight;
    @Column(name = "temperate",columnDefinition = "DOUBLE DEFAULT 0")
    private double temperate;
    @Column(name = "blood_pressure",columnDefinition = "DOUBLE DEFAULT 0")
    private double bloodPressure;
    @Column(name = "pluse", columnDefinition = "INT DEFAULT 0")
    private int pluse;
    @Column(name = "hemogobin",columnDefinition = "DOUBLE DEFAULT 0")
    private double hemogobin;
    @Column(name = "volume_to_take", columnDefinition = "INT DEFAULT 0")
    private int volumeToTake;
    @Column(name = "isFitToDonate",columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isFitToDonate;
    @Column(name = "note")
    private String note;
    @OneToOne
    @JoinColumn(name = "donation_registration_id")
    private DonationRegistration donationRegistration;
    @OneToOne
    @JoinColumn(name = "after_donation_id")
    private AfterDonationBlood afterDonationBlood;

    public HealthCheck() {
    }

    public HealthCheck(double weight, double temperate, double bloodPressure, int pluse, double hemogobin, int volumeToTake, boolean isFitToDonate, String note) {
        this.weight = weight;
        this.temperate = temperate;
        this.bloodPressure = bloodPressure;
        this.pluse = pluse;
        this.hemogobin = hemogobin;
        this.volumeToTake = volumeToTake;
        this.isFitToDonate = isFitToDonate;
        this.note = note;
    }

    public DonationRegistration getDonationRegistration() {
        return donationRegistration;
    }

    public void setDonationRegistration(DonationRegistration donationRegistration) {
        this.donationRegistration = donationRegistration;
    }

    public AfterDonationBlood getAfterDonationBlood() {
        return afterDonationBlood;
    }

    public void setAfterDonationBlood(AfterDonationBlood afterDonationBlood) {
        this.afterDonationBlood = afterDonationBlood;
    }

    public int getHeathCheckId() {
        return heathCheckId;
    }

    public void setHeathCheckId(int heathCheckId) {
        this.heathCheckId = heathCheckId;
    }


    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public double getTemperate() {
        return temperate;
    }

    public void setTemperate(double temperate) {
        this.temperate = temperate;
    }

    public double getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(double bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public int getPluse() {
        return pluse;
    }

    public void setPluse(int pluse) {
        this.pluse = pluse;
    }

    public double getHemogobin() {
        return hemogobin;
    }

    public void setHemogobin(double hemogobin) {
        this.hemogobin = hemogobin;
    }

    public int getVolumeToTake() {
        return volumeToTake;
    }

    public void setVolumeToTake(int volumeToTake) {
        this.volumeToTake = volumeToTake;
    }

    public boolean isFitToDonate() {
        return isFitToDonate;
    }

    public void setFitToDonate(boolean fitToDonate) {
        isFitToDonate = fitToDonate;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @Override
    public String toString() {
        return "HealthCheck{" +
                "heathCheckId=" + heathCheckId +
                ", weight=" + weight +
                ", temperate=" + temperate +
                ", bloodPressure=" + bloodPressure +
                ", pluse=" + pluse +
                ", hemogobin=" + hemogobin +
                ", volumeToTake=" + volumeToTake +
                ", isFitToDonate=" + isFitToDonate +
                ", note='" + note + '\'' +
                '}';
    }
}
