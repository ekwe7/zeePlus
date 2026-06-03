package com.ekwe_hub.zeeplusserver.repository.interfaces;

import com.ekwe_hub.zeeplusserver.model.Hospital;

import java.util.List;
import java.util.Optional;

public interface HospitalRepository {
    Hospital save(Hospital hospital);

    Optional<Hospital> findById(String id);
    Optional<Hospital> findByLicenseNumber(String licenseNumber);

    Optional<Hospital> findByEmail(String email);
    List<Hospital> findAll();

    Hospital update(Hospital hospital);

    void delete(Hospital hospital);

    boolean existsByEmail(String email);

}
