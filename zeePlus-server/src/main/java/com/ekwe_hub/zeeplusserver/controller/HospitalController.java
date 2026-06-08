package com.ekwe_hub.zeeplusserver.controller;

import com.ekwe_hub.zeeplusserver.dto.request.CreateHospitalRequest;
import com.ekwe_hub.zeeplusserver.dto.response.HospitalResponse;
import com.ekwe_hub.zeeplusserver.service.interfaces.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/hospitals")
@RequiredArgsConstructor
public class HospitalController {
    private final HospitalService hospitalService;

    @PostMapping("register")
    public ResponseEntity<HospitalResponse> registerHospital(@RequestBody CreateHospitalRequest request) {
        HospitalResponse hospitalResponse = hospitalService.addHospital(request);
        return new ResponseEntity<>(hospitalResponse, HttpStatus.CREATED);
    }
}
