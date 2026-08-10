export type UserRole = "ADMIN" | "SELLER" | "BUYER";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  approval_status: ApprovalStatus;
  is_active: boolean;
  profile_image: string | null;
  created_at: string;
}

export type AdminUserOpStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AdminUserState {
  items: AdminUser[];
  status: AdminUserOpStatus;
  error: string | null;
}
