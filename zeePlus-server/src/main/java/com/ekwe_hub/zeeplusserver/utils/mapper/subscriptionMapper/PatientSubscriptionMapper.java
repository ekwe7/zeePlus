package com.ekwe_hub.zeeplusserver.utils.mapper.subscriptionMapper;

import com.ekwe_hub.zeeplusserver.dto.response.PatientSubscriptionResponse;
import com.ekwe_hub.zeeplusserver.enums.SubscriptionStatus;
import com.ekwe_hub.zeeplusserver.model.Patient;
import com.ekwe_hub.zeeplusserver.model.PatientSubscription;
import com.ekwe_hub.zeeplusserver.model.SubscriptionPlan;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PatientSubscriptionMapper {

    public PatientSubscription toEntity(Patient patient, SubscriptionPlan subscriptionPlan, String paymentReference) {
        if (patient == null || subscriptionPlan == null)
            return null;

        LocalDateTime now = LocalDateTime.now();

        return PatientSubscription.builder()
                .patient(patient)
                .subscriptionPlan(subscriptionPlan)
                .startDate(now)
                .endDate(now.plusYears(1))
                .status(SubscriptionStatus.ACTIVE)
                .paymentReference(paymentReference != null ? paymentReference.trim() : null)
                .build();

    }

    public PatientSubscriptionResponse toResponse(PatientSubscription subscription) {
        if (subscription == null)
            return null;

        return new PatientSubscriptionResponse(
                subscription.getId(),
                subscription.getPatient().getId(),
                subscription.getPatient().getUsername(),
                subscription.getSubscriptionPlan().getId(),
                subscription.getSubscriptionPlan().getPlanName(),
                subscription.getStartDate(),
                subscription.getEndDate(),
                subscription.getStatus(),
                subscription.getPaymentReference());

    }

}
