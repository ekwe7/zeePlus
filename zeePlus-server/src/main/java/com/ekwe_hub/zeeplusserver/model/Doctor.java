package com.ekwe_hub.zeeplusserver.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Doctor extends User {
    private String specialization;
    private String licenseNumber;
    private boolean isAvailable;
}
