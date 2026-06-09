package com.ekwe_hub.zeeplusserver.controller;

import com.ekwe_hub.zeeplusserver.dto.request.CreateSubscriptionPlanRequest;
import com.ekwe_hub.zeeplusserver.dto.request.SubscribePatientRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PatientSubscriptionResponse;
import com.ekwe_hub.zeeplusserver.dto.response.SubscriptionPlanResponse;
import com.ekwe_hub.zeeplusserver.service.interfaces.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @PostMapping("/plans")
    public ResponseEntity<SubscriptionPlanResponse> createPlan(@RequestBody CreateSubscriptionPlanRequest request) {
        SubscriptionPlanResponse response = subscriptionService.createSubscriptionPlan(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanResponse>> getActivePlans() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptionPlans());
    }

    @PostMapping("/purchase")
    public ResponseEntity<PatientSubscriptionResponse> purchaseSubscription(
            @RequestBody SubscribePatientRequest request) {
        PatientSubscriptionResponse response = subscriptionService.purchaseSubscription(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/patient/{patientId}/active")
    public ResponseEntity<PatientSubscriptionResponse> getActiveSubscription(@PathVariable String patientId) {
        return ResponseEntity.ok(subscriptionService.getActivePatientSubscription(patientId));
    }

    @GetMapping("/plans/search")
    public ResponseEntity<List<SubscriptionPlanResponse>> getPlansUnderBudget(
            @RequestParam BigDecimal maxPrice) {
        List<SubscriptionPlanResponse> responses = subscriptionService.getActivePlansUnderBudget(maxPrice);
        return ResponseEntity.ok(responses);
    }

}
