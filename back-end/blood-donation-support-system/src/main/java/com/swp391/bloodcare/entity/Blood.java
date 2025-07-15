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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @Column(name = "blood_code")
    @NotBlank(message = "Mã nhóm máu không được để trống")
    private String bloodCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type")
    @NotNull(message = "Kiểu nhóm máu không được để trống")
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    @Column(name = "rh")
    @NotNull(message = "Yếu tố Rh không được để trống")
    private RhFactor rh;

    @Column(name = "is_rare_blood")
    @NotNull(message = "Cần xác định đây có phải nhóm máu hiếm không")
    private Boolean isRareBlood;

    @Column(name = "quantity")
    @Min(value = 0, message = "Số lượng phải >= 0")
    private long quantity;

    @Column(name = "blood_match")
    @NotBlank(message = "Thông tin tương thích máu không được để trống")
    private String bloodMatch;


    public enum BloodType{
        A, B, AB, O
    }


    public enum RhFactor{
        POSITIVE, NEGATIVE
    }

}