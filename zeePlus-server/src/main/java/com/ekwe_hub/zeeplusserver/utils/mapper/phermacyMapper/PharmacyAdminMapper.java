package com.ekwe_hub.zeeplusserver.utils.mapper.phermacyMapper;

import com.ekwe_hub.zeeplusserver.dto.request.CreatePharmacyRequest;
import com.ekwe_hub.zeeplusserver.dto.response.PharmacyResponse;
import com.ekwe_hub.zeeplusserver.enums.PharmacyStatus;
import com.ekwe_hub.zeeplusserver.enums.UserRole;
import com.ekwe_hub.zeeplusserver.model.Pharmacy;
import org.springframework.stereotype.Component;

@Component
public class PharmacyAdminMapper {
    public Pharmacy toEntity(CreatePharmacyRequest pharmacyRequest, String encodedPassword) {
        if (pharmacyRequest == null)
            return null;

        return Pharmacy.builder()
                .username(pharmacyRequest.pharmacyName().trim())
                .pharmacyName(pharmacyRequest.pharmacyName().trim())
                .email(pharmacyRequest.email().toLowerCase().trim())
                .password(encodedPassword)
                .userRole(UserRole.PHARMACY_ADMIN)
                .phoneNumber(pharmacyRequest.phoneNumber().trim())
                .licenseNumber(pharmacyRequest.licenseNumber().trim())
                .address(pharmacyRequest.address().trim())
                .pharmacyStatus(PharmacyStatus.PENDING)
                .build();
    }

    public PharmacyResponse toPharmacyAdmin(Pharmacy pharmacy) {
        if (pharmacy == null)
            return null;

        return new PharmacyResponse(
                pharmacy.getId(),
                pharmacy.getPharmacyName(),
                pharmacy.getEmail(),
                pharmacy.getPhoneNumber(),
                pharmacy.getLicenseNumber(),
                pharmacy.getAddress(),
                pharmacy.getPharmacyStatus());
    }
}
