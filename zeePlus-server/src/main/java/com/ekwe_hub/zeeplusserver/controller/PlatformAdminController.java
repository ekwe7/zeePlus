package com.ekwe_hub.zeeplusserver.controller;

import com.ekwe_hub.zeeplusserver.dto.request.CreatePlatformAdminRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PlatformAdminResponse;
import com.ekwe_hub.zeeplusserver.enums.UserRole;
import com.ekwe_hub.zeeplusserver.service.interfaces.PlatformAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/platform/admins")
@RequiredArgsConstructor
public class PlatformAdminController {

    private final PlatformAdminService platformAdminService;

    @PostMapping("/register")
    public ResponseEntity<PlatformAdminResponse> registerAdmin(@RequestBody CreatePlatformAdminRequest request) {
        PlatformAdminResponse response = platformAdminService.createAdminAccount(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatformAdminResponse> getAdminById(@PathVariable String id) {
        PlatformAdminResponse response = platformAdminService.getAdminById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<PlatformAdminResponse> getAdminByEmployeeId(@PathVariable String employeeId) {
        PlatformAdminResponse response = platformAdminService.getAdminByEmployeeId(employeeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<PlatformAdminResponse>> getAdminsByRole(@PathVariable UserRole role) {
        List<PlatformAdminResponse> responses = platformAdminService.getAdminsByRole(role);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PlatformAdminResponse> updateAdminStatus(@PathVariable String id, @RequestParam boolean isActive) {
        PlatformAdminResponse response = platformAdminService.updateAdminStatus(id, isActive);
        return ResponseEntity.ok(response);
    }


}
