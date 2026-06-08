package com.ekwe_hub.zeeplusserver.dto.request;

import java.time.LocalDate;

public record CreatePatientRequest(
        String userName,
        String email,
        String phoneNumber,
        String password,
        String gender,
        LocalDate dateOfBirth,
        String emergencyContactName,
        String emergencyContactNumber

) {}
