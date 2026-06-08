package com.ekwe_hub.zeeplusserver.dto.response;

public record HospitalResponse(
        String id,
        String hospitalName,
        String email,
        String phoneNumber,
        String address,
        String licenseNumber,
        String status
) {}
