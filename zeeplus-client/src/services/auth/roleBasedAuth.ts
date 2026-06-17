import type { Role } from "@/constants/roles";

export function canAccess(currentRole: Role | null, allowed: Role[]): boolean {
  return !!currentRole && allowed.includes(currentRole);
}
