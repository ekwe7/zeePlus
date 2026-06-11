package com.ekwe_hub.zeeplusserver.subscription;

import com.ekwe_hub.zeeplusserver.dto.request.CreateSubscriptionPlanRequest;
import com.ekwe_hub.zeeplusserver.dto.request.SubscribePatientRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PatientSubscriptionResponse;
import com.ekwe_hub.zeeplusserver.dto.response.SubscriptionPlanResponse;
import com.ekwe_hub.zeeplusserver.enums.HospitalAccessLevel;
import com.ekwe_hub.zeeplusserver.enums.SubscriptionStatus;
import com.ekwe_hub.zeeplusserver.enums.SubscriptionTier;
import com.ekwe_hub.zeeplusserver.exception.ResourceNotFoundException;
import com.ekwe_hub.zeeplusserver.model.Patient;
import com.ekwe_hub.zeeplusserver.model.PatientSubscription;
import com.ekwe_hub.zeeplusserver.model.SubscriptionPlan;
import com.ekwe_hub.zeeplusserver.repository.interfaces.PatientRepository;
import com.ekwe_hub.zeeplusserver.repository.interfaces.PatientSubscriptionRepository;
import com.ekwe_hub.zeeplusserver.repository.interfaces.SubscriptionPlanRepository;
import com.ekwe_hub.zeeplusserver.service.impl.SubscriptionServiceImpl;
import com.ekwe_hub.zeeplusserver.utils.mapper.subscriptionMapper.PatientSubscriptionMapper;
import com.ekwe_hub.zeeplusserver.utils.mapper.subscriptionMapper.SubscriptionPlanMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SubscriptionServiceImplTest {

    @Mock
    private SubscriptionPlanRepository subscriptionPlanRepository;
    @Mock
    private PatientSubscriptionRepository patientSubscriptionRepository;
    @Mock
    private PatientRepository patientRepository;

    @Spy
    private SubscriptionPlanMapper subscriptionPlanMapper;
    @Spy
    private PatientSubscriptionMapper patientSubscriptionMapper;
    @InjectMocks
    private SubscriptionServiceImpl subscriptionService;
    private Patient mockPatient;
    private PatientSubscription mockPatientSubscription;
    private SubscriptionPlan mockSubscriptionPlan;
    private PatientSubscription mockSavedSubscription;
    private String patientId;
    private String planId;
    private String paymentRef;
    private SubscribePatientRequest request;

    @BeforeEach
    void subscriptionService() {
        mockPatient = new Patient();
        mockPatient.setId("PAT-001A");
        mockPatient.setUsername("Ekwe Uche");
        mockPatient.setEmail("uche@gmail.com");

        mockSubscriptionPlan = SubscriptionPlan.builder()
                .planName("ZeeCare Premium Gold")
                .tier(SubscriptionTier.PREMIUM)
                .price(new BigDecimal("250000.00"))
                .coverageLimit(new BigDecimal("2000000"))
                .isActive(true)
                .build();
        mockSubscriptionPlan.setId("ZEE-031-PLAN");

        mockPatientSubscription = PatientSubscription.builder()
                .patient(mockPatient)
                .subscriptionPlan(mockSubscriptionPlan)
                .startDate(LocalDateTime.now().plusYears(1))
                .status(SubscriptionStatus.ACTIVE)
                .paymentReference("TX-FLW-8827361")
                .build();
        mockPatientSubscription.setId("31A-SUBS");

        patientId = "PAT-001A";
        planId = "ZEE-031-PLAN";
        paymentRef = "TX-FLW-8827361";

        request = new SubscribePatientRequest(patientId, planId, paymentRef);

        mockSavedSubscription = PatientSubscription.builder()
                .patient(mockPatient)
                .subscriptionPlan(mockSubscriptionPlan)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusYears(1))
                .status(SubscriptionStatus.ACTIVE)
                .paymentReference(paymentRef)
                .build();
        mockSavedSubscription.setId("SUB-UUID-001");
    }

     @Test
         void createPlan_ShouldSuccessfullySavePlan_WhenNameIsUnique() {
         CreateSubscriptionPlanRequest request = new CreateSubscriptionPlanRequest(
         "ZeeCare Premium Gold",
                 SubscriptionTier.PREMIUM,
                 new BigDecimal("150000.00"),
                 new BigDecimal("2000000.00"),
                new BigDecimal("300000.00"),
                 HospitalAccessLevel.PRE_APPROVED_PRIVATE,
                 true
     );

         when(subscriptionPlanRepository.findByPlanNameIgnoreCase("ZeeCare Premium Gold")).thenReturn(Optional.empty());
         when(subscriptionPlanRepository.save(any(SubscriptionPlan.class))).thenReturn(mockSubscriptionPlan);

         SubscriptionPlanResponse response =
         subscriptionService.createSubscriptionPlan(request);

         assertNotNull(response);
         assertEquals("ZeeCare Premium Gold", response.planName());
         assertEquals(SubscriptionTier.PREMIUM, response.tier());
     }

    @Test
    void test_that_patient_can_succefully_subscribe_to_a_plan() {

        when(patientRepository.findById(patientId)).thenReturn(Optional.of(mockPatient));
        when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(mockSubscriptionPlan));
        when(patientSubscriptionRepository.findActiveSubscription(patientId)).thenReturn(Optional.empty());
        when(patientSubscriptionRepository.findByPaymentReference(paymentRef)).thenReturn(Optional.empty());
        when(patientSubscriptionRepository.save(any(PatientSubscription.class))).thenReturn(mockSavedSubscription);

        PatientSubscriptionResponse response = subscriptionService.purchaseSubscription(request);

        assertNotNull(response);
        assertEquals("SUB-UUID-001", response.id());
        assertEquals(patientId, response.patientId());
        assertEquals("Ekwe Uche", response.patientName());
        assertEquals(planId, response.planId());
        assertEquals("ZeeCare Premium Gold", response.planName());
        assertEquals(SubscriptionStatus.ACTIVE, response.status());
        assertEquals(paymentRef, response.paymentReference());
    }

    @Test
    void test_that_when_subscription_expires_throws_exception() {

        String patientId = "PAT-111";

        when(patientRepository.existsById(patientId)).thenReturn(true);

        // The database returns empty because the JPQL condition (endDate > CURRENT_TIMESTAMP) fails
        when(patientSubscriptionRepository.findActiveSubscription(patientId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                subscriptionService.getActivePatientSubscription(patientId)
        );

        // Assert that the domain error messaging match your service layer specifications
        assertEquals("No active subscription plan contract found for this patient ID. Access Denied.", exception.getMessage());

    }

    @Test
    void test_that_purchasing_new_plan_while_having_active_subscription_throws_exception() {

        String patientId = "PAT-111";
        String planId = "PLAN-999";
        SubscribePatientRequest request = new SubscribePatientRequest(patientId, planId, "TX-FLW-DUP");

        Patient mockPatient = new Patient();
        mockPatient.setId(patientId);

        SubscriptionPlan mockPlan = SubscriptionPlan.builder().isActive(true).build();
        mockPlan.setId(planId);
        mockPlan.setPlanName("ZeeCare Gold");

        PatientSubscription runningSubscription = PatientSubscription.builder()
                .subscriptionPlan(mockPlan)
                .endDate(LocalDateTime.now().plusMonths(7))
                .build();

        when(patientRepository.findById(patientId)).thenReturn(Optional.of(mockPatient));
        when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(mockPlan));
        when(patientSubscriptionRepository.findActiveSubscription(patientId)).thenReturn(Optional.of(runningSubscription));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                subscriptionService.purchaseSubscription(request)
        );

        assertTrue(exception.getMessage().contains("Patient currently has an active 'ZeeCare Gold' subscription"));

    }



}
