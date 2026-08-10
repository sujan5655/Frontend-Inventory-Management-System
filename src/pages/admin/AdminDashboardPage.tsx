import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  FolderTree,
  Package,
  ShoppingCart,
  UserCheck,
  DollarSign,
  Clock,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAdminDashboard } from "../../features/dashboard/dashboardThunk";
import {
  selectAdminDashboard,
  selectDashboardError,
  selectDashboardStatus,
} from "../../features/dashboard/dashboardSelectors";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectAdminDashboard);
  const status = useAppSelector(selectDashboardStatus);
  const error = useAppSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-500">
          A platform-wide overview of users, stores, catalogue, and sales.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && stats && (
        <>
          {stats.pending_sellers > 0 && (
            <Link
              to="/admin/users"
              className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 hover:bg-amber-100"
            >
              <span>
                <strong>{stats.pending_sellers}</strong> seller
                {stats.pending_sellers === 1 ? " account is" : " accounts are"}{" "}
                waiting for approval.
              </span>
              <span className="font-semibold underline">Review now →</span>
            </Link>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={stats.total_users}
              icon={<Users size={28} />}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              title="Buyers"
              value={stats.total_buyers}
              icon={<UserCheck size={28} />}
              color="bg-teal-100 text-teal-600"
            />
            <StatCard
              title="Sellers"
              value={stats.total_sellers}
              icon={<Users size={28} />}
              color="bg-indigo-100 text-indigo-600"
            />
            <StatCard
              title="Pending Sellers"
              value={stats.pending_sellers}
              icon={<Clock size={28} />}
              color="bg-amber-100 text-amber-600"
            />
            <StatCard
              title="Stores"
              value={stats.total_stores}
              icon={<Store size={28} />}
              color="bg-purple-100 text-purple-600"
            />
            <StatCard
              title="Categories"
              value={stats.total_categories}
              icon={<FolderTree size={28} />}
              color="bg-pink-100 text-pink-600"
            />
            <StatCard
              title="Products"
              value={stats.total_products}
              icon={<Package size={28} />}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              title="Orders"
              value={stats.total_orders}
              icon={<ShoppingCart size={28} />}
              color="bg-orange-100 text-orange-600"
            />
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <DollarSign size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Total Revenue (delivered orders)
                </p>
                <h3 className="mt-1 text-3xl font-bold text-gray-900">
                  ${Number(stats.total_revenue).toFixed(2)}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link
                to="/admin/users"
                className="rounded-lg border p-5 hover:border-green-600 hover:bg-green-50"
              >
                <Users className="mb-3 text-green-600" />
                <h3 className="font-semibold">Manage Users</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Approve sellers, suspend accounts.
                </p>
              </Link>

              <Link
                to="/admin/stores"
                className="rounded-lg border p-5 hover:border-green-600 hover:bg-green-50"
              >
                <Store className="mb-3 text-green-600" />
                <h3 className="font-semibold">Manage Stores</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Approve, reject, or suspend stores.
                </p>
              </Link>

              <Link
                to="/admin/products"
                className="rounded-lg border p-5 hover:border-green-600 hover:bg-green-50"
              >
                <Package className="mb-3 text-green-600" />
                <h3 className="font-semibold">Manage Products</h3>
                <p className="mt-1 text-sm text-gray-500">
                  View, edit, or remove any listing.
                </p>
              </Link>

              <Link
                to="/admin/orders"
                className="rounded-lg border p-5 hover:border-green-600 hover:bg-green-50"
              >
                <ShoppingCart className="mb-3 text-green-600" />
                <h3 className="font-semibold">Manage Orders</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track and update order status.
                </p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
        </div>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
