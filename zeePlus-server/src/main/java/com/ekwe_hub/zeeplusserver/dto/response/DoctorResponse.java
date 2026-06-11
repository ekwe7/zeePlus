package com.ekwe_hub.zeeplusserver.dto.response;

public record DoctorResponse(
   String id,
   String userName,
   String email,
   String phoneNumber,
   String licenseNumber,
   String specialization,
   boolean isAvailable
) {}
