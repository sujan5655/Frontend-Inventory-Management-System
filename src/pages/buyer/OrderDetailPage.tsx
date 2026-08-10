import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { fetchOrderDetail } from "../../features/orders/orderThunk";

import {
  selectSelectedOrder,
  selectOrderDetailStatus,
  selectOrderDetailError,
} from "../../features/orders/orderSelectors";

export default function OrderDetailPage() {
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const order = useAppSelector(selectSelectedOrder);
  const status = useAppSelector(selectOrderDetailStatus);
  const error = useAppSelector(selectOrderDetailError);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetail(Number(id)));
    }
  }, [id, dispatch]);

  if (status === "loading") {
    return <div className="p-6">Loading order...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found.</div>;
  }

  return (
    <div className="p-6">
      <Link to="/buyer/orders" className="text-green-600 hover:underline">
        ← Back to Orders
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Order #{order.id}</h1>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow">
        <div className="flex justify-between">
          <span>Status</span>

          <span className="font-semibold">{order.status}</span>
        </div>

        <div className="mt-3 flex justify-between">
          <span>Total</span>

          <span className="font-bold text-green-600">
            ${Number(order.total_amount).toFixed(2)}
          </span>
        </div>

        <div className="mt-3">
          <p className="font-semibold">Delivery Address</p>

          <p className="text-gray-600">{order.delivery_address}</p>
        </div>

        <div className="mt-3">
          <p className="font-semibold">Phone</p>

          <p className="text-gray-600">{order.phone}</p>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-bold">Products</h2>

      <div className="mt-4 space-y-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            <img
              src={item.product_image ?? "/placeholder.png"}
              alt={item.product_name}
              className="h-20 w-20 rounded object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.product_name}</h3>

              <p>Quantity: {item.quantity}</p>
            </div>

            <p className="font-bold">${Number(item.subtotal).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
