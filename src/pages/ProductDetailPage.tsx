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
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={
            product.images?.length
              ? `${IMAGE_BASE}${product.images[0].image}`
              : "/placeholder.png"
          }
          alt={product.name}
          className="rounded-xl"
        />

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="mt-4">{product.description}</p>

          <h2 className="mt-6 text-2xl font-bold">${product.price}</h2>
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
