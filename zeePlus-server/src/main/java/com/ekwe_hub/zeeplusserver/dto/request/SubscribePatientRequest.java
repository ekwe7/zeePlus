package com.ekwe_hub.zeeplusserver.dto.request;

public record SubscribePatientRequest(
        String patientId,
        String planId,
        String paymentReference
) {}
