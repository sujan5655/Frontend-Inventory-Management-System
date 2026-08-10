import axiosInstance from "../../services/axios";
import type { AdminUser } from "./adminUserTypes";

export async function fetchUsersRequest(): Promise<AdminUser[]> {
  const { data } = await axiosInstance.get<AdminUser[]>("/auth/admin/users/");
  return data;
}

export async function setSellerApprovalRequest(
  id: number,
  action: "APPROVE" | "REJECT",
): Promise<AdminUser> {
  const { data } = await axiosInstance.patch<AdminUser>(
    `/auth/admin/users/${id}/approval/`,
    { action },
  );
  return data;
}

export async function toggleUserActiveRequest(id: number): Promise<AdminUser> {
  const { data } = await axiosInstance.patch<AdminUser>(
    `/auth/admin/users/${id}/toggle-active/`,
  );
  return data;
}
