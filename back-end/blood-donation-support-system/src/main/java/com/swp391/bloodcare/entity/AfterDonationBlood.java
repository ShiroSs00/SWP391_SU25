package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

@Entity
public class AfterDonationBlood {
    @Column(name = "after_donation_id")
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAfterDonation;
    @Column(name = "infectious_diseases_checked")
    private Boolean infectiousDiseasesChecked;
    @Column(name = "is_blood_usable")
    private Boolean isBloodUsable;
    @Column(name = "status")
    private String status;
    @Column(name = "note")
    private String note;
    @OneToOne
    @JoinColumn(name = "health_check_id")
    private HealthCheck healthCheck;
    @ManyToOne()
    @JoinColumn(name = "blood_id")
    private Blood blood;


    public AfterDonationBlood() {
    }

    public AfterDonationBlood( Boolean infectiousDiseasesChecked, Boolean isBloodUsable, String status, String note) {

        this.infectiousDiseasesChecked = infectiousDiseasesChecked;
        this.isBloodUsable = isBloodUsable;
        this.status = status;
        this.note = note;
    }

    public HealthCheck getHealthCheck() {
        return healthCheck;
    }

    public void setHealthCheck(HealthCheck healthCheck) {
        this.healthCheck = healthCheck;
    }

    public Blood getBlood() {
        return blood;
    }

    public void setBlood(Blood blood) {
        this.blood = blood;
    }

    public int getIdAfterDonation() {
        return idAfterDonation;
    }

    public void setIdAfterDonation(int idAfterDonation) {
        this.idAfterDonation = idAfterDonation;
    }


    public Boolean getInfectiousDiseasesChecked() {
        return infectiousDiseasesChecked;
    }

    public void setInfectiousDiseasesChecked(Boolean infectiousDiseasesChecked) {
        this.infectiousDiseasesChecked = infectiousDiseasesChecked;
    }

    public Boolean getBloodUsable() {
        return isBloodUsable;
    }

    public void setBloodUsable(Boolean bloodUsable) {
        isBloodUsable = bloodUsable;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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
        return "AfterDonationBlood{" +
                "idAfterDonation=" + idAfterDonation +
                ", infectiousDiseasesChecked=" + infectiousDiseasesChecked +
                ", isBloodUsable=" + isBloodUsable +
                ", status='" + status + '\'' +
                ", note='" + note + '\'' +
                '}';
    }
}
