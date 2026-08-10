import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { selectCartItems } from "../../features/cart/cartSelectors";

import { createOrder } from "../../features/orders/orderThunk";
import { fetchCart } from "../../features/cart/cartThunk";

import { initiateEsewaPayment } from "../../features/payments/paymentThunk";
import type { EsewaPaymentData } from "../../features/payments/paymentAPI";

import { resolveMediaUrl } from "../../config/env";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItems = useAppSelector(selectCartItems);

  console.log("cartItems", cartItems);

  // ================================================================
  // DELIVERY INFORMATION
  // ================================================================

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  // ================================================================
  // LOADING / ERROR
  // ================================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================================================================
  // CALCULATE SUBTOTAL
  // ================================================================

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product_price) * item.quantity,
    0,
  );

  // ================================================================
  // SUBMIT PAYMENT FORM TO ESEWA
  // ================================================================

  const submitEsewaPayment = (paymentData: EsewaPaymentData) => {
    console.log("========== ESEWA FROM REACT ==========");
    console.log("amount:", JSON.stringify(paymentData.amount));
    console.log("tax_amount:", JSON.stringify(paymentData.tax_amount));
    console.log("total_amount:", JSON.stringify(paymentData.total_amount));
    console.log(
      "transaction_uuid:",
      JSON.stringify(paymentData.transaction_uuid),
    );
    console.log("product_code:", JSON.stringify(paymentData.product_code));
    console.log(
      "product_service_charge:",
      JSON.stringify(paymentData.product_service_charge),
    );
    console.log(
      "product_delivery_charge:",
      JSON.stringify(paymentData.product_delivery_charge),
    );
    console.log(
      "signed_field_names:",
      JSON.stringify(paymentData.signed_field_names),
    );
    console.log("signature:", JSON.stringify(paymentData.signature));
    console.log("======================================");

    const form = document.createElement("form");

    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const fields = [
      "amount",
      "tax_amount",
      "total_amount",
      "transaction_uuid",
      "product_code",
      "product_service_charge",
      "product_delivery_charge",
      "success_url",
      "failure_url",
      "signed_field_names",
      "signature",
    ] as const;

    fields.forEach((field) => {
      const input = document.createElement("input");

      input.type = "hidden";
      input.name = field;
      input.value = String(paymentData[field]);

      form.appendChild(input);
    });

    document.body.appendChild(form);

    form.submit();
  };

  // ================================================================
  // PLACE ORDER + ESEWA PAYMENT
  // ================================================================

  const handlePlaceOrder = async () => {
    /*
     * Validate delivery information
     */
    if (!deliveryAddress.trim() || !phone.trim() || !city.trim()) {
      setError("Please fill all fields.");

      return;
    }

    try {
      setLoading(true);
      setError("");

      // ============================================================
      // 1. CREATE ORDER
      // ============================================================

      const order = await dispatch(
        createOrder({
          delivery_address: deliveryAddress,
          phone,
          city,
        }),
      ).unwrap();

      console.log("Order created:", order);

      // ============================================================
      // 2. INITIATE ESEWA PAYMENT
      // ============================================================

      const paymentData = await dispatch(
        initiateEsewaPayment(order.id),
      ).unwrap();

      console.log("eSewa payment data:", paymentData);

      // ============================================================
      // 3. REFRESH CART
      // ============================================================

      /*
       * CreateOrderAPIView already clears
       * the backend cart.
       *
       * Fetch again so Redux cart also becomes empty.
       */

      await dispatch(fetchCart()).unwrap();

      // ============================================================
      // 4. SEND PAYMENT REQUEST TO ESEWA
      // ============================================================

      submitEsewaPayment(paymentData);
    } catch (err) {
      console.error("Order/payment error:", err);

      setError(
        typeof err === "string"
          ? err
          : "Failed to create order or initiate payment.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // EMPTY CART
  // ================================================================

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <p className="mt-4 text-gray-500">Your cart is empty.</p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // ================================================================
  // CHECKOUT UI
  // ================================================================

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ==========================================================
            DELIVERY INFORMATION
        ========================================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Delivery Information</h2>

          <div className="space-y-5">
            {/* Address */}

            <div>
              <label className="mb-2 block font-medium">Delivery Address</label>

              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={4}
                placeholder="Enter your delivery address"
                className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block font-medium">Phone</label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
              />
            </div>

            {/* City */}

            <div>
              <label className="mb-2 block font-medium">City</label>

              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Error */}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* ==========================================================
            ORDER SUMMARY
        ========================================================== */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

          <div className="space-y-4">
            {/* Cart Items */}

            {cartItems.map((item) => {
              const imageUrl = resolveMediaUrl(item.product_image);

              return (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  {/* Product Image */}

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product_name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                      No image
                    </div>
                  )}

                  {/* Product Information */}

                  <div className="flex-1">
                    <p className="font-semibold">{item.product_name}</p>

                    <p className="text-sm text-gray-500">
                      ${Number(item.product_price).toFixed(2)}
                      {" × "}
                      {item.quantity}
                    </p>
                  </div>

                  {/* Item Subtotal */}

                  <p className="font-semibold">
                    ${(Number(item.product_price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}

            {/* Subtotal */}

            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>

              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Shipping */}

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>

              <span className="text-green-600">Free</span>
            </div>

            <hr />

            {/* Total */}

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span className="text-green-600">${subtotal.toFixed(2)}</span>
            </div>

            {/* Pay Button */}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Redirecting to eSewa..." : "Pay with eSewa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
