package com.ekwe_hub.zeeplusserver.utils.mapper.hospitalMapper;

import com.ekwe_hub.zeeplusserver.dto.request.CreateHospitalRequest;
import com.ekwe_hub.zeeplusserver.dto.response.HospitalResponse;
import com.ekwe_hub.zeeplusserver.enums.HospitalStatus;
import com.ekwe_hub.zeeplusserver.enums.UserRole;
import com.ekwe_hub.zeeplusserver.model.Hospital;
import org.springframework.stereotype.Component;

@Component
public class HospitalMapper {

    public Hospital toEntity(CreateHospitalRequest request) {
        Hospital hospital = new Hospital();
        hospital.setUsername(request.hospitalName());
        hospital.setEmail(request.email());
        hospital.setPassword(request.phoneNumber());
        hospital.setPhoneNumber(request.phoneNumber());
        hospital.setAddress(request.address());
        hospital.setLicenseNumber(request.licenseNumber());
        hospital.setHospitalStatus(HospitalStatus.PENDING);
        hospital.setUserRole(UserRole.HOSPITAL_ADMIN);
        return hospital;
    }

    public HospitalResponse toResponse(Hospital hospital) {
        return new HospitalResponse(
                hospital.getId(),
                hospital.getUsername(),
                hospital.getEmail(),
                hospital.getPhoneNumber(),
                hospital.getAddress(),
                hospital.getLicenseNumber(),
                hospital.getHospitalStatus().name());
    }
}
