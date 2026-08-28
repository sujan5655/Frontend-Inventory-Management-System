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

export default function HomePage() {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const { items: categories } = useAppSelector((state) => state.category);
  console.log(categories);
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
  const [ordering, setOrdering] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // -------------------------
  // Search + Filter + Sort
  // -------------------------
  const displayedProducts = useMemo(() => {
    let result = [...products];

    // -------------------------
    // Search
    // -------------------------
    if (search.trim()) {
      const searchText = search.toLowerCase().trim();

      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchText) ||
          product.description?.toLowerCase().includes(searchText) ||
          product.brand?.toLowerCase().includes(searchText),
      );
    }

    // -------------------------
    // Category
    // -------------------------
    if (category) {
      result = result.filter(
        (product) => String(product.category) === String(category),
      );
    }

    // -------------------------
    // Brand
    // -------------------------
    if (brand) {
      result = result.filter(
        (product) => product.brand?.toLowerCase() === brand.toLowerCase(),
      );
    }

    // -------------------------
    // Minimum Price
    // -------------------------
    if (minPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) >= Number(minPrice),
      );
    }

    // -------------------------
    // Maximum Price
    // -------------------------
    if (maxPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) <= Number(maxPrice),
      );
    }

    // -------------------------
    // In Stock
    // -------------------------
    if (inStock) {
      result = result.filter((product) => Number(product.stock) > 0);
    }

    // -------------------------
    // Sorting
    // -------------------------
    if (ordering === "price") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (ordering === "-price") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (ordering === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    if (ordering === "-name") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    if (ordering === "sold") {
      result.sort((a, b) => Number(b.sold_count) - Number(a.sold_count));
    }

    if (ordering === "newest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
    <div className="mx-auto mt-10 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* -------------------------
          Search
      ------------------------- */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* -------------------------
          Filters
      ------------------------- */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Brand */}
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand"
          className="rounded-lg border border-gray-300 px-3 py-2"
        />

        {/* Minimum Price */}
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min price"
          className="rounded-lg border border-gray-300 px-3 py-2"
        />

        {/* Maximum Price */}
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max price"
          className="rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      {/* -------------------------
          Stock + Sorting
      ------------------------- */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />

          <span className="text-sm text-gray-700">In stock only</span>
        </label>

        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
          <option value="-name">Name: Z-A</option>
          <option value="sold">Most Sold</option>
        </select>
      </div>

      {/* -------------------------
          Loading
      ------------------------- */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {/* -------------------------
          Error
      ------------------------- */}
      {!isLoading && error && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* -------------------------
          No Products
      ------------------------- */}
      {!isLoading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500">No products available yet.</p>
      )}

      {/* -------------------------
          No Search Results
      ------------------------- */}
      {!isLoading &&
        !error &&
        products.length > 0 &&
        displayedProducts.length === 0 && (
          <p className="text-sm text-gray-500">
            No products match your search or filters.
          </p>
        )}

      {/* -------------------------
          Products
      ------------------------- */}
      {!isLoading && !error && displayedProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
