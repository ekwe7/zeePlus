package com.ekwe_hub.zeeplusserver.dto.response;

import com.ekwe_hub.zeeplusserver.enums.SubscriptionTier;

import java.time.LocalDate;

public record PatientResponse(
   String id,
   String userName,
   String email,
   String phoneNumber,
   String gender,
   LocalDate dateOfBirth,
   SubscriptionTier subscriptionTier,
   String emergencyContactName,
   String emergencyContactPhone
) {}
