import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/constants/roles";
import { useUserAccountsStore } from "@/store/userAccountsStore";

interface LoginPayload {
  email: string;
  password: string;
  allowAdmin: boolean;
}

interface LoginResult {
  success: boolean;
  role?: Role;
  error?: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  phoneNumber?: string;
  address?: string;
  licenseNumber?: string;
  hospitalType?: string;
}

interface RegisterResult {
  success: boolean;
  error?: string;
}

interface AuthState {
  id: string | null;
  role: Role | null;
  name: string;
  email: string | null;
  isAuthenticated: boolean;
  setRole: (role: Role, name?: string) => void;
  login: (payload: LoginPayload) => LoginResult;
  register: (payload: RegisterPayload) => RegisterResult;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: null,
      role: null,
      name: "Guest",
      email: null,
      isAuthenticated: false,

      setRole: (role, name = "Demo User") => set({ role, name, id: "demo-id" }),

      login: (payload) => {
        const { users } = useUserAccountsStore.getState();
        const user = users.find(
          (u) =>
            u.email.toLowerCase() === payload.email.toLowerCase() &&
            u.password === payload.password,
        );

        if (!user) {
          return { success: false, error: "Invalid email or password." };
        }

        if (!payload.allowAdmin && user.role === "admin") {
          return {
            success: false,
            error: "Admin accounts must sign in at /admin/auth.",
          };
        }

        set({
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          isAuthenticated: true,
        });
        return { success: true, role: user.role };
      },

      register: (payload) => {
        const result = useUserAccountsStore.getState().createUser({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role,
          phoneNumber: payload.phoneNumber,
          address: payload.address,
          licenseNumber: payload.licenseNumber,
          hospitalType: payload.hospitalType,
          createdBy: "self",
        });

        if (!result.success) {
          return { success: false, error: result.error };
        }

        // We need to find the created user to get their ID
        const createdUser = useUserAccountsStore
          .getState()
          .users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());

        set({
          id: createdUser?.id || null,
          role: payload.role,
          name: payload.name,
          email: payload.email,
          isAuthenticated: true,
        });
        return { success: true };
      },

      logout: () =>
        set({
          id: null,
          role: null,
          name: "Guest",
          email: null,
          isAuthenticated: false,
        }),
    }),
    { name: "auth-storage" },
  ),
);
