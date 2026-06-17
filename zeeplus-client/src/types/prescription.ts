export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  disease: string;
  medications: { name: string; dosage: string; duration: string }[];
  issuedAt: string;
  upgraded?: boolean;
}
