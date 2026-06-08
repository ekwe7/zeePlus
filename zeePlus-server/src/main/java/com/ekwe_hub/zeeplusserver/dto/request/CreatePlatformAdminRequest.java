package com.ekwe_hub.zeeplusserver.dto.request;

import com.ekwe_hub.zeeplusserver.enums.UserRole;

public record CreatePlatformAdminRequest(
        String username,
        String email,
        String password,
        String phoneNumber,
        UserRole designation,
        String employeeId,
        String department

) {}
