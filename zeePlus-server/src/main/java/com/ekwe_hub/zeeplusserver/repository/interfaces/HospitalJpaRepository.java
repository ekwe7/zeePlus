package com.ekwe_hub.zeeplusserver.repository.interfaces;

import com.ekwe_hub.zeeplusserver.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HospitalJpaRepository extends JpaRepository<Hospital, String> {
    boolean existsByEmail(String email);

    boolean existsByLicenseNumber(String licenceNumber);

    Optional<Hospital> findByEmail(String email);

    Optional<Hospital> findByLicenseNumber(String licenseNumber);

}
