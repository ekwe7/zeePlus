package com.ekwe_hub.zeeplusserver.admin;

import com.ekwe_hub.zeeplusserver.dto.request.CreatePlatformAdminRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PlatformAdminResponse;
import com.ekwe_hub.zeeplusserver.enums.UserRole;
import com.ekwe_hub.zeeplusserver.exception.ResourceNotFoundException;
import com.ekwe_hub.zeeplusserver.model.PlatformAdmin;
import com.ekwe_hub.zeeplusserver.repository.interfaces.PlatformAdminRepository;
import com.ekwe_hub.zeeplusserver.service.impl.PlatformAdminServiceImpl;
import com.ekwe_hub.zeeplusserver.utils.mapper.adminMapper.PlatformAdminMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PlatformAdminServiceImplTest {
    @Mock
    private PlatformAdminRepository platformAdminRepository;
    @Mock
    private PlatformAdminMapper platformAdminMapper;
    @InjectMocks
    private PlatformAdminServiceImpl platformAdminService;
    private CreatePlatformAdminRequest validRequest;
    private PlatformAdmin mockPlatformAdmin;
    private PlatformAdminResponse expectedResponse;

    @BeforeEach
    void platformAdminService() {
        validRequest = new CreatePlatformAdminRequest(
                "Hmo_manager_Zee",
                "hmo.manager@zeecare.com",
                "password123",
                "+2348133900781",
                UserRole.HMO_MANAGER,
                "ZEE-HMO-2026-001",
                "Clinical Authorizations");

        mockPlatformAdmin = PlatformAdmin.builder()
                .username("Hmo_manager_Zee")
                .email("hmo.manager@zeecare.com")
                .password("password123")
                .phoneNumber("+2348133900781")
                .userRole(UserRole.HMO_MANAGER)
                .employeeId("ZEE-HMO-2026-001")
                .department("Clinical Authorizations")
                .isActive(true)
                .build();
        mockPlatformAdmin.setEmployeeId("ADM-UUID-88F");

        expectedResponse = new PlatformAdminResponse(
                "ADM-UUID-88F",
                "Hmo_manager_Zee",
                "hmo.manager@zeecare.com",
                "+2348133900781",
                UserRole.HMO_MANAGER,
                "ZEE-HMO-2026-001",
                "Clinical Authorizations",
                true,
                LocalDateTime.now());

    }

    @Test
    void createAdminAccount_ShouldSuccessfullyOnboardNewAdmin() {
        when(platformAdminRepository.existsByEmailIgnoreCase(validRequest.email())).thenReturn(false);
        when(platformAdminRepository.existsByEmployeeId(validRequest.employeeId())).thenReturn(false);

        when(platformAdminMapper.toEntity(any(CreatePlatformAdminRequest.class), any(String.class)))
                .thenReturn(mockPlatformAdmin);
        when(platformAdminRepository.save(any(PlatformAdmin.class))).thenReturn(mockPlatformAdmin);
        when(platformAdminMapper.toResponse(mockPlatformAdmin)).thenReturn(expectedResponse);

        PlatformAdminResponse actualResponse = platformAdminService.createAdminAccount(validRequest);

        assertNotNull(actualResponse);
        assertEquals("ADM-UUID-88F", actualResponse.id());
        assertEquals(expectedResponse.id(), actualResponse.id());
        assertEquals(expectedResponse.employeeId(), actualResponse.employeeId());

    }

    @Test
    void test_that_createAdminAccount_Should_throw_exception_when_email_already_exists(){
        when(platformAdminRepository.existsByEmailIgnoreCase(validRequest.email())).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                platformAdminService.createAdminAccount(validRequest));

        assertEquals("Administrative account with this email already exists", exception.getMessage());

    }

    @Test
    void test_that_getAdminById_should_throw_IllegalArgumentException_when_admin_does_not_exist(){
        String missingId = "ADM-UUID-88F";
        when(platformAdminRepository.findById(missingId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                platformAdminService.getAdminById(missingId));

        assertEquals("Platform Admin not found with ID: " + missingId, exception.getMessage());
    }



}
