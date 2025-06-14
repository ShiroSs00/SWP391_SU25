package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

@Entity
public class HealthCheck {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int heathCheckId;
    @Column(name = "weight")
    private double weight;
    @Column(name = "temperate")
    private double temperate;
    @Column(name = "bloodPressure")
    private double bloodPressure;
    @Column(name = "pluse")
    private int pluse;
    @Column(name = "hemogobin")
    private double hemogobin;
    @Column(name = "volumeToTake")
    private int volumeToTake;
    @Column(name = "isFitToDonate")
    private boolean isFitToDonate;
    @Column(name = "note")
    private String note;
    @OneToOne
    @JoinColumn(name = "DonationRegistrationId")
    private DonationRegistration donationRegistration;
    @OneToOne
    @JoinColumn(name = "AfterDonationId")
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
