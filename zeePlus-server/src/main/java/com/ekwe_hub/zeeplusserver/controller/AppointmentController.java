package com.ekwe_hub.zeeplusserver.controller;

import com.ekwe_hub.zeeplusserver.dto.request.CreateAppointmentRequest;
import com.ekwe_hub.zeeplusserver.dto.request.UpdateAppointmentStatusRequest;
import com.ekwe_hub.zeeplusserver.dto.response.AppointmentResponse;
import com.ekwe_hub.zeeplusserver.service.interfaces.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/appointment")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@RequestBody CreateAppointmentRequest request) {
        AppointmentResponse appointmentResponse = appointmentService.createAppointmentRequest(request);
        return new ResponseEntity<>(appointmentResponse, HttpStatus.CREATED);
    }

    @GetMapping("hospital/{hospitalId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByHospital(@PathVariable String hospitalId) {
        List<AppointmentResponse> responses = appointmentService.getAppointmentsByHospital(hospitalId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/verify")
    public ResponseEntity<AppointmentResponse> verifyAppointmentCode(@RequestParam String appointmentCode) {
        AppointmentResponse appointmentResponse = appointmentService.verifyAppointmentCode(appointmentCode);
        return ResponseEntity.ok(appointmentResponse);
    }

    @PutMapping("/{appointmentId}/assign-doctor/{doctorId}")
    public ResponseEntity<AppointmentResponse> assignDoctor(
            @PathVariable String appointmentId,
            @PathVariable String doctorId) {
        AppointmentResponse response = appointmentService
                .assignDoctorToAppointment(appointmentId, doctorId);
        return ResponseEntity.ok(response);

    }

    @PatchMapping("/{appointmentId}/status")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable String appointmentId,
            @RequestBody UpdateAppointmentStatusRequest request) {
        AppointmentResponse response = appointmentService.updateAppointmentStatus(appointmentId, request);
        return ResponseEntity.ok(response);
    }

}
