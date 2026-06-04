package com.ekwe_hub.zeeplusserver.appoitment;

import com.ekwe_hub.zeeplusserver.dto.request.CreateAppointmentRequest;
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
import com.ekwe_hub.zeeplusserver.service.impl.AppointmentServiceImpl;
import com.ekwe_hub.zeeplusserver.utils.mapper.hospitalMapper.AppointmentMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceImplTest {
        @Mock
        private AppointmentRepository appointmentRepository;
        @Mock
        private HospitalRepository hospitalRepository;
        @Mock
        private HospitalJpaRepository hospitalJpaRepository;
        @Mock
        private DoctorRepository doctorRepository;
        @Mock
        private AppointmentMapper appointmentMapper;

        @InjectMocks
        private AppointmentServiceImpl appointmentService;

        private Hospital mockHospital;
        private Appointment mockAppointment;
        private Doctor mockDoctor;

        @BeforeEach
        void appointmentService() {
                mockHospital = Hospital.builder()
                                .username("Equeh Hospital")
                                .email("equeh@mail.xyz")
                                .licenseNumber("LH-99211")
                                .build();
                mockHospital.setId("HS-001A");

                mockDoctor = Doctor.builder()
                                .specialization("Cardiology")
                                .licenseNumber("NGLI-308")
                                .isAvailable(true)
                                .build();
                mockDoctor.setId("Doc-001");
                mockDoctor.setUsername("Dr Uche");

                mockAppointment = Appointment.builder()
                                .patientName("Dotun Adedotun")
                                .symptoms("Severe chest pain and shortness of breath")
                                .verificationCode("VNUM-028")
                                .appointmentStatus(AppointmentStatus.PENDING)
                                .hospital(mockHospital)
                                .build();
                mockAppointment.setId("AP-204");

        }

        @Test
        void test_that_patient_successfully_creates_appointment_request() {
                CreateAppointmentRequest createAppointmentRequest = new CreateAppointmentRequest(
                                "Dotun Adedotun",
                                "Severe chest pain and shortness of breath",
                                "Hs-001A");

                when(hospitalRepository.findById("Hs-001A")).thenReturn(Optional.of(mockHospital));
                when(appointmentMapper.toEntity(any(CreateAppointmentRequest.class), any(Hospital.class)))
                                .thenReturn(mockAppointment);
                when(appointmentRepository.save(any(Appointment.class))).thenReturn(mockAppointment);

                AppointmentResponse expectedResponse = new AppointmentResponse(
                                "AP-204", "Dotun Adedotun", "Severe chest pain and shortness of breath",
                                "VNUM-028", AppointmentStatus.PENDING, "HS-001A", null, null);
                when(appointmentMapper.toAppointmentResponse(mockAppointment)).thenReturn(expectedResponse);

                AppointmentResponse response = appointmentService.createAppointmentRequest(createAppointmentRequest);

                assertNotNull(response);
                assertEquals("AP-204", response.id());
                assertEquals("Dotun Adedotun", response.patientName());
                assertEquals("Severe chest pain and shortness of breath", response.symptoms());
                assertEquals("VNUM-028", response.verificationCode());
                assertEquals(AppointmentStatus.PENDING, response.appointmentStatus());
                assertEquals("HS-001A", response.hospitalId());
                verify(appointmentRepository, times(1)).save(any(Appointment.class));

        }

        @Test
        void test_that_create_appointment_throws_exception_when_hospital_is_not_found() {
                CreateAppointmentRequest createAppointmentRequest = new CreateAppointmentRequest(
                                "Ijioma Nissi",
                                "sour throat",
                                "Invalid id");
                when(hospitalRepository.findById("Invalid id")).thenReturn(Optional.empty());

                assertThrows(ResourceNotFoundException.class,
                                () -> appointmentService.createAppointmentRequest(createAppointmentRequest));

                verify(appointmentRepository, never()).save(any(Appointment.class));
        }

        @Test
        void test_should_return_all_appointments_abound_to_a_hospital() {
                AppointmentResponse expectedResponse = new AppointmentResponse(
                                "AP-204", "Dotun Adedotun", "Severe chest pain and shortness of breath",
                                "VNUM-028", AppointmentStatus.PENDING, "HS-001A", null, null);

                when(hospitalJpaRepository.existsById("HS-001A")).thenReturn(true);

                when(appointmentRepository.findByHospitalId("HS-001A")).thenReturn(List.of(mockAppointment));
                when(appointmentMapper.toAppointmentResponse(mockAppointment)).thenReturn(expectedResponse);

                List<AppointmentResponse> responses = appointmentService.getAppointmentsByHospital("HS-001A");

                assertFalse(responses.isEmpty());
                assertEquals(1, responses.size());
                assertEquals("AP-204", responses.get(0).id());
        }

        @Test
        void test_should_return_multiple_appointments_bound_to_a_hospital() {
                Appointment app1 = Appointment.builder()
                                .patientName("Dotun Adedotun")
                                .symptoms("Severe chest pain")
                                .verificationCode("VNUM-028")
                                .appointmentStatus(AppointmentStatus.PENDING)
                                .hospital(mockHospital)
                                .build();
                app1.setId("AP-204");

                Appointment app2 = Appointment.builder()
                                .patientName("Dotun Nissi")
                                .symptoms("Persistent high fever")
                                .verificationCode("VNUM-048")
                                .appointmentStatus(AppointmentStatus.PENDING)
                                .hospital(mockHospital)
                                .build();
                app2.setId("AP-284");

                AppointmentResponse response1 = new AppointmentResponse(
                                "AP-204", "Dotun Adedotun", "Severe chest pain",
                                "VNUM-028", AppointmentStatus.PENDING, "HS-001A", null, null);

                AppointmentResponse response2 = new AppointmentResponse(
                                "AP-284", "Dotun Nissi", "Persistent high fever",
                                "VNUM-048", AppointmentStatus.PENDING, "HS-001A", null, null);

                when(hospitalJpaRepository.existsById("HS-001A")).thenReturn(true);

                when(appointmentRepository.findByHospitalId("HS-001A")).thenReturn(List.of(app1, app2));

                when(appointmentMapper.toAppointmentResponse(app1)).thenReturn(response1);
                when(appointmentMapper.toAppointmentResponse(app2)).thenReturn(response2);

                List<AppointmentResponse> responses = appointmentService.getAppointmentsByHospital("HS-001A");

                assertNotNull(responses);
                assertEquals(2, responses.size(), "The service should have fetched exactly 2 records");

                assertEquals("AP-204", responses.get(0).id());
                assertEquals("Dotun Adedotun", responses.get(0).patientName());

                assertEquals("AP-284", responses.get(1).id());
                assertEquals("Dotun Nissi", responses.get(1).patientName());

                verify(appointmentRepository, times(1)).findByHospitalId("HS-001A");
        }

        @Test
        void test_should_successfully_verify_secure_appointment_code() {
                // mockAppointment starts as PENDING (set in @BeforeEach)
                when(appointmentRepository.findByVerificationCode("VNUM-048")).thenReturn(Optional.of(mockAppointment));
                when(appointmentRepository.save(any(Appointment.class))).thenReturn(mockAppointment);

                AppointmentResponse mockedResponse = new AppointmentResponse(
                                "AP-204", "Dotun Adedotun", "Severe chest pain and shortness of breath",
                                "VNUM-048", AppointmentStatus.CONFIRMED, "HS-001A", null, null);
                when(appointmentMapper.toAppointmentResponse(any(Appointment.class))).thenReturn(mockedResponse);

                AppointmentResponse response = appointmentService.verifyAppointmentCode("VNUM-048");

                assertNotNull(response);
                assertEquals(AppointmentStatus.CONFIRMED, response.appointmentStatus());
                verify(appointmentRepository, times(1)).save(any(Appointment.class));
        }
}
