package com.swp391.bloodcare.entity.Location;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name= "wards")
public class Ward {
    @Id
    private String code;
    private String name;
    private String nameEn;
    private String fullName;
    private String fullNameEn;
    private String codeName;

    @ManyToOne
    @JoinColumn(name = "province_code")
    private Province province;

    @ManyToOne
    @JoinColumn(name = "administrative_unit_id")
    private AdministrativeUnit administrativeUnit;
}
