/* File: Account.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Blood Inventory entity used for user authentication and profile manage
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */
package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "blood")
public class Blood {
    @Id
    @Column(name ="blood_code")
    private int bloodCode;

    @Enumerated(EnumType.STRING)
    @Column(name ="blood_type")
    private AboType bloodType;

    @Enumerated(EnumType.STRING)
    @Column(name ="rh_factor")
    private RhFactor rhFactor;

    @Column(name ="component")
    private String component;

    @Column(name ="is_rare_blood")
    private boolean isRareBood;

    @Column(name ="volumn")
    private int volumn;

    @Column(name ="quantity")
    private int quantity;

    @Column(name ="blood_match")
    private String bloodMatch;
    
    public Blood() {
    }

    public Blood(int bloodCode, AboType bloodType, RhFactor rh, String component, boolean isRareBood, int volumn, int quantity, String bloodMatch) {
        this.bloodCode = bloodCode;
        this.bloodType = bloodType;
        this.rhFactor = rh;
        this.component = component;
        this.isRareBood = isRareBood;
        this.volumn = volumn;
        this.quantity = quantity;
        this.bloodMatch = bloodMatch;
    }

    public int getBloodCode() {
        return bloodCode;
    }

    public void setBloodCode(int bloodCode) {
        this.bloodCode = bloodCode;
    }

    public AboType getBloodType() {
        return bloodType;
    }

    public void setBloodType(AboType bloodType) {
        this.bloodType = bloodType;
    }

    public RhFactor getRh() {
        return rhFactor;
    }

    public void setRh(RhFactor rh) {
        this.rhFactor = rh;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public boolean isRareBood() {
        return isRareBood;
    }

    public void setRareBood(boolean rareBood) {
        isRareBood = rareBood;
    }

    public int getVolumn() {
        return volumn;
    }

    public void setVolumn(int volumn) {
        this.volumn = volumn;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getBloodMatch() {
        return bloodMatch;
    }

    public void setBloodMatch(String bloodMatch) {
        this.bloodMatch = bloodMatch;
    }

    @Override
    public String toString() {
        return "BloodInventory{" +
                "bloodCode=" + bloodCode +
                ", bloodType='" + bloodType + '\'' +
                ", rh='" + rhFactor + '\'' +
                ", component='" + component + '\'' +
                ", isRareBood=" + isRareBood +
                ", volumn=" + volumn +
                ", quantity=" + quantity +
                ", bloodMatch='" + bloodMatch + '\'' +
                '}';
    }

    public enum AboType{
        A, B, AB, O
    }

    public enum RhFactor{
        POSITIVE, NEGATIVE
    }

    public enum BloodStatus{
        AVAILABLE, USED, EXPIRED
    }
}
