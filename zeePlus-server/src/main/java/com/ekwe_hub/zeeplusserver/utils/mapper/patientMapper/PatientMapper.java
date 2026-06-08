package com.ekwe_hub.zeeplusserver.utils.mapper.patientMapper;

import com.ekwe_hub.zeeplusserver.dto.request.CreatePatientRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PatientResponse;
import com.ekwe_hub.zeeplusserver.enums.SubscriptionTier;
import com.ekwe_hub.zeeplusserver.enums.UserRole;
import com.ekwe_hub.zeeplusserver.model.Patient;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper {

    public Patient toEntity(CreatePatientRequest patientRequest, String encodedPassword) {
        if (patientRequest == null)
            return null;

        return Patient.builder()
                .username(patientRequest.userName().trim())
                .email(patientRequest.email().toLowerCase().trim())
                .password(encodedPassword)
                .phoneNumber(patientRequest.phoneNumber().trim())
                .userRole(UserRole.PATIENT)
                .dateOfBirth(patientRequest.dateOfBirth())
                .gender(patientRequest.gender())
                .subscriptionTier(SubscriptionTier.NONE)
                .emergencyContactName(patientRequest.emergencyContactName())
                .emergencyContactPhone(patientRequest.emergencyContactNumber())
                .build();
    }

    public PatientResponse toPatientResponse(Patient patient) {
        if (patient == null)
            return null;

        return new PatientResponse(
                patient.getId(),
                patient.getUsername(),
                patient.getEmail(),
                patient.getPhoneNumber(),
                patient.getGender(),
                patient.getDateOfBirth(),
                patient.getSubscriptionTier(),
                patient.getEmergencyContactName(),
                patient.getEmergencyContactPhone());
    }

}
