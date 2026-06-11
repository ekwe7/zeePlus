package com.ekwe_hub.zeeplusserver.repository.interfaces;


import com.ekwe_hub.zeeplusserver.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByEmailIgnoreCase(String email);
    Optional<Patient> findByUsername(String username);

    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUsername(String username);

    @Query("SELECT DISTINCT p FROM Patient p JOIN PatientSubscription ps ON ps.patient.id = p.id " +
            "WHERE ps.status = 'ACTIVE' AND ps.endDate > CURRENT_TIMESTAMP")
    List<Patient> findAllActiveInsuredPatients();

    @Query("SELECT p FROM Patient p WHERE p.id = :patientId")
    Optional<Patient> findPatientProfileDetails(@Param("patientId") String patientId);

}
