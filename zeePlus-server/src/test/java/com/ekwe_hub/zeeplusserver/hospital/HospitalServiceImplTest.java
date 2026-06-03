package com.ekwe_hub.zeeplusserver.hospital;

import com.ekwe_hub.zeeplusserver.dto.request.CreateHospitalRequest;
import com.ekwe_hub.zeeplusserver.dto.response.HospitalResponse;
import com.ekwe_hub.zeeplusserver.enums.HospitalStatus;
import com.ekwe_hub.zeeplusserver.utils.mapper.hospitalMapper.HospitalMapper;
import com.ekwe_hub.zeeplusserver.model.Hospital;
import com.ekwe_hub.zeeplusserver.repository.interfaces.HospitalRepository;
import com.ekwe_hub.zeeplusserver.service.impl.HospitalServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class HospitalServiceImplTest {

    @Mock
    private HospitalRepository hospitalRepository;
    @Spy
    private HospitalMapper hospitalMapper;
    @InjectMocks
    private HospitalServiceImpl hospitalService;
    private CreateHospitalRequest request;

    @BeforeEach
    void hospitalService() {
        request = new CreateHospitalRequest(
                "St Theresa Hopital",
                "contact@theresa.ng",
                "+2348133900781",
                "Iffite Mmaku",
                "REG-STN-882");
    }

    @Test
    void test_that_hospital_should_successfully_create_account() {
        when(hospitalRepository.findByEmail(request.email())).thenReturn(Optional.empty());
        when(hospitalRepository.findByLicenseNumber(request.licenseNumber())).thenReturn(Optional.empty());

        Hospital savedHospital = hospitalMapper.toEntity(request);
        savedHospital.setId("01L");

        when(hospitalRepository.save(any(Hospital.class))).thenReturn(savedHospital);

        HospitalResponse response = hospitalService.addHospital(request);

        assertNotNull(response);
        assertEquals("01L", response.id());
        assertEquals("contact@theresa.ng", response.email());
        assertEquals(HospitalStatus.PENDING.name(), response.status());

        verify(hospitalRepository, times(1)).save(any(Hospital.class));

    }

    @Test
    void test_that_multiple_hospital_can_be_created() {
        CreateHospitalRequest request1 = new CreateHospitalRequest(
                "St Mark Hopital",
                "contact@mark.xyz",
                "+2348136720781",
                "Yaba Lagos",
                "REG-STN-882"
        );

        CreateHospitalRequest request2 = new CreateHospitalRequest(
                "St Leo Hopital",
                "contact@leo.com",
                "+2348156700781",
                "Transeculu Enugu",
                "REG-STN-882"
        );

        when(hospitalRepository.findByEmail(request1.email())).thenReturn(Optional.empty());
        when(hospitalRepository.findByLicenseNumber(request1.licenseNumber())).thenReturn(Optional.empty());

        when(hospitalRepository.findByEmail(request2.email())).thenReturn(Optional.empty());
        when(hospitalRepository.findByLicenseNumber(request2.licenseNumber())).thenReturn(Optional.empty());

        Hospital savedHospital1 = hospitalMapper.toEntity(request1);
        savedHospital1.setId("012L");

        Hospital savedHospital2 = hospitalMapper.toEntity(request2);
        savedHospital2.setId("013L");

        when(hospitalRepository.save(any(Hospital.class))).thenReturn(savedHospital1, savedHospital2);

        HospitalResponse response1 = hospitalService.addHospital(request1);
        HospitalResponse response2 = hospitalService.addHospital(request2);

        assertNotNull(response1);
        assertNotNull(response2);
        assertEquals("012L", response1.id());
        assertEquals("013L", response2.id());
        assertEquals("contact@leo.com", response2.email());
        assertEquals("contact@mark.xyz", response1.email());
        assertEquals(HospitalStatus.PENDING.name(), response1.status());
        assertEquals(HospitalStatus.PENDING.name(), response2.status());

        verify(hospitalRepository, times(2)).save(any(Hospital.class));
    }


    @Test
    void test_that_license_number_exists_throws_exception() {
        Hospital existingHospital = new Hospital();
        when(hospitalRepository.findByLicenseNumber(request.licenseNumber()))
                .thenReturn(Optional.of(existingHospital));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            hospitalService.addHospital(request);
        });

        assertEquals("Hospital registration number already exists", exception.getMessage());

        // Ensure it blocked the save operation safely
        verify(hospitalRepository, never()).save(any(Hospital.class));

    }

    @Test
    void test_that_email_exists_throws_exception() {
        Hospital existingHospital = new Hospital();
        when(hospitalRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(existingHospital));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->{
            hospitalService.addHospital(request);
        });

        assertEquals("Email already exists", exception.getMessage());
        verify(hospitalRepository, never()).save(any(Hospital.class));
    }

}
