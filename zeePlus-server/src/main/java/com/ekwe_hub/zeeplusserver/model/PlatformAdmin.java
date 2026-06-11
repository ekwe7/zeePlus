package com.ekwe_hub.zeeplusserver.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "platform_admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PlatformAdmin extends User {
    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;
    @Column(name = "is_active", nullable = false)
    private boolean isActive;
    @Column(name = "department", nullable = false)
    private String department;
}
