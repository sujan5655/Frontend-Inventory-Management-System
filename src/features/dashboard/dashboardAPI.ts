import axiosInstance from "../../services/axios";
import type { AdminDashboardStats } from "./dashboardTypes";

export async function fetchAdminDashboardRequest(): Promise<AdminDashboardStats> {
  const { data } = await axiosInstance.get<AdminDashboardStats>("/dashboard/admin/");
  return data;
}
