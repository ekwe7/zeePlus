import { useAuthStore } from "@/store/authStore";

export function useRole() {
  const { role, name, email, isAuthenticated, setRole, logout } =
    useAuthStore();
  return { role, name, email, isAuthenticated, setRole, logout };
}
