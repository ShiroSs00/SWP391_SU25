package com.swp391.bloodcare.entity.Location;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class AdministrativeUnit {
    @Id
    private Integer id;
    private String fullName;
    private String fullNameEn;
    private String shortName;
    private String shortNameEn;
    private String codeName;
    private String codeNameEn;
}

