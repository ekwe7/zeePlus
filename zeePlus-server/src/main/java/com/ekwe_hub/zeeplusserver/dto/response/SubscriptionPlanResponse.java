package com.ekwe_hub.zeeplusserver.dto.response;

import com.ekwe_hub.zeeplusserver.enums.SubscriptionTier;

import java.math.BigDecimal;

public record SubscriptionPlanResponse(
        String id,
        String planName,
        SubscriptionTier tier,
        BigDecimal price,
        BigDecimal coverageLimit,
        boolean isActive
) {}
