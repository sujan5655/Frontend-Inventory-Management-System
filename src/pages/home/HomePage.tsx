// import { useEffect, useMemo, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../app/hooks";

// import {
//   selectProducts,
//   selectProductsError,
//   selectProductsStatus,
// } from "../../features/products/productSelectors";

// import { fetchProducts } from "../../features/products/productThunk";
// import ProductCard from "../../components/product/ProductCard";
// import { fetchCategories } from "../../features/category/categoryThunk";
// import ProductAIChat from "../../ai/ProductAIChat";

// export default function HomePage() {
//   const dispatch = useAppDispatch();

//   const products = useAppSelector(selectProducts);
//   const status = useAppSelector(selectProductsStatus);
//   const error = useAppSelector(selectProductsError);
//   const { items: categories } = useAppSelector((state) => state.category);
//   console.log(categories);
//   // -------------------------
//   // Search
//   // -------------------------
//   const [search, setSearch] = useState("");

//   // -------------------------
//   // Filters
//   // -------------------------
//   const [category, setCategory] = useState("");
//   const [brand, setBrand] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [inStock, setInStock] = useState(false);

//   // -------------------------
//   // Sorting
//   // -------------------------
//   const [ordering, setOrdering] = useState("");

//   useEffect(() => {
//     dispatch(fetchProducts());
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   // -------------------------
//   // Search + Filter + Sort
//   // -------------------------
//   const displayedProducts = useMemo(() => {
//     let result = [...products];

//     // -------------------------
//     // Search
//     // -------------------------
//     if (search.trim()) {
//       const searchText = search.toLowerCase().trim();

//       result = result.filter(
//         (product) =>
//           product.name?.toLowerCase().includes(searchText) ||
//           product.description?.toLowerCase().includes(searchText) ||
//           product.brand?.toLowerCase().includes(searchText),
//       );
//     }

//     // -------------------------
//     // Category
//     // -------------------------
//     if (category) {
//       result = result.filter(
//         (product) => String(product.category) === String(category),
//       );
//     }

//     // -------------------------
//     // Brand
//     // -------------------------
//     if (brand) {
//       result = result.filter(
//         (product) => product.brand?.toLowerCase() === brand.toLowerCase(),
//       );
//     }

//     // -------------------------
//     // Minimum Price
//     // -------------------------
//     if (minPrice !== "") {
//       result = result.filter(
//         (product) => Number(product.price) >= Number(minPrice),
//       );
//     }

//     // -------------------------
//     // Maximum Price
//     // -------------------------
//     if (maxPrice !== "") {
//       result = result.filter(
//         (product) => Number(product.price) <= Number(maxPrice),
//       );
//     }

//     // -------------------------
//     // In Stock
//     // -------------------------
//     if (inStock) {
//       result = result.filter((product) => Number(product.stock) > 0);
//     }

//     // -------------------------
//     // Sorting
//     // -------------------------
//     if (ordering === "price") {
//       result.sort((a, b) => Number(a.price) - Number(b.price));
//     }

//     if (ordering === "-price") {
//       result.sort((a, b) => Number(b.price) - Number(a.price));
//     }

//     if (ordering === "name") {
//       result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//     }

//     if (ordering === "-name") {
//       result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
//     }

//     if (ordering === "sold") {
//       result.sort((a, b) => Number(b.sold_count) - Number(a.sold_count));
//     }

//     if (ordering === "newest") {
//       result.sort(
//         (a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
//       );
//     }

//     return result;
//   }, [
//     products,
//     search,
//     category,
//     brand,
//     minPrice,
//     maxPrice,
//     inStock,
//     ordering,
//   ]);

//   const isLoading = status === "loading" || status === "idle";

//   return (
//     <div className="mx-auto mt-10 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//       {/* -------------------------
//           Search
//       ------------------------- */}
//       <div className="mb-6">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search products..."
//           className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
//         />
//       </div>

//       {/* -------------------------
//           Filters
//       ------------------------- */}
//       <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {/* Category */}
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="rounded-lg border border-gray-300 px-3 py-2"
//         >
//           <option value="">All Categories</option>

//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         {/* Brand */}
//         <input
//           type="text"
//           value={brand}
//           onChange={(e) => setBrand(e.target.value)}
//           placeholder="Brand"
//           className="rounded-lg border border-gray-300 px-3 py-2"
//         />

//         {/* Minimum Price */}
//         <input
//           type="number"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//           placeholder="Min price"
//           className="rounded-lg border border-gray-300 px-3 py-2"
//         />

//         {/* Maximum Price */}
//         <input
//           type="number"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           placeholder="Max price"
//           className="rounded-lg border border-gray-300 px-3 py-2"
//         />
//       </div>

//       {/* -------------------------
//           Stock + Sorting
//       ------------------------- */}
//       <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={inStock}
//             onChange={(e) => setInStock(e.target.checked)}
//           />

//           <span className="text-sm text-gray-700">In stock only</span>
//         </label>

//         <select
//           value={ordering}
//           onChange={(e) => setOrdering(e.target.value)}
//           className="rounded-lg border border-gray-300 px-3 py-2"
//         >
//           <option value="">Newest</option>
//           <option value="price">Price: Low to High</option>
//           <option value="-price">Price: High to Low</option>
//           <option value="name">Name: A-Z</option>
//           <option value="-name">Name: Z-A</option>
//           <option value="sold">Most Sold</option>
//         </select>
//       </div>

//       {/* -------------------------
//           Loading
//       ------------------------- */}
//       {isLoading && (
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//           {Array.from({ length: 8 }).map((_, index) => (
//             <div
//               key={index}
//               className="aspect-square animate-pulse rounded-xl bg-gray-100"
//             />
//           ))}
//         </div>
//       )}

//       {/* -------------------------
//           Error
//       ------------------------- */}
//       {!isLoading && error && (
//         <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
//           {error}
//         </p>
//       )}

//       {/* -------------------------
//           No Products
//       ------------------------- */}
//       {!isLoading && !error && products.length === 0 && (
//         <p className="text-sm text-gray-500">No products available yet.</p>
//       )}

//       {/* -------------------------
//           No Search Results
//       ------------------------- */}
//       {!isLoading &&
//         !error &&
//         products.length > 0 &&
//         displayedProducts.length === 0 && (
//           <p className="text-sm text-gray-500">
//             No products match your search or filters.
//           </p>
//         )}

//       {/* -------------------------
//           Products
//       ------------------------- */}
//       {!isLoading && !error && displayedProducts.length > 0 && (
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//           {displayedProducts.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       )}
//       <ProductAIChat />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../../features/products/productSelectors";

import { fetchProducts } from "../../features/products/productThunk";
import ProductCard from "../../components/product/ProductCard";
import { fetchCategories } from "../../features/category/categoryThunk";
import ProductAIChat from "../../ai/ProductAIChat";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const { items: categories } = useAppSelector((state) => state.category);

  // -------------------------
  // Search
  // -------------------------
  const [search, setSearch] = useState("");

  // -------------------------
  // Filters
  // -------------------------
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);

  // -------------------------
  // Sorting
  // -------------------------
  const [ordering, setOrdering] = useState("newest");

  // -------------------------
  // Mobile filter visibility
  // -------------------------
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // -------------------------
  // Clear all filters
  // -------------------------
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setOrdering("newest");
  };

  // -------------------------
  // Check whether filters
  // are currently active
  // -------------------------
  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "" ||
    brand.trim() !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    inStock;

  // -------------------------
  // Search + Filter + Sort
  // -------------------------
  const displayedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const searchText = search.toLowerCase().trim();

      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        const productBrand = product.brand?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          description.includes(searchText) ||
          productBrand.includes(searchText)
        );
      });
    }

    // Category
    // Category
    if (category) {
      result = result.filter(
        (product) => String(product.category) === String(category),
      );
    }

    // Brand
    if (brand.trim()) {
      const brandText = brand.toLowerCase().trim();

      result = result.filter((product) =>
        product.brand?.toLowerCase().includes(brandText),
      );
    }

    // Minimum price
    if (minPrice !== "") {
      const min = Number(minPrice);

      if (!Number.isNaN(min)) {
        result = result.filter((product) => Number(product.price) >= min);
      }
    }

    // Maximum price
    if (maxPrice !== "") {
      const max = Number(maxPrice);

      if (!Number.isNaN(max)) {
        result = result.filter((product) => Number(product.price) <= max);
      }
    }

    // In stock
    if (inStock) {
      result = result.filter((product) => Number(product.stock) > 0);
    }

    // Sorting
    switch (ordering) {
      case "price":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "-price":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "name":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;

      case "-name":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;

      case "sold":
        result.sort(
          (a, b) => Number(b.sold_count || 0) - Number(a.sold_count || 0),
        );
        break;

      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
    }

    return result;
  }, [
    products,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    inStock,
    ordering,
  ]);

  const isLoading = status === "loading" || status === "idle";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        {/* Decorative background */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-10">
          <div className="max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl">
              Find your next
              <h1 className=" bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                favorite product.
              </h1>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore our collection, compare products, filter by what matters
              to you, and discover the perfect match.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-3xl">
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                <svg
                  className="h-5 w-5 text-slate-400 transition group-focus-within:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, or descriptions..."
                className="w-full rounded-2xl border border-white/10 bg-white px-12 py-3 text-sm text-slate-900 shadow-2xl outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ===================================================
            TOOLBAR
        ==================================================== */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {isLoading
                ? "Loading products..."
                : `${displayedProducts.length} ${
                    displayedProducts.length === 1 ? "product" : "products"
                  } found`}
            </p>

            {!isLoading && hasActiveFilters && (
              <p className="mt-1 text-xs text-slate-500">
                Filters are currently applied
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile filters */}
            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5h18M6 12h12M10 19h4"
                />
              </svg>
              Filters
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-500 sm:block">
                Sort:
              </span>

              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="newest">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="-name">Name: Z-A</option>
                <option value="sold">Most Sold</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            MAIN LAYOUT
        ==================================================== */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* =================================================
              SIDEBAR FILTERS
          ================================================== */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">Filters</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Refine your results
                  </p>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">All Categories</option>

                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label
                    htmlFor="brand"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Brand
                  </label>

                  <input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Nike"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Price range
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="border-t border-slate-100 pt-5">
                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        In stock only
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Hide unavailable products
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={inStock}
                      onClick={() => setInStock((value) => !value)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        inStock ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          inStock ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* =================================================
              PRODUCTS
          ================================================== */}
          <section>
            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="aspect-square animate-pulse bg-slate-200" />

                    <div className="space-y-3 p-4">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                      <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                  ⚠️
                </div>

                <h3 className="font-semibold text-red-900">
                  Something went wrong
                </h3>

                <p className="mt-2 max-w-md text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => dispatch(fetchProducts())}
                  className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty database */}
            {!isLoading && !error && products.length === 0 && (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
                  🛍️
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  No products yet
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  Your product collection is empty. Products will appear here
                  once they are added.
                </p>
              </div>
            )}

            {/* Filtered empty */}
            {!isLoading &&
              !error &&
              products.length > 0 &&
              displayedProducts.length === 0 && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
                    🔎
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    No products found
                  </h3>

                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    Try changing your search or removing some filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}

            {/* Products */}
            {!isLoading && !error && displayedProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group transition duration-300 hover:-translate-y-1"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* =====================================================
          AI CHAT
      ====================================================== */}
      <ProductAIChat />
    </main>
  );
}
