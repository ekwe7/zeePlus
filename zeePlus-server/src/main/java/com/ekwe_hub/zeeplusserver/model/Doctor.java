package com.ekwe_hub.zeeplusserver.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor extends User{
    private String specialization;
    private String licenseNumber;
    private boolean isAvailable;
}
