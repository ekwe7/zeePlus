package com.ekwe_hub.zeeplusserver.utils.mapper.adminMapper;

import com.ekwe_hub.zeeplusserver.dto.request.CreatePlatformAdminRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PlatformAdminResponse;
import com.ekwe_hub.zeeplusserver.model.PlatformAdmin;
import org.springframework.stereotype.Component;

@Component
public class PlatformAdminMapper {

    public PlatformAdmin toEntity(CreatePlatformAdminRequest request, String encodedPassword) {
        if (request == null)
            return null;

        return PlatformAdmin.builder()
                .username(request.username())
                .email(request.email())
                .password(encodedPassword)
                .phoneNumber(request.phoneNumber())
                .userRole(request.designation())
                .employeeId(request.employeeId())
                .department(request.department())
                .isActive(true)
                .build();
    }

    public PlatformAdminResponse toResponse(PlatformAdmin admin) {
        if (admin == null)
            throw new IllegalArgumentException("PlatformAdmin cannot be null");

        return new PlatformAdminResponse(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getPhoneNumber(),
                admin.getUserRole(),
                admin.getEmployeeId(),
                admin.getDepartment(),
                admin.isActive(),
                null);
    }
}
