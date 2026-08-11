import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="mt-3 text-gray-600">
          Your payment has been successfully completed.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Order ID</p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              #{orderId}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to={`/orders/${orderId}`}
            className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            View Order
          </Link>

          <Link
            to="/products"
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Continue Shopping
          </Link>

          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
