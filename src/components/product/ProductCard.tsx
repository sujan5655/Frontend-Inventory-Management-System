import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { selectIsAuthenticated } from "../../features/auth/authSelectors";

import { addToCart, fetchCart } from "../../features/cart/cartThunk";

import { resolveMediaUrl } from "../../config/env";

import type {
  Product,
  RelatedProduct,
} from "../../features/products/productTypes";

interface ProductCardProps {
  product: Product | RelatedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [justAdded, setJustAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  /*
   * ============================
   * Product Image
   * ============================
   */
  const imagePath =
    "images" in product
      ? (product.images?.find((image) => image.is_primary)?.image ??
        product.images?.[0]?.image ??
        null)
      : product.image;

  const imageUrl = resolveMediaUrl(imagePath);

  /*
   * ============================
   * Discount
   * ============================
   */

  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    Number(product.discount_price) < Number(product.price);

  /*
   * ============================
   * Add To Cart
   * ============================
   */

  const handleAddToCart = async () => {
    /*
     * User must be logged in
     */

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location,
        },
      });

      return;
    }

    try {
      setAdding(true);

      /*
       * Add product to Django cart
       */

      await dispatch(
        addToCart({
          product: product.id,
          quantity: 1,
        }),
      ).unwrap();

      /*
       * Refresh cart from backend
       *
       * This updates:
       * - cart items
       * - total items
       * - subtotal
       */

      await dispatch(fetchCart()).unwrap();

      setJustAdded(true);

      window.setTimeout(() => {
        setJustAdded(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      {/* ============================
          Product Details Link
      ============================ */}

      <Link to={`/products/${product.id}`} className="flex flex-1 flex-col">
        {/* Product Image */}

        <div className="aspect-square overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {"brand" in product && product.brand && (
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {product.brand}
            </span>
          )}

          <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-green-600">
                  ${Number(product.discount_price).toFixed(2)}
                </span>

                <span className="text-xs text-gray-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-800">
                ${Number(product.price).toFixed(2)}
              </span>
            )}

            {"unit" in product && product.unit && (
              <span className="text-xs text-gray-400">/ {product.unit}</span>
            )}
          </div>
        </div>
      </Link>

      {/* ============================
          Add To Cart
      ============================ */}

      <div className="px-4 pb-4">
        {product.stock <= 0 ? (
          <span className="block text-center text-xs font-medium text-red-500">
            Out of stock
          </span>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-1 w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adding ? "Adding..." : justAdded ? "Added ✓" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
