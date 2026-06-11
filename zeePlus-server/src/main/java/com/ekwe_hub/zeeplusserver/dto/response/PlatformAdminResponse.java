package com.ekwe_hub.zeeplusserver.dto.response;

import com.ekwe_hub.zeeplusserver.enums.UserRole;

import java.time.LocalDateTime;

public record PlatformAdminResponse(
        String id,
        String username,
        String email,
        String phoneNumber,
        UserRole designation,
        String employeeId,
        String department,
        boolean isActive,
        LocalDateTime createdAt

) {}
