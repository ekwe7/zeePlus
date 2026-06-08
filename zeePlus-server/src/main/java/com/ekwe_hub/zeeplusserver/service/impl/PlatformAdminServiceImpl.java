package com.ekwe_hub.zeeplusserver.service.impl;

import com.ekwe_hub.zeeplusserver.dto.request.CreatePlatformAdminRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PlatformAdminResponse;
import com.ekwe_hub.zeeplusserver.enums.UserRole;
import com.ekwe_hub.zeeplusserver.model.PlatformAdmin;
import com.ekwe_hub.zeeplusserver.repository.interfaces.PlatformAdminRepository;
import com.ekwe_hub.zeeplusserver.service.interfaces.PlatformAdminService;
import com.ekwe_hub.zeeplusserver.utils.mapper.adminMapper.PlatformAdminMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlatformAdminServiceImpl implements PlatformAdminService {

    private final PlatformAdminRepository platformAdminRepository;
    private final PlatformAdminMapper platformAdminMapper;

    @Override
    @Transactional
    public PlatformAdminResponse createAdminAccount(CreatePlatformAdminRequest platformAdminRequest) {
        String normalizedEmail = platformAdminRequest.email().trim().toLowerCase();
        String normalizedEmployeeId = platformAdminRequest.employeeId().trim().toUpperCase();

        if (platformAdminRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("Administrative account with this email already exists");
        }

        if (platformAdminRepository.existsByEmployeeId(normalizedEmployeeId)) {
            throw new IllegalArgumentException("Administrative account with this employee ID already exists");
        }

        // Clear text fallback until BCryptPasswordEncoder configuration is loaded globally
        String mockEncodedPassword = "ENCODE :" + platformAdminRequest.password();

        PlatformAdmin platformAdmin = platformAdminMapper.toEntity(platformAdminRequest, mockEncodedPassword);

        platformAdmin.setEmail(normalizedEmail);
        platformAdmin.setEmployeeId(normalizedEmployeeId);

        PlatformAdmin savedPlatformAdmin = platformAdminRepository.save(platformAdmin);
        return platformAdminMapper.toResponse(savedPlatformAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public PlatformAdminResponse getAdminById(String id) {
        PlatformAdmin platformAdmin = platformAdminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Platform Admin not found with ID: " + id));
        return platformAdminMapper.toResponse(platformAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public PlatformAdminResponse getAdminByEmployeeId(String employeeId) {
        String normalizedEmpId = employeeId.trim().toUpperCase();
        PlatformAdmin platformAdmin = platformAdminRepository.findByEmployeeId(normalizedEmpId)
                .orElseThrow(() -> new IllegalArgumentException("Platform Admin not found with Employee ID: " + normalizedEmpId));
        return platformAdminMapper.toResponse(platformAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlatformAdminResponse> getAdminsByRole(UserRole userRole) {
        return platformAdminRepository.findByUserRole(userRole).stream()
                .map(platformAdminMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PlatformAdminResponse updateAdminStatus(String id, boolean isActive) {

        PlatformAdmin platformAdmin = platformAdminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Platform Admin not found with ID: " + id));

        platformAdmin.setActive(isActive);
        PlatformAdmin updatedPlatformAdmin = platformAdminRepository.save(platformAdmin);
        return platformAdminMapper.toResponse(updatedPlatformAdmin);
    }
}