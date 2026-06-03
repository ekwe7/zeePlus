package com.ekwe_hub.zeeplusserver.dto.request;

import com.ekwe_hub.zeeplusserver.enums.AppointmentStatus;

public record UpdateAppointmentStatusRequest(
        AppointmentStatus status
) {}
