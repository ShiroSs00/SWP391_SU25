package com.swp391.bloodcare.entity.Location;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Province {
    @Id
    private String code;
    private String name;
    private String nameEn;
    private String fullName;
    private String fullNameEn;
    private String codeName;

    @ManyToOne
    @JoinColumn(name = "administrative_unit_id")
    private AdministrativeUnit administrativeUnit;

    @OneToMany(mappedBy = "province", fetch = FetchType.LAZY)
    private List<Ward> wards;
}

