/* File: Account.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Blood Inventory entity used for user authentication and profile manage
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */
package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "blood")
public class Blood {
    @Id
    @Column(name ="blood_code")
    private String bloodCode;

    @Enumerated(EnumType.STRING)
    @Column(name ="blood_type")
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    @Column(name ="rh")
    private RhFactor rh;

    @JoinColumn(name ="component")
    @ManyToOne()
    private Component component;

    @Column(name ="is_rare_blood")
    private Boolean isRareBlood;

    @Column(name = "quantity")
    private Integer quantity;


    @Column(name ="blood_match")
    private String bloodMatch;


    public Blood() {
    }

    public Blood(String bloodCode, BloodType bloodType, RhFactor rh, Component component, Boolean isRareBlood, int quantity, String bloodMatch) {
        this.bloodCode = bloodCode;
        this.bloodType = bloodType;
        this.rh = rh;
        this.component = component;
        this.isRareBlood = isRareBlood;
        this.quantity = quantity;
        this.bloodMatch = bloodMatch;
    }

    public String getBloodCode() {
        return bloodCode;
    }

    public void setBloodCode(String bloodCode) {
        this.bloodCode = bloodCode;
    }

    public BloodType getBloodType() {
        return bloodType;
    }

    public void setBloodType(BloodType bloodType) {
        this.bloodType = bloodType;
    }

    public RhFactor getRh() {
        return rh;
    }

    public void setRh(RhFactor rh) {
        this.rh = rh;
    }

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
    }

    public Boolean isRareBlood() {
        return isRareBlood;
    }

    public void setRareBlood(Boolean rareBlood) {
        this.isRareBlood = rareBlood;
    }

    public Boolean getRareBlood() {
        return isRareBlood;
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

    public enum BloodType{
        A, B, AB, O
    }


    public enum RhFactor{
        POSITIVE, NEGATIVE
    }

    public enum BloodStatus {
        AVAILABLE, USED, EXPIRED
    }
}