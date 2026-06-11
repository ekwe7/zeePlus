package com.ekwe_hub.zeeplusserver.model;

import com.ekwe_hub.zeeplusserver.enums.HospitalAccessLevel;
import com.ekwe_hub.zeeplusserver.enums.SubscriptionTier;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SubscriptionPlan extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "plan_name", nullable = false)
    private String planName;

    @Enumerated(EnumType.STRING)
    @Column(name = "tier", nullable = false)
    private SubscriptionTier tier;

    @Column(name = "plan_price", nullable = false)
    private BigDecimal price;

    @Column(name = "coverage_limit", nullable = false)
    private BigDecimal coverageLimit;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Column(name = "medication_coverage_limit", nullable = false)
    private BigDecimal medicationCoverageLimit;

    @Enumerated(EnumType.STRING)
    @Column(name = "hospital_access_level", nullable = false)
    private HospitalAccessLevel hospitalAccessLevel;

    @Column(name = "allow_specialist_access", nullable = false)
    private boolean allowSpecialistAccess;
}
