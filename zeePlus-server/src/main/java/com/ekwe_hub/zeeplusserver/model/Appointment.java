package com.ekwe_hub.zeeplusserver.model;

import com.ekwe_hub.zeeplusserver.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Appointment extends BaseEntity {
    private String patientName;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(unique = true, nullable = false)
    private String verificationCode; // Unique secure code to be verified by hospital

    @Enumerated(EnumType.STRING)
    private AppointmentStatus appointmentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
}
