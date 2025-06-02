/* File: BloodInventory.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Blood Inventory entity used for user authentication and profile manager
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */

package com.swp391.superapp.bloodsupport.entity;

public class BloodInventory {
    private int bloodCode;
    private String blood;
    private String rh;
    private String component;
    private boolean isRareBood;
    private int quantity;

    public BloodInventory() {
    }

    public BloodInventory(int bloodCode, String blood, String rh, String component, boolean isRareBood, int quantity) {
        this.bloodCode = bloodCode;
        this.blood = blood;
        this.rh = rh;
        this.component = component;
        this.isRareBood = isRareBood;
        this.quantity = quantity;
    }

    public int getBloodCode() {
        return bloodCode;
    }

    public void setBloodCode(int bloodCode) {
        this.bloodCode = bloodCode;
    }

    public String getBlood() {
        return blood;
    }

    public void setBlood(String blood) {
        this.blood = blood;
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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "BloodInventory{" +
                "bloodCode=" + bloodCode +
                ", blood='" + blood + '\'' +
                ", rh='" + rh + '\'' +
                ", component='" + component + '\'' +
                ", isRareBood=" + isRareBood +
                ", quantity=" + quantity +
                '}';
    }
}
