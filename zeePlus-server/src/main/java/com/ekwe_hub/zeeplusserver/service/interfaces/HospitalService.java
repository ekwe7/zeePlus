package com.ekwe_hub.zeeplusserver.service.interfaces;

import com.ekwe_hub.zeeplusserver.dto.request.CreateHospitalRequest;
import com.ekwe_hub.zeeplusserver.dto.response.HospitalResponse;

import java.util.List;

public interface HospitalService {
    HospitalResponse addHospital(CreateHospitalRequest request);

    HospitalResponse findHospital(String hospitalId);

    List<HospitalResponse> findAllHospitals();

    HospitalResponse updateHospital(String hospitalId, CreateHospitalRequest request);

    void deleteHospital(String hospitalId);
}
