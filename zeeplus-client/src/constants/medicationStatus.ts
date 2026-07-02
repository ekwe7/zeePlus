export const MEDICATION_STATUS = {
  PRESCRIBED: "prescribed",
  DISPENSED: "dispensed",
  PENDING_OTP: "pending_otp",
  CANCELLED: "cancelled",
} as const;

export type MedicationStatus =
  (typeof MEDICATION_STATUS)[keyof typeof MEDICATION_STATUS];
