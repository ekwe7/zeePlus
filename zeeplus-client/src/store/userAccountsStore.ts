import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/constants/roles";

export type EligibilityPlan = "BASIC" | "PREMIUM" | "EXPIRED";
export type HospitalStatus = "PENDING" | "ACTIVE" | "SUSPENDED";
export type RecordStatus = "ACTIVE" | "INACTIVE" | "DELETED";

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
  status: HospitalStatus | RecordStatus;
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
  updateEligibilityPlan: (
    userId: string,
    plan: string,
  ) => { success: boolean; error?: string };
  updateUserStatus: (
    userId: string,
    status: HospitalStatus | RecordStatus,
  ) => { success: boolean; error?: string };
}

const DEFAULT_ADMIN: UserAccount = {
  id: "admin-seed",
  name: "Admin",
  email: "admin@mediflow.com",
  password: "admin1234",
  role: "admin",
  status: "ACTIVE",
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

        // License number must be unique for hospitals
        if (payload.role === "admin" && payload.licenseNumber) {
          const licenseExists = users.some(
            (u) => u.licenseNumber === payload.licenseNumber,
          );
          if (licenseExists) {
            return {
              success: false,
              error: "License number already registered",
            };
          }
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
          // Hospitals start as PENDING, others as ACTIVE
          status: payload.role === "admin" ? "PENDING" : "ACTIVE",
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
            u.id === userId
              ? { ...u, eligibilityPlan: plan as EligibilityPlan }
              : u,
          ),
        }));
        return { success: true };
      },
      updateUserStatus: (userId, status) => {
        const { users } = get();
        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex === -1) {
          return { success: false, error: "User not found" };
        }
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status } : u,
          ),
        }));
        return { success: true };
      },
    }),
    { name: "user-accounts-storage" },
  ),
);
