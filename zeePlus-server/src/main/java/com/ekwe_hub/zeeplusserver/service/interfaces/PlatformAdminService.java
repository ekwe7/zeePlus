package com.ekwe_hub.zeeplusserver.service.interfaces;

import com.ekwe_hub.zeeplusserver.dto.request.CreatePlatformAdminRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PlatformAdminResponse;
import com.ekwe_hub.zeeplusserver.enums.UserRole;

import java.util.List;

public interface PlatformAdminService {
    PlatformAdminResponse createAdminAccount(CreatePlatformAdminRequest request);
    PlatformAdminResponse getAdminById(String id);
    PlatformAdminResponse getAdminByEmployeeId(String employeeId);
    List<PlatformAdminResponse> getAdminsByRole(UserRole role);
    PlatformAdminResponse updateAdminStatus(String id, boolean isActive);
}
