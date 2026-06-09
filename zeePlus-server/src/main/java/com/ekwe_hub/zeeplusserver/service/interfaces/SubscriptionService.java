package com.ekwe_hub.zeeplusserver.service.interfaces;

import com.ekwe_hub.zeeplusserver.dto.request.CreateSubscriptionPlanRequest;
import com.ekwe_hub.zeeplusserver.dto.request.SubscribePatientRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PatientSubscriptionResponse;
import com.ekwe_hub.zeeplusserver.dto.response.SubscriptionPlanResponse;

import java.math.BigDecimal;
import java.util.List;

public interface SubscriptionService {
    SubscriptionPlanResponse createSubscriptionPlan(CreateSubscriptionPlanRequest subscriptionPlanRequest);
    List<SubscriptionPlanResponse> getAllSubscriptionPlans();
    PatientSubscriptionResponse purchaseSubscription(SubscribePatientRequest subscriptionRequest);
    PatientSubscriptionResponse getActivePatientSubscription(String patientId);
    List<SubscriptionPlanResponse> getActivePlansUnderBudget(BigDecimal maxPrice);


}
