import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAdminOrders,
  selectAdminOrdersError,
  selectAdminOrdersStatus,
} from "../../features/orders/orderSelectors";
import { fetchAdminOrders, updateAdminOrderStatus } from "../../features/orders/orderThunk";
import { clearAdminOrderError } from "../../features/orders/orderSlice";
import type { Order, OrderStatus } from "../../features/orders/orderTypes";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-600 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-600 border-purple-200",
  DELIVERED: "bg-green-50 text-green-600 border-green-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAdminOrders);
  const status = useAppSelector(selectAdminOrdersStatus);
  const error = useAppSelector(selectAdminOrdersError);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  async function handleStatusChange(order: Order, next: OrderStatus) {
    setBusyId(order.id);
    await dispatch(updateAdminOrderStatus({ id: order.id, status: next }));
    setBusyId(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Every order placed across the platform.
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => dispatch(clearAdminOrderError())}>
            ✕
          </button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          No orders have been placed yet.
        </p>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const isBusy = busyId === order.id;
            return (
              <div
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.city} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <div className="mb-4 grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-gray-700">
                          Delivery address:
                        </span>{" "}
                        {order.delivery_address}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Phone:</span>{" "}
                        {order.phone}
                      </p>
                    </div>

                    <table className="mb-4 min-w-full text-sm">
                      <thead className="border-b border-gray-100">
                        <tr>
                          <th className="py-2 text-left font-medium text-gray-500">
                            Product
                          </th>
                          <th className="py-2 text-left font-medium text-gray-500">
                            Qty
                          </th>
                          <th className="py-2 text-left font-medium text-gray-500">
                            Price
                          </th>
                          <th className="py-2 text-left font-medium text-gray-500">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-50">
                            <td className="py-2 text-gray-700">
                              {item.product_name}
                            </td>
                            <td className="py-2 text-gray-500">{item.quantity}</td>
                            <td className="py-2 text-gray-500">
                              ${Number(item.price).toFixed(2)}
                            </td>
                            <td className="py-2 text-gray-500">
                              ${Number(item.subtotal).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <label className="text-sm font-medium text-gray-700">
                      Update status
                      <select
                        disabled={isBusy}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value as OrderStatus)
                        }
                        className="mt-1 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
