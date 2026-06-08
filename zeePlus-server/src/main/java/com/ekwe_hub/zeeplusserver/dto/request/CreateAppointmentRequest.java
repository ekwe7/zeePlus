package com.ekwe_hub.zeeplusserver.dto.request;

public record CreateAppointmentRequest(
    String patientName,
    String symptoms,
    String hospitalId
) { }
