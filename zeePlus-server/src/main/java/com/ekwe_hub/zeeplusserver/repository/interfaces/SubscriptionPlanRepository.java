package com.ekwe_hub.zeeplusserver.repository.interfaces;

import com.ekwe_hub.zeeplusserver.enums.SubscriptionTier;
import com.ekwe_hub.zeeplusserver.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, String> {
    Optional<SubscriptionPlan> findByPlanNameIgnoreCase(String planName);
    List<SubscriptionPlan> findByIsActiveTrue();
    Optional<SubscriptionPlan> findByTierAndIsActiveTrue(SubscriptionTier tier);
    List<SubscriptionPlan> findByPriceLessThanEqualAndIsActiveTrue(BigDecimal maxPrice);
}
