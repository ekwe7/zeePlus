package com.ekwe_hub.zeeplusserver.service.impl;

import com.ekwe_hub.zeeplusserver.dto.request.CreateHospitalRequest;
import com.ekwe_hub.zeeplusserver.dto.response.HospitalResponse;
import com.ekwe_hub.zeeplusserver.utils.mapper.hospitalMapper.HospitalMapper;
import com.ekwe_hub.zeeplusserver.model.Hospital;
import com.ekwe_hub.zeeplusserver.repository.interfaces.HospitalRepository;
import com.ekwe_hub.zeeplusserver.service.interfaces.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {
    private final HospitalRepository hospitalRepository;
    private final HospitalMapper hospitalMapper;

    @Override
    public HospitalResponse addHospital(CreateHospitalRequest request) {
        if (hospitalRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (hospitalRepository.findByLicenseNumber(request.licenseNumber()).isPresent()) {
            throw new RuntimeException("Hospital registration number already exists");
        }
        Hospital hospital = hospitalMapper.toEntity(request);
        Hospital savedHospital = hospitalRepository.save(hospital);

        return hospitalMapper.toResponse(savedHospital);
    }

    @Override
    public HospitalResponse findHospital(String hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        return hospitalMapper.toResponse(hospital);
    }

    @Override
    public List<HospitalResponse> findAllHospitals() {
           return hospitalRepository.findAll().stream()
                   .map(hospitalMapper::toResponse)
                   .collect(Collectors.toList());
    }

    @Override
    public HospitalResponse updateHospital(String hospitalId, CreateHospitalRequest request) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        hospital.setUsername(request.hospitalName());
        hospital.setPhoneNumber(request.phoneNumber());
        hospital.setAddress(request.address());

        Hospital updatedHospital = hospitalRepository.save(hospital);
        return hospitalMapper.toResponse(updatedHospital);
    }

    @Override
    public void deleteHospital(String hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        hospitalRepository.delete(hospital);
    }
}
