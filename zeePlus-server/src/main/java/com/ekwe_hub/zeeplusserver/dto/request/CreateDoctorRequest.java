package com.ekwe_hub.zeeplusserver.dto.request;

public record CreateDoctorRequest(
        String userName,
        String email,
        String phoneNumber,
        String password,
        String licenseNumber,
        String specialization
) {}
