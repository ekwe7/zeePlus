package com.ekwe_hub.zeeplusserver.repository.interfaces;

import com.ekwe_hub.zeeplusserver.model.Pharmacy;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PharmacyRepository {
    Optional<Pharmacy> findByLicenseNumber(String licenseNumber);
    Optional<Pharmacy> findByEmail(String email);
    boolean existsByLicenseNumber(String licenseNumber);

}
