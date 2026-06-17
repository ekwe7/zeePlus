export interface OTPRecord {
  id: string;
  patientId: string;
  prescriptionId: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}
