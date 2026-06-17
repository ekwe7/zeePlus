export interface Claim {
  id: string;
  patientName: string;
  amount: number;
  plan: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED" | "UNDER_REVIEW";
  submittedAt: string;
}
