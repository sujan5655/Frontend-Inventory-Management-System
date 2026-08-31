import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { fetchProductDetail } from "../features/products/productThunk";

import {
  selectProductDetail,
  selectProductDetailStatus,
} from "../features/products/productSelectors";

import ProductCard from "../components/product/ProductCard";

const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE;

export default function ProductDetailPage() {
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const product = useAppSelector(selectProductDetail);
  const status = useAppSelector(selectProductDetailStatus);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(Number(id)));
    }
  }, [dispatch, id]);

  // =========================================================
  // Loading
  // =========================================================

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="mb-8 h-4 w-48 animate-pulse rounded bg-slate-200" />

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image skeleton */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="aspect-square animate-pulse rounded-2xl bg-slate-100" />
            </div>

            {/* Details skeleton */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

              <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-slate-200" />

              <div className="mt-6 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="mt-8 h-12 w-40 animate-pulse rounded bg-slate-200" />

              <div className="mt-8 h-16 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // Product not found
  // =========================================================

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
            🔎
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Product not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            The product you're looking for may have been removed or is no longer
            available.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to shopping
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = product.images?.length
    ? `${IMAGE_BASE}${product.images[0].image}`
    : "/placeholder.png";

  const stock = Number(product.stock || 0);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* =====================================================
            BREADCRUMB
        ====================================================== */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="transition hover:text-blue-600">
            Home
          </Link>

          <span className="text-slate-300">/</span>

          <span className="text-slate-400">Products</span>

          <span className="text-slate-300">/</span>

          <span className="max-w-[200px] truncate font-medium text-slate-700">
            {product.name}
          </span>
        </nav>

        {/* =====================================================
            PRODUCT SECTION
        ====================================================== */}
        <section className="grid gap-8 lg:grid-cols-2">
          {/* ===================================================
              IMAGE
          ==================================================== */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl bg-slate-50 sm:min-h-[560px]">
              {/* Decorative background */}
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-100/60 blur-3xl" />

              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-100/50 blur-3xl" />

              {/* Availability badge */}
              <div className="absolute left-5 top-5 z-10">
                {product.is_available ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    In stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Unavailable
                  </span>
                )}
              </div>

              <img
                src={imageUrl}
                alt={product.name}
                className="relative z-10 max-h-[480px] max-w-[90%] rounded-2xl object-contain mix-blend-multiply transition duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* ===================================================
              PRODUCT INFORMATION
          ==================================================== */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Brand */}
            {product.brand && (
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-[2px] text-blue-600">
                  {product.brand}
                </span>
              </div>
            )}

            {/* Product name */}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <p className="mt-5 text-base leading-8 text-slate-600">
                {product.description}
              </p>
            )}

            {/* Divider */}
            <div className="my-7 border-t border-slate-100" />

            {/* Price */}
            <div>
              <p className="text-sm font-medium text-slate-500">Price</p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  Rs. {product.price}
                </span>

                {product.unit && (
                  <span className="text-base font-medium text-slate-500">
                    / {product.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Availability
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {product.is_available
                      ? stock > 0
                        ? `${stock} units available`
                        : "Currently available"
                      : "Currently unavailable"}
                  </p>
                </div>

                {product.is_available ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    ×
                  </div>
                )}
              </div>
            </div>

            {/* Product information */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {product.brand && (
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-xs text-slate-400">Brand</p>

                  <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                    {product.brand}
                  </p>
                </div>
              )}

              {product.unit && (
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-xs text-slate-400">Unit</p>

                  <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                    {product.unit}
                  </p>
                </div>
              )}

              {stock > 0 && (
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <p className="text-xs text-slate-400">Stock</p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {stock}
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-8">
              {product.is_available ? (
                <Link
                  to="/cart"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-1.5 7h13M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
                    />
                  </svg>
                  Add to Cart
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-6 py-3.5 font-semibold text-slate-500"
                >
                  Currently Unavailable
                </button>
              )}
            </div>

            {/* Trust information */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
              <div className="text-center">
                <div className="text-lg">🚚</div>
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  Fast Delivery
                </p>
              </div>

              <div className="text-center">
                <div className="text-lg">🔒</div>
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  Secure Payment
                </p>
              </div>

              <div className="text-center">
                <div className="text-lg">✓</div>
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  Quality Products
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ====================================================== */}
        {product.related_products?.length > 0 && (
          <section className="mt-14 lg:mt-20">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[3px] text-blue-600">
                  You may also like
                </span>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Related Products
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  More products you might be interested in.
                </p>
              </div>

              <Link
                to="/"
                className="hidden text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:block"
              >
                View all →
              </Link>
            </div>

            {/* =====================================================
    RELATED PRODUCTS
====================================================== */}
            <section className="mt-16 lg:mt-24">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                    More to explore
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Related Products
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    You might also like these products.
                  </p>
                </div>

                <Link
                  to="/"
                  className="hidden text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:block"
                >
                  View all products →
                </Link>
              </div>

              {product.related_products?.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {product.related_products.map((item) => (
                    <div
                      key={item.id}
                      className="group transition duration-300 hover:-translate-y-1"
                    >
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                  <p className="text-sm text-slate-500">
                    No related products available.
                  </p>
                </div>
              )}

              <Link
                to="/"
                className="mt-6 block text-center text-sm font-semibold text-blue-600 sm:hidden"
              >
                View all products →
              </Link>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}
