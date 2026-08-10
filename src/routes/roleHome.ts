import type { UserRole } from "../features/auth/authTypes";

export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "SELLER":
      return "/seller";
    case "BUYER":
    default:
      return "/buyer";
  }
}
