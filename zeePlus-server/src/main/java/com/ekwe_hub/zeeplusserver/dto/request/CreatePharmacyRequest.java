package com.ekwe_hub.zeeplusserver.dto.request;

import com.ekwe_hub.zeeplusserver.enums.PharmacyStatus;

public record CreatePharmacyRequest(
        String userName,
        String pharmacyName,
        String licenseNumber,
        String email,
        String address,
        String phoneNumber,
        String password,
        PharmacyStatus pharmacyStatus

) {}
