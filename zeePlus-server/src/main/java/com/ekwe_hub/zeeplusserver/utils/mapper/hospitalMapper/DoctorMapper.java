package com.ekwe_hub.zeeplusserver.utils.mapper.hospitalMapper;

import com.ekwe_hub.zeeplusserver.dto.request.CreateDoctorRequest;
import com.ekwe_hub.zeeplusserver.dto.response.DoctorResponse;
import com.ekwe_hub.zeeplusserver.enums.UserRole;
import com.ekwe_hub.zeeplusserver.model.Doctor;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {
    public Doctor toEntity(CreateDoctorRequest doctorRequest, String encodedPassword){
        if (doctorRequest == null) return null;
        return Doctor.builder()
                .username(doctorRequest.userName().trim())
                .email(doctorRequest.email().toLowerCase().trim())
                .password(encodedPassword)
                .userRole(UserRole.DOCTOR)
                .phoneNumber(doctorRequest.phoneNumber().trim())
                .licenseNumber(doctorRequest.licenseNumber().trim())
                .specialization(doctorRequest.specialization().trim())
                .isAvailable(true)
                .build();
    }

    public DoctorResponse toDoctorResponse(Doctor doctor){
        if(doctor == null) return  null;
        return new DoctorResponse(
                doctor.getId(),
                doctor.getUsername(),
                doctor.getEmail(),
                doctor.getPhoneNumber(),
                doctor.getLicenseNumber(),
                doctor.getSpecialization(),
                doctor.isAvailable()
        );
    }

}
