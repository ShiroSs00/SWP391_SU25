package com.swp391.bloodcare.entity.Location;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "administrative_regions")
public class AdministrativeRegion {
    @Id
    private Integer id;
    private String name;
    private String nameEn;
    private String codeName;
    private String codeNameEn;

    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private List<Province> provinces;
}

