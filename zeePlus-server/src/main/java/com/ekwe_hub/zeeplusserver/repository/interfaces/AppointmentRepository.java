package com.ekwe_hub.zeeplusserver.repository.interfaces;

import com.ekwe_hub.zeeplusserver.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    Optional<Appointment> findByVerificationCode(String verificationCode);
    Optional<Appointment> findByHospitalId(String hospitalId);
    Optional<Appointment> findByPatientId(String patientId);
}
