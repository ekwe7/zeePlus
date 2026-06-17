import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/constants/roles";

export type EligibilityPlan = "BASIC" | "PREMIUM" | "EXPIRED";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  eligibilityPlan?: EligibilityPlan;
  // Hospital specific fields
  phoneNumber?: string;
  address?: string;
  licenseNumber?: string;
  hospitalType?: string;
  createdAt: string;
  createdBy: string;
}

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  createdBy: string;
  phoneNumber?: string;
  address?: string;
  licenseNumber?: string;
  hospitalType?: string;
}

interface CreateUserResult {
  success: boolean;
  error?: string;
}

interface UserAccountsState {
  users: UserAccount[];
  createUser: (payload: CreateUserPayload) => CreateUserResult;
  updateEligibilityPlan: (userId: string, plan: string) => { success: boolean; error?: string };
}

const DEFAULT_ADMIN: UserAccount = {
  id: "admin-seed",
  name: "Admin",
  email: "admin@mediflow.com",
  password: "admin1234",
  role: "admin",
  createdAt: new Date().toISOString(),
  createdBy: "system",
};

export const useUserAccountsStore = create<UserAccountsState>()(
  persist(
    (set, get) => ({
      users: [DEFAULT_ADMIN],
      createUser: (payload) => {
        const { users } = get();
        const emailExists = users.some(
          (u) => u.email.toLowerCase() === payload.email.toLowerCase(),
        );
        if (emailExists) {
          return { success: false, error: "Email already in use" };
        }
        const newUser: UserAccount = {
          id: crypto.randomUUID(),
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role,
          ...(payload.role === "patient" ? { eligibilityPlan: "BASIC" } : {}),
          // Add hospital specific fields if they exist
          phoneNumber: payload.phoneNumber,
          address: payload.address,
          licenseNumber: payload.licenseNumber,
          hospitalType: payload.hospitalType,
          createdAt: new Date().toISOString(),
          createdBy: payload.createdBy,
        };
        set((state) => ({ users: [...state.users, newUser] }));
        return { success: true };
      },
      updateEligibilityPlan: (userId, plan) => {
        const validPlans: EligibilityPlan[] = ["BASIC", "PREMIUM", "EXPIRED"];
        if (!validPlans.includes(plan as EligibilityPlan)) {
          return { success: false, error: "Invalid plan" };
        }
        const { users } = get();
        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex === -1) {
          return { success: false, error: "User not found" };
        }
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, eligibilityPlan: plan as EligibilityPlan } : u,
          ),
        }));
        return { success: true };
      },
    }),
    { name: "user-accounts-storage" },
  ),
);
