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
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    @Column(name ="rh")
    private RhFactor rh;

    @JoinColumn(name ="component")
    @ManyToOne()
    private Component component;

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
