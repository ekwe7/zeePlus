package com.ekwe_hub.zeeplusserver.dto.response;

import com.ekwe_hub.zeeplusserver.enums.AppointmentStatus;

public record AppointmentResponse(
        String id,
        String patientName,
        String symptoms,
        String verificationCode,
        AppointmentStatus appointmentStatus,
        String hospitalId,
        String doctorId,
        String doctorName
) {}
