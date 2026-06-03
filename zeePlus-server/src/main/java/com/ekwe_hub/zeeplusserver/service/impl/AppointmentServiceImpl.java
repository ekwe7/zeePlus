package com.ekwe_hub.zeeplusserver.service.impl;

import com.ekwe_hub.zeeplusserver.dto.request.CreateAppointmentRequest;
import com.ekwe_hub.zeeplusserver.dto.request.UpdateAppointmentStatusRequest;
import com.ekwe_hub.zeeplusserver.dto.response.AppointmentResponse;
import com.ekwe_hub.zeeplusserver.enums.AppointmentStatus;
import com.ekwe_hub.zeeplusserver.exception.ResourceNotFoundException;
import com.ekwe_hub.zeeplusserver.model.Appointment;
import com.ekwe_hub.zeeplusserver.model.Doctor;
import com.ekwe_hub.zeeplusserver.model.Hospital;
import com.ekwe_hub.zeeplusserver.repository.interfaces.AppointmentRepository;
import com.ekwe_hub.zeeplusserver.repository.interfaces.DoctorRepository;
import com.ekwe_hub.zeeplusserver.repository.interfaces.HospitalJpaRepository;
import com.ekwe_hub.zeeplusserver.repository.interfaces.HospitalRepository;
import com.ekwe_hub.zeeplusserver.service.interfaces.AppointmentService;
import com.ekwe_hub.zeeplusserver.utils.mapper.hospitalMapper.AppointmentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final AppointmentMapper appointmentMapper;
    private final HospitalJpaRepository hospitalJpaRepository;

    @Override
    public AppointmentResponse createAppoitmentRequest(CreateAppointmentRequest createAppointmentRequest) {
        Hospital hospital = hospitalRepository.findById(createAppointmentRequest.hospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with ID: " + createAppointmentRequest.hospitalId()));

        Appointment appointment = appointmentMapper.toEntity(createAppointmentRequest, hospital);
        Appointment savedAppointmet = appointmentRepository.save(appointment);
        return appointmentMapper.toAppointmentResponse(savedAppointmet);

    }

    //Review patient symptoms (Fetch all appointments for a specific hospital)
    @Override
    public List<AppointmentResponse> getAppointmentByHospital(String hospitalId){
        if(!hospitalJpaRepository.existsById(hospitalId)){
            throw new ResourceNotFoundException("Hospital not found with ID: " + hospitalId);
        }
        return appointmentRepository.findByHospitalId(hospitalId).stream()
                .map(appointmentMapper::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentResponse verifyAppointmentCode(String appointmentCode){
        Appointment appointment = appointmentRepository.findByVerificationCode(appointmentCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalide or non-existing code: " + appointmentCode));

        // Automatically move status to APPROVED once code is verified by hospital clerk
        if(appointment.getAppointmentStatus() == AppointmentStatus.PENDING){
            appointment.setAppointmentStatus(AppointmentStatus.APPROVED);
            appointment = appointmentRepository.save(appointment);
        }
        return appointmentMapper.toAppointmentResponse(appointment);
    }

    @Override
    public AppointmentResponse assignDoctorToAppointment(String appointmentId, String doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        appointment.setDoctor(doctor);
        appointment.setAppointmentStatus(AppointmentStatus.ASSIGNED);

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return appointmentMapper.toAppointmentResponse(updatedAppointment);
    }

    @Override
    public AppointmentResponse updateAppointmentStatus(String appointmentId, UpdateAppointmentStatusRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        appointment.setAppointmentStatus(request.status());
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return appointmentMapper.toAppointmentResponse(updatedAppointment);
    }


}
