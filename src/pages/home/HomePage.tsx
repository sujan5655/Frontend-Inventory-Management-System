import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../../features/products/productSelectors";
import { fetchProducts } from "../../features/products/productThunk";
import ProductCard from "../../components/product/ProductCard";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  console.log("Products:", products);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-10">
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shop Groceries</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fresh products from local stores, delivered to you.
        </p>
      </div> */}

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

      {!isLoading && error && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {!isLoading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500">No products available yet.</p>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
