package com.ekwe_hub.zeeplusserver.dto.response;

import com.ekwe_hub.zeeplusserver.enums.SubscriptionStatus;

import java.time.LocalDateTime;

public record PatientSubscriptionResponse(
        String id,
        String patientId,
        String patientName,
        String planId,
        String planName,
        LocalDateTime startDate,
        LocalDateTime endDate,
        SubscriptionStatus status,
        String paymentReference
) {}
