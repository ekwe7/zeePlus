import type { AppointmentStatus } from "@/constants/appointmentStatus";

export interface Appointment {
  id: string;
  code: string;
  patientName: string;
  patientId: string;
  doctorName?: string;
  doctorId?: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
}
