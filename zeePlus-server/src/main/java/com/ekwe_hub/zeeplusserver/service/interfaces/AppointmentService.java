package com.ekwe_hub.zeeplusserver.service.interfaces;

import com.ekwe_hub.zeeplusserver.dto.request.CreateAppointmentRequest;
import com.ekwe_hub.zeeplusserver.dto.request.UpdateAppointmentStatusRequest;
import com.ekwe_hub.zeeplusserver.dto.response.AppointmentResponse;

import java.util.List;

public interface AppointmentService {
    AppointmentResponse createAppointmentRequest(CreateAppointmentRequest request);
    List<AppointmentResponse> getAppointmentsByHospital(String hospitalId);
    AppointmentResponse verifyAppointmentCode(String code);
    AppointmentResponse assignDoctorToAppointment(String appointmentId, String doctorId);
    AppointmentResponse updateAppointmentStatus(String appointmentId, UpdateAppointmentStatusRequest request);
    void cancelAppointment(String appointmentId);
}
