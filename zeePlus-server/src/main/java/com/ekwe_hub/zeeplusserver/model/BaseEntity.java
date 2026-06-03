package com.ekwe_hub.zeeplusserver.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Persistent;

import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@MappedSuperclass
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id; // Keep as String since you are using UUID generation!

    private String createdAt;
    private String updatedAt;
    private String createdBy;

    @PrePersist
    private void onCreate() {
        this.createdAt = ZonedDateTime.now().toString();
        this.updatedAt = ZonedDateTime.now().toString();
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedAt = ZonedDateTime.now().toString();
    }

}
