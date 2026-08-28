import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  selectCartItems,
  selectCartTotalItems,
  selectCartSubtotal,
} from "../../features/cart/cartSelectors";

import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../features/cart/cartThunk";

import { resolveMediaUrl } from "../../config/env";

export default function CartPage() {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectCartTotalItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  /*
   * Load cart from Django backend
   * whenever the CartPage is opened.
   */
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  /*
   * Increase quantity
   */
  const handleIncrease = (itemId: number, quantity: number) => {
    dispatch(
      updateCartItem({
        id: itemId,
        quantity: quantity + 1,
      }),
    ).then(() => {
      dispatch(fetchCart());
    });
  };

  /*
   * Decrease quantity
   */
  const handleDecrease = (itemId: number, quantity: number) => {
    if (quantity <= 1) {
      return;
    }

    dispatch(
      updateCartItem({
        id: itemId,
        quantity: quantity - 1,
      }),
    ).then(() => {
      dispatch(fetchCart());
    });
  };

  /*
   * Remove item
   */
  const handleRemove = (itemId: number) => {
    dispatch(removeCartItem(itemId)).then(() => {
      dispatch(fetchCart());
    });
  };

  /*
   * Clear entire cart
   */
  const handleClearCart = () => {
    dispatch(clearCart()).then(() => {
      dispatch(fetchCart());
    });
  };

  /*
   * Empty cart
   */
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

        <p className="mt-4 text-gray-500">Your cart is empty.</p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/40 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                Your Cart
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Review your items and complete your purchase.
              </p>
            </div>

            <Link
              to="/buyer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-700"
            >
              <span>←</span>
              Continue Shopping
            </Link>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* =========================
          EMPTY CART
      ========================== */
          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                🛒
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Your cart is empty
              </h2>

              <p className="mt-2 text-gray-500">
                Looks like you haven't added anything to your cart yet. Start
                shopping and find something you love.
              </p>

              <Link
                to="/buyer"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 hover:shadow-xl"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-3">
            {/* =========================
            CART ITEMS
        ========================== */}
            <div className="space-y-4 lg:col-span-2">
              {/* Cart Count */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <div>
                  <h2 className="font-bold text-gray-900">Cart Items</h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                  {totalItems}
                </div>
              </div>

              {cartItems.map((item) => {
                const imageUrl = resolveMediaUrl(item.product_image);

                const itemTotal =
                  Number(item.product_price) * Number(item.quantity);

                return (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      {/* Product Image */}
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product_name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                            <span className="text-2xl">📦</span>
                            <span className="mt-1 text-xs">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Information */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="pr-2">
                          <h3 className="line-clamp-2 text-base font-bold text-gray-900 sm:text-lg">
                            {item.product_name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            ${Number(item.product_price).toFixed(2)} per item
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-auto pt-4">
                          <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleDecrease(item.id, item.quantity)
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-gray-600 transition hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>

                            <span className="flex min-w-10 justify-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleIncrease(item.id, item.quantity)
                              }
                              aria-label="Increase quantity"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-lg font-bold text-white shadow-sm transition hover:bg-green-700"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price / Remove */}
                      <div className="flex shrink-0 flex-col items-end justify-between">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 sm:text-xl">
                            ${itemTotal.toFixed(2)}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Item total
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================
            ORDER SUMMARY
        ========================== */}
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                {/* Summary Header */}
                <div className="border-b border-gray-100 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
                  <p className="text-sm font-medium text-green-100">
                    Order Summary
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">Your Total</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Total Items</span>

                      <span className="font-semibold text-gray-900">
                        {totalItems}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>

                      <span className="font-semibold text-gray-900">
                        ${Number(subtotal).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                        FREE
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-dashed border-gray-200" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>

                      <p className="mt-1 text-3xl font-extrabold text-gray-900">
                        ${Number(subtotal).toFixed(2)}
                      </p>
                    </div>

                    <span className="mb-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Free Shipping
                    </span>
                  </div>

                  {/* Checkout */}
                  <Link
                    to="/buyer/checkout"
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 hover:shadow-xl"
                  >
                    Proceed to Checkout
                    <span>→</span>
                  </Link>

                  {/* Clear Cart */}
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-500 transition hover:bg-red-100"
                  >
                    Clear Cart
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    to="/buyer"
                    className="mt-5 block text-center text-sm font-semibold text-green-600 transition hover:text-green-700 hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Trust Message */}
              <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
                <div className="flex gap-3">
                  <div className="text-lg">🔒</div>

                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-green-700">
                      Your order information is protected and securely
                      processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
