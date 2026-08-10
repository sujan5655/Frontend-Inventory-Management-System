import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  selectMyOrders,
  selectMyOrdersStatus,
  selectMyOrdersError,
} from "../../features/orders/orderSelectors";

import { fetchMyOrders } from "../../features/orders/orderThunk";

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(selectMyOrders);
  const status = useAppSelector(selectMyOrdersStatus);
  const error = useAppSelector(selectMyOrdersError);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">You have not placed any orders yet.</p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>

          <p className="mt-1 text-gray-500">View and track your orders.</p>
        </div>

        <Link
          to="/cart"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          View Cart
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/buyer/orders/${order.id}`}
            className="block rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold">Order #{order.id}</h2>

                <p className="mt-1 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                  order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "CONFIRMED"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "SHIPPED"
                        ? "bg-purple-100 text-purple-700"
                        : order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-5 grid gap-4 border-t pt-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Items</p>

                <p className="font-semibold">
                  {order.items?.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  ) ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>

                <p className="font-semibold text-green-600">
                  ${Number(order.total_amount).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">City</p>

                <p className="font-semibold">{order.city}</p>
              </div>
            </div>

            <div className="mt-4 text-right text-sm font-medium text-green-600">
              View Order →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
