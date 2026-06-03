package com.ekwe_hub.zeeplusserver.controller;

import com.ekwe_hub.zeeplusserver.dto.request.CreateAppointmentRequest;
import com.ekwe_hub.zeeplusserver.dto.response.AppointmentResponse;
import com.ekwe_hub.zeeplusserver.service.impl.AppointmentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/appointment")
@RequiredArgsConstructor
public class AppointmentController {
    public final AppointmentServiceImpl appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@RequestBody CreateAppointmentRequest request){
        AppointmentResponse appointmentResponse = appointmentService.createAppoitmentRequest(request);
        return new ResponseEntity<>(appointmentResponse, HttpStatus.CREATED);
    }

    @GetMapping("hospital/{hospitalId}")
    public List<AppointmentResponse> getAppointmentsByHospital(@PathVariable String hospitalId){
        List<AppointmentResponse> responses = appointmentService.getAppointmentByHospital(hospitalId);
        return ResponseEntity.ok(responses);
    }


}

