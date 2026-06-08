package com.ekwe_hub.zeeplusserver.controller;

import com.ekwe_hub.zeeplusserver.dto.request.CreateHospitalRequest;
import com.ekwe_hub.zeeplusserver.dto.response.HospitalResponse;
import com.ekwe_hub.zeeplusserver.service.interfaces.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final HospitalService hospitalService;

    @PostMapping("hospital/register")
    public ResponseEntity<HospitalResponse> registerHospital(@RequestBody CreateHospitalRequest request) {
        HospitalResponse hospitalResponse = hospitalService.addHospital(request);
        return new ResponseEntity<>(hospitalResponse, HttpStatus.CREATED);
    }

}
