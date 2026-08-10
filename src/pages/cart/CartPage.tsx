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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

          <p className="mt-1 text-sm text-gray-500">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <Link
          to="/buyer"
          className="text-sm font-medium text-green-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* =========================
            CART ITEMS
        ========================== */}

        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => {
            const imageUrl = resolveMediaUrl(item.product_image);

            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm"
              >
                {/* Product Image */}

                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Product Information */}

                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.product_name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    ${Number(item.product_price).toFixed(2)} each
                  </p>

                  {/* Quantity Controls */}

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      disabled={item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="min-w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-lg font-bold text-white hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price / Remove */}

                <div className="flex flex-col items-end justify-between">
                  <p className="text-lg font-bold text-green-600">
                    ${Number(item.product_price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================
            ORDER SUMMARY
        ========================== */}

        <div className="h-fit rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Total Items</span>

              <span className="font-medium text-gray-900">{totalItems}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>

              <span className="font-medium text-gray-900">
                ${Number(subtotal).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>

              <span className="font-medium text-green-600">Free</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span className="text-green-600">
                ${Number(subtotal).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout */}

          <Link
            to="/buyer/checkout"
            className="mt-8 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            Proceed to Checkout
          </Link>

          {/* Clear Cart */}

          <button
            type="button"
            onClick={handleClearCart}
            className="mt-3 w-full rounded-lg border border-red-500 py-3 font-semibold text-red-500 hover:bg-red-50"
          >
            Clear Cart
          </button>

          <Link
            to="/buyer"
            className="mt-4 block text-center text-green-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
