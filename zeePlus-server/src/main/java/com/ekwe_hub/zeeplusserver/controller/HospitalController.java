package com.ekwe_hub.zeeplusserver.controller;

import com.ekwe_hub.zeeplusserver.dto.request.CreateHospitalRequest;
import com.ekwe_hub.zeeplusserver.dto.response.HospitalResponse;
import com.ekwe_hub.zeeplusserver.service.impl.HospitalServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/hospitals")
@RequiredArgsConstructor
public class HospitalController {
    private final HospitalServiceImpl hospitalService;

    public ResponseEntity<HospitalResponse> registerHospital(@ResponseBody CreateHospitalRequest request){
        HospitalResponse hospitalResponse = hospitalService.addHospital(request);
        return new ResponseEntity<>(hospitalResponse, HttpStatus.CREATED);
    }
}
