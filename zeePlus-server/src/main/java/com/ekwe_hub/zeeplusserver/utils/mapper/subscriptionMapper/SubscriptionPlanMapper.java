package com.ekwe_hub.zeeplusserver.utils.mapper.subscriptionMapper;

import com.ekwe_hub.zeeplusserver.dto.request.CreateSubscriptionPlanRequest;
import com.ekwe_hub.zeeplusserver.dto.response.SubscriptionPlanResponse;
import com.ekwe_hub.zeeplusserver.model.SubscriptionPlan;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionPlanMapper {
    public SubscriptionPlan toEntity(CreateSubscriptionPlanRequest request) {
        if (request == null)
            return null;

        return SubscriptionPlan.builder()
                .planName(request.planName().trim())
                .tier(request.tier())
                .price(request.price())
                .coverageLimit(request.coverageLimit())
                .isActive(true)
                .build();
    }

    public SubscriptionPlanResponse toResponse(SubscriptionPlan subscriptionPlan) {
        if (subscriptionPlan == null)
            return null;

        return new SubscriptionPlanResponse(
                subscriptionPlan.getId(),
                subscriptionPlan.getPlanName(),
                subscriptionPlan.getTier(),
                subscriptionPlan.getPrice(),
                subscriptionPlan.getCoverageLimit(),
                subscriptionPlan.isActive());

    }

}
