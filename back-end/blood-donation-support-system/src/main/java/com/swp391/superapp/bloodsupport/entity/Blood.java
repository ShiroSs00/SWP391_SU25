/* File: Account.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Blood Inventory entity used for user authentication and profile manage
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */
package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "blood")
public class Blood {
    @Id
    @Column(name ="blood_code")
    private int bloodCode;

    @Column(name ="blood_type")
    private String bloodType;

    @Column(name ="rh")
    private String rh;

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

    public Blood(int bloodCode, String bloodType, String rh, String component, boolean isRareBood, int volumn, int quantity, String bloodMatch) {
        this.bloodCode = bloodCode;
        this.bloodType = bloodType;
        this.rh = rh;
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

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getRh() {
        return rh;
    }

    public void setRh(String rh) {
        this.rh = rh;
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
                ", rh='" + rh + '\'' +
                ", component='" + component + '\'' +
                ", isRareBood=" + isRareBood +
                ", volumn=" + volumn +
                ", quantity=" + quantity +
                ", bloodMatch='" + bloodMatch + '\'' +
                '}';
    }
}
