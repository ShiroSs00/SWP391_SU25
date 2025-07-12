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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
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

    @Column(name ="is_rare_blood")
    private Boolean isRareBlood;

    @Column(name = "quantity")
    private long quantity;

    @Column(name ="blood_match")
    private String bloodMatch;


    public enum BloodType{
        A, B, AB, O
    }


    public enum RhFactor{
        POSITIVE, NEGATIVE
    }

}