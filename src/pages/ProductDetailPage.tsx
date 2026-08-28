import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { fetchProductDetail } from "../features/products/productThunk";

import {
  selectProductDetail,
  selectProductDetailStatus,
} from "../features/products/productSelectors";

import ProductCard from "../components/product/ProductCard";

export default function ProductDetailPage() {
  const IMAGE_BASE = "http://127.0.0.1:8000";
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const product = useAppSelector(selectProductDetail);

  const status = useAppSelector(selectProductDetailStatus);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(Number(id)));
    }
  }, [dispatch, id]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-6">
        {/* Product Image */}
        <div className="flex justify-center items-center bg-gray-50 rounded-2xl p-6">
          <img
            src={
              product.images?.length
                ? `${IMAGE_BASE}${product.images[0].image}`
                : "/placeholder.png"
            }
            alt={product.name}
            className="rounded-xl h-[300px] w-[300px] object-cover shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-6">
            <span className="text-sm text-gray-500">Price</span>
            <h2 className="text-3xl font-bold text-green-600">
              Rs. {product.price}
              <span className="text-lg text-gray-500">/{product.unit}</span>
            </h2>
          </div>

          {/* Availability */}
          <div className="mt-6">
            {product.is_available ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                Not Available
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-5 text-2xl font-bold">Related Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.related_products?.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
