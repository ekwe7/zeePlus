package com.ekwe_hub.zeeplusserver.dto.request;

public record CreateHospitalRequest(
        String hospitalName,
        String email,
        String phoneNumber,
        String address,
        String licenseNumber
) {}
