package com.ekwe_hub.zeeplusserver.repository.repositoryImpl;

import com.ekwe_hub.zeeplusserver.model.Hospital;
import com.ekwe_hub.zeeplusserver.repository.interfaces.HospitalJpaRepository;
import com.ekwe_hub.zeeplusserver.repository.interfaces.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class HospitalRepositoryImpl implements HospitalRepository {
    private final HospitalJpaRepository hospitalJpaRepository;

    public Hospital save(Hospital hospital) {
        return hospitalJpaRepository.save(hospital);
    }

    @Override
    public Optional<Hospital> findById(String id) {
        return hospitalJpaRepository.findById(id);
    }

    @Override
    public Optional<Hospital> findByLicenseNumber(String licenseNumber) {
        return hospitalJpaRepository.findByLicenseNumber(licenseNumber);
    }

    @Override
    public Optional<Hospital> findByEmail(String email) {
        return hospitalJpaRepository.findByEmail(email);
    }

    @Override
    public List<Hospital> findAll() {
        return hospitalJpaRepository.findAll();
    }

    @Override
    public Hospital update(Hospital hospital) {
        return hospitalJpaRepository.save(hospital);
    }

    @Override
    public void delete(Hospital hospital) {
        hospitalJpaRepository.delete(hospital);
    }

    @Override
    public boolean existsByEmail(String email) {
        return hospitalJpaRepository.existsByEmail(email);
    }
}
