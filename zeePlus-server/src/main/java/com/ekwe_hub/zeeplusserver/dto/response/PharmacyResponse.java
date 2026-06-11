package com.ekwe_hub.zeeplusserver.dto.response;

import com.ekwe_hub.zeeplusserver.enums.PharmacyStatus;

public record PharmacyResponse(
        String pharmacyId,
        String pharmacyName,
        String email,
        String phoneNumber,
        String licenseNumber,
        String address,
        PharmacyStatus pharmacyStatus
) {}
