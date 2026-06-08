package com.ekwe_hub.zeeplusserver.model;

import com.ekwe_hub.zeeplusserver.enums.PharmacyStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "pharmacy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Pharmacy extends User {
    @Column(name = "pharmacy_name", nullable = false)
    private String pharmacyName;

    @Column(name = "license_number", unique = true, nullable = false)
    private String licenseNumber;
    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "pharmacy_status", nullable = false)
    @Enumerated(EnumType.STRING)
    @lombok.Builder.Default
    private PharmacyStatus pharmacyStatus = PharmacyStatus.PENDING;

}
