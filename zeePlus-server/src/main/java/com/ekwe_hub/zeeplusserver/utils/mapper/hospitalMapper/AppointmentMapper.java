package com.ekwe_hub.zeeplusserver.utils.mapper.hospitalMapper;

import com.ekwe_hub.zeeplusserver.dto.request.CreateAppointmentRequest;
import com.ekwe_hub.zeeplusserver.dto.response.AppointmentResponse;
import com.ekwe_hub.zeeplusserver.enums.AppointmentStatus;
import com.ekwe_hub.zeeplusserver.model.Appointment;
import com.ekwe_hub.zeeplusserver.model.Hospital;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AppointmentMapper {
    public Appointment toEntity(CreateAppointmentRequest createAppointmentRequest, Hospital hospital) {
        if (hospital == null || createAppointmentRequest == null) {
            return null;
        }
        // Generate a clean, human-readable secure verification token (e.g.,
        // ZEE-A1B2C3D4)
        String cleanVerificationCode = "ZEE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        return Appointment.builder()
                .patientName(createAppointmentRequest.patientName())
                .symptoms(createAppointmentRequest.symptoms())
                .hospital(hospital)
                .appointmentStatus(AppointmentStatus.PENDING)
                .verificationCode(cleanVerificationCode)
                .build();

    }

    public AppointmentResponse toAppointmentResponse(Appointment appointment) {
        if (appointment == null) {
            throw new IllegalArgumentException("Appointment cannot be null");
        }

        // Check if a doctor has actually been allocated to this slot yet
        String doctorId = appointment.getDoctor() != null ? appointment.getDoctor().getId().toString() : null;
        String doctorName = appointment.getDoctor() != null ? appointment.getDoctor().getUsername() : null;

        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatientName(),
                appointment.getSymptoms(),
                appointment.getVerificationCode(),
                appointment.getAppointmentStatus(),
                appointment.getHospital().getId(),
                doctorId,
                doctorName);
    }
}
