import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "../../features/products/productThunk";
import {
  selectProducts,
  selectProductsStatus,
} from "../../features/products/productSelectors";

import { selectCartItems } from "../../features/cart/cartSelectors";
import ProductCard from "../../components/product/ProductCard";

export default function BuyerDashboard() {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);

  const cartItems = useAppSelector(selectCartItems);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product_price) * item.quantity,
    0,
  );

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>

        <div className="mt-4 flex justify-between">
          <div>
            <p>Items in Cart</p>
            <h2 className="text-2xl font-bold">{cartItems.length}</h2>
          </div>

          <div>
            <p>Total</p>
            <h2 className="text-2xl font-bold">${total.toFixed(2)}</h2>
          </div>

          <Link
            to="/cart"
            className="rounded-lg bg-green-600 px-5 py-2 text-white"
          >
            View Cart
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-4 flex justify-between">
          <h2 className="text-2xl font-bold">Products</h2>

          <Link to="/products" className="text-green-600">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
