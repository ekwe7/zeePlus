# Zee Access Care — Hospital Module README

# Overview

The Hospital Module is one of the core systems inside Zee Access Care.

This module allows hospitals to onboard into the Zee Access Care ecosystem, manage patient appointments, assign doctors, submit treatment reports, upload prescriptions, and interact with the HMO authorization system.

The goal of this module is to help hospitals operate efficiently while maintaining secure, transparent, and fraud-resistant healthcare workflows.

---

# Hospital Responsibilities

Hospitals inside Zee Access Care can:

* Create and manage hospital accounts
* Receive patient appointment requests
* Verify appointment codes
* Review patient symptoms
* Assign doctors to patients
* Update appointment status
* Submit treatment reports
* Upload prescriptions
* Access patient medical history (EMR)
* Request laboratory tests
* Submit HMO claims
* Receive authorization approvals
* Monitor payment settlements
* Manage hospital staff
* Receive notifications and alerts

---

# Core Features

## 1. Hospital Registration

Hospitals can create an account on the platform.

### Required Information

* Hospital Name
* Email Address
* Phone Number
* Address
* License Number
* Hospital Type
* Password

### Validation Rules

* Email must be unique
* License number must be unique
* Hospital must be verified before activation

### Status Flow

```text
PENDING → ACTIVE → SUSPENDED
```

---

# 2. Appointment Management

Hospitals receive appointment requests submitted by patients.

### Hospital Can:

* View pending appointments
* Verify appointment codes
* Accept or reject appointments
* Assign doctors
* Reschedule appointments
* Cancel appointments
* Mark appointments as completed

### Appointment Status

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
NO_SHOW
```

### Example Appointment Code

```text
HMO-APT-48392
```

---

# 3. Doctor Assignment

Hospitals control doctor allocation.

Patients do not directly choose doctors.

### Hospital Can:

* Assign available doctors
* Match doctors based on symptoms
* Reassign doctors
* Track doctor availability
* Monitor consultation progress

---

# 4. Prescription Management

After consultation:

### Hospital/Doctor Can:

* Upload prescriptions
* Submit medication requests
* Approve treatment plans
* Update patient diagnosis

### System Automatically:

* Validates subscription eligibility
* Checks medication access level
* Generates OTP pickup code

---

# 5. Electronic Medical Records (EMR)

Hospitals can access patient medical records.

### Includes:

* Medical history
* Diagnosis history
* Allergies
* Prescriptions
* Lab results
* Scan reports
* Doctor notes
* Hospital visit records

---

# 6. Laboratory Integration

Hospitals can:

* Request lab tests
* Upload lab results
* Upload scan results
* Review diagnostics
* Link reports to patient records

---

# 7. HMO Authorization System

Before treatment:

The hospital can verify whether treatment is covered by the patient subscription plan.

### Authorization Engine Handles:

* Coverage validation
* Treatment approval
* Drug eligibility
* Claims approval

---

# 8. Claims Management

Hospitals can submit claims for:

* Consultation
* Medication
* Laboratory tests
* Procedures
* Specialist care

### Claim Status

```text
PENDING
APPROVED
REJECTED
UNDER_REVIEW
```

---

# 9. Notification System

Hospitals receive notifications for:

* New appointments
* Appointment cancellations
* Prescription approvals
* Claim approvals
* Payment settlements
* OTP confirmations
* Fraud alerts

---

# 10. Fraud Detection

The system automatically monitors suspicious activities.

### Detects:

* Duplicate claims
* Fake prescriptions
* Repeated medication requests
* Unusual appointment patterns
* Abnormal hospital activity

---

# 11. Payment & Subscription

Hospitals must:

* Pay onboarding fee
* Pay yearly SaaS subscription fee

### Hospitals Can Monitor:

* Payment history
* Subscription status
* Claims settlements
* Revenue reports

---

# Technical Architecture

## Backend Stack

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* PostgreSQL
* JWT Authentication

---

# Suggested Package Structure

```text
com.ekwe_hub.zeeplusserver
│
├── controller
├── dto
│   ├── request
│   └── response
│
├── mapper
├── model
├── repository
│   └── impl
├── service
│   └── impl
├── types
├── exception
└── config
```

---

# Main Hospital Entity

```java
Hospital
```

### Core Attributes

* id
* hospitalName
* email
* phoneNumber
* address
* licenseNumber
* status
* createdAt
* updatedAt
* createdBy

---

# Main Enums

## HospitalStatus

```java
PENDING,
ACTIVE,
SUSPENDED
```

## AppointmentStatus

```java
PENDING,
CONFIRMED,
CANCELLED,
COMPLETED,
NO_SHOW
```

## RecordStatus

```java
ACTIVE,
INACTIVE,
DELETED
```

---

# Future Expansion

Future versions of the Hospital Module will include:

* Telemedicine
* AI-assisted diagnosis
* Smart doctor scheduling
* Real-time hospital analytics
* Voice/video consultation
* API integration with insurance providers
* Multi-hospital management
* Advanced fraud intelligence

---

# Goal

The Hospital Module is designed to become the operational backbone for healthcare providers inside Zee Access Care.

It enables secure healthcare delivery, improves patient coordination, reduces fraud, and creates a scalable digital healthcare infrastructure for Nigeria and Africa.
