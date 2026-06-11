package com.ekwe_hub.zeeplusserver.dto.request;

import com.ekwe_hub.zeeplusserver.enums.HospitalAccessLevel;
import com.ekwe_hub.zeeplusserver.enums.SubscriptionTier;

import java.math.BigDecimal;

public record CreateSubscriptionPlanRequest(
        String planName,
        SubscriptionTier tier,
        BigDecimal price,
        BigDecimal coverageLimit,
        BigDecimal medicationCoverageLimit,
        HospitalAccessLevel hospitalAccessLevel,
        boolean allowSpecialistAccess
) {}
