export interface AdminDashboardStats {
  total_users: number;
  total_buyers: number;
  total_sellers: number;
  pending_sellers: number;
  total_stores: number;
  total_categories: number;
  total_products: number;
  total_orders: number;
  total_revenue: string;
}

export type DashboardOpStatus = "idle" | "loading" | "succeeded" | "failed";

export interface DashboardState {
  admin: AdminDashboardStats | null;
  status: DashboardOpStatus;
  error: string | null;
}
