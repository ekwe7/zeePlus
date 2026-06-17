import { create } from "zustand";
import type { Claim } from "@/types/claim";

const seedClaims: Claim[] = [
  {
    id: "c1",
    patientName: "Jane Doe",
    amount: 320,
    plan: "Premium Care",
    status: "APPROVED",
    submittedAt: "2026-05-10",
  },
  {
    id: "c2",
    patientName: "John Roe",
    amount: 145,
    plan: "Basic Care",
    status: "PENDING",
    submittedAt: "2026-05-12",
  },
  {
    id: "c3",
    patientName: "Alex Kim",
    amount: 980,
    plan: "Premium Care",
    status: "FLAGGED",
    submittedAt: "2026-05-14",
  },
];

interface State {
  claims: Claim[];
  updateClaim: (id: string, patch: Partial<Claim>) => void;
}

export const useReportStore = create<State>((set) => ({
  claims: seedClaims,
  updateClaim: (id, patch) =>
    set((s) => ({ claims: s.claims.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
}));
