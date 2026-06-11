package com.ekwe_hub.zeeplusserver.service.impl;

import com.ekwe_hub.zeeplusserver.dto.request.CreateSubscriptionPlanRequest;
import com.ekwe_hub.zeeplusserver.dto.request.SubscribePatientRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PatientSubscriptionResponse;
import com.ekwe_hub.zeeplusserver.dto.response.SubscriptionPlanResponse;
import com.ekwe_hub.zeeplusserver.enums.SubscriptionStatus;
import com.ekwe_hub.zeeplusserver.exception.ResourceNotFoundException;
import com.ekwe_hub.zeeplusserver.model.Patient;
import com.ekwe_hub.zeeplusserver.model.PatientSubscription;
import com.ekwe_hub.zeeplusserver.model.SubscriptionPlan;
import com.ekwe_hub.zeeplusserver.repository.interfaces.PatientRepository;
import com.ekwe_hub.zeeplusserver.repository.interfaces.PatientSubscriptionRepository;
import com.ekwe_hub.zeeplusserver.repository.interfaces.SubscriptionPlanRepository;
import com.ekwe_hub.zeeplusserver.service.interfaces.SubscriptionService;
import com.ekwe_hub.zeeplusserver.utils.mapper.subscriptionMapper.SubscriptionPlanMapper;
import com.ekwe_hub.zeeplusserver.utils.mapper.subscriptionMapper.PatientSubscriptionMapper;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class SubscriptionServiceImpl implements SubscriptionService {
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final PatientRepository patientRepository;
    private final SubscriptionPlanMapper subscriptionPlanMapper;
    private final PatientSubscriptionRepository patientSubscriptionRepository;
    private final PatientSubscriptionMapper patientSubscriptionMapper;

    @Override
    @Transactional
    public SubscriptionPlanResponse createSubscriptionPlan(CreateSubscriptionPlanRequest request) {
        String normalizedName = request.planName().trim();

        if (subscriptionPlanRepository.findByPlanNameIgnoreCase(normalizedName).isPresent()) {
            throw new IllegalArgumentException(
                    "A subscription plan tier with the name '" + normalizedName + "' already exists.");
        }

        if (request.price().compareTo(BigDecimal.ZERO) < 0 || request.coverageLimit().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Plan pricing and annual medical coverage thresholds must be positive values.");
        }

        if (request.price().compareTo(BigDecimal.ZERO) < 0 ||
        request.coverageLimit().compareTo(BigDecimal.ZERO) <= 0 ||
        request.medicationCoverageLimit().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Plan pricing and annual medical coverage thresholds must be positive values.");
        }

        SubscriptionPlan planEntity = subscriptionPlanMapper.toEntity(request);
        SubscriptionPlan savedPlan = subscriptionPlanRepository.save(planEntity);

        return subscriptionPlanMapper.toResponse(savedPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionPlanResponse> getAllSubscriptionPlans() {
        return subscriptionPlanRepository.findByIsActiveTrue().stream()
                .map(subscriptionPlanMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionPlanResponse> getActivePlansUnderBudget(BigDecimal maxPrice) {
        if (maxPrice == null || maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Budget ceiling threshold must be a valid non-negative amount.");
        }

        return subscriptionPlanRepository.findByPriceLessThanEqualAndIsActiveTrue(maxPrice).stream()
                .map(subscriptionPlanMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PatientSubscriptionResponse purchaseSubscription(SubscribePatientRequest request) {
        // 1. Fetch and Validate the Patient Entity exists
        Patient patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient account not found with ID: " + request.patientId()));

        // 2. Fetch and Validate the Plan Blueprint target exists and is active
        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.planId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Target Subscription Plan not found with ID: " + request.planId()));

        if (!plan.isActive()) {
            throw new IllegalStateException(
                    "The selected subscription tier has been deprecated by system administrators.");
        }

        // 3. System Guard: Check for an existing running subscription to prevent
        // double-billing
        patientSubscriptionRepository.findActiveSubscription(patient.getId()).ifPresent(activeSub -> {
            throw new IllegalStateException(
                    "Patient currently has an active '" + activeSub.getSubscriptionPlan().getPlanName() +
                            "' subscription running until " + activeSub.getEndDate().toLocalDate()
                            + ". Upgrade or renew closer to expiration.");
        });

        // 4. Payment Verification Guard: Check if reference string has already been
        // captured by database
        if (request.paymentReference() == null || request.paymentReference().trim().isEmpty()) {
            throw new IllegalArgumentException("A valid external payment gateway processing reference is required.");
        }

        if (patientSubscriptionRepository.findByPaymentReference(request.paymentReference().trim()).isPresent()) {
            throw new IllegalArgumentException(
                    "Transaction conflict: This payment reference identifier has already been processed.");
        }

        // 5. Map and Enforce Strict Annual Coverage Terms via Entity instantiation
        PatientSubscription newSubscription = patientSubscriptionMapper.toEntity(patient, plan,
                request.paymentReference());

        // Explicitly ensuring state updates lock correctly
        newSubscription.setStartDate(LocalDateTime.now());
        newSubscription.setEndDate(LocalDateTime.now().plusYears(1)); // Strict annual policy enforcement
        newSubscription.setStatus(SubscriptionStatus.ACTIVE);

        PatientSubscription savedSubscription = patientSubscriptionRepository.save(newSubscription);
        return patientSubscriptionMapper.toResponse(savedSubscription);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientSubscriptionResponse getActivePatientSubscription(String patientId) {
        // Double check existence to avoid throwing empty states for missing users
        // versus users who simply have no plans
        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException("Patient profile not found with ID: " + patientId);
        }

        PatientSubscription activeSub = patientSubscriptionRepository.findActiveSubscription(patientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No active subscription plan contract found for this patient ID. Access Denied."));

        return patientSubscriptionMapper.toResponse(activeSub);
    }

}
