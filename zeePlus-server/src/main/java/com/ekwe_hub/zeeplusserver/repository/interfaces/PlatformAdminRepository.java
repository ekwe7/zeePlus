package com.ekwe_hub.zeeplusserver.repository.interfaces;

import com.ekwe_hub.zeeplusserver.enums.UserRole;
import com.ekwe_hub.zeeplusserver.model.PlatformAdmin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlatformAdminRepository extends JpaRepository<PlatformAdmin, String> {
    Optional<PlatformAdmin> findByEmployeeId(String employeeId);
    Optional<PlatformAdmin> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);

    Optional<PlatformAdmin> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);

    // Find all managers belonging to a specific tier
    List<PlatformAdmin> findByUserRole(UserRole userRole);

    // Find admins filtered by their active employment status
    List<PlatformAdmin> findByIsActive(boolean isActive);
}
