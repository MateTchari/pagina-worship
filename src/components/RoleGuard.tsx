import type { ReactNode } from "react";
import type { UserRole } from "@/lib/types";

export function RoleGuard({ role = "admin", allowed = ["admin"], children, fallback = null }: { role?: UserRole; allowed?: UserRole[]; children: ReactNode; fallback?: ReactNode }) {
  return allowed.includes(role) ? <>{children}</> : <>{fallback}</>;
}
