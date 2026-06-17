export const ROLES = {
  PATIENT: "patient",
  ADMIN: "admin",
  DOCTOR: "doctor",
  PHARMACIST: "pharmacist",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  patient: "Patient",
  admin: "Hospital Admin",
  doctor: "Doctor",
  pharmacist: "Pharmacist",
};

export const ROLE_DASHBOARD: Record<Role, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  pharmacist: "/pharmacist/dashboard",
  admin: "/admin/dashboard",
};
