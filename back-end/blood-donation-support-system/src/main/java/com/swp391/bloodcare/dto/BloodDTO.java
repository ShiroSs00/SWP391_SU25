package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.Blood;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodDTO {
    private String bloodCode;
    private Blood.BloodType bloodType;
    private Blood.RhFactor rhFactor;
    private Boolean isRareBlood;
    private Integer quantity;
    private String bloodMatch;

    public BloodDTO(Blood blood) {
        this.bloodCode = blood.getBloodCode();
        this.bloodType = blood.getBloodType();
        this.rhFactor = blood.getRh();
        this.isRareBlood = blood.getIsRareBlood();
        this.quantity = blood.getQuantity();
        this.bloodMatch = blood.getBloodMatch();
    }


}
