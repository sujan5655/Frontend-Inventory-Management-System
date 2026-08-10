import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Store, FolderTree, ShoppingCart } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { fetchMyProducts } from "../../features/products/productThunk";
import { fetchMyStores } from "../../features/store/storeThunk";
import { fetchCategories } from "../../features/category/categoryThunk";

import { selectMyProducts } from "../../features/products/productSelectors";
import { selectMyStores } from "../../features/store/storeSelectors";
import { selectCategories } from "../../features/category/categorySelectors";

export default function SellerDashboardPage() {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectMyProducts);
  const stores = useAppSelector(selectMyStores);
  const categories = useAppSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchMyProducts());
    dispatch(fetchMyStores());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>

        <p className="mt-2 text-gray-500">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Stores"
          value={stores.length}
          icon={<Store size={28} />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Products"
          value={products.length}
          icon={<Package size={28} />}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Categories"
          value={categories.length}
          icon={<FolderTree size={28} />}
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Orders"
          value={0}
          icon={<ShoppingCart size={28} />}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">Quick Actions</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/seller/stores"
            className="rounded-lg border p-5 hover:border-green-600 hover:bg-green-50"
          >
            <Store className="mb-3 text-green-600" />
            <h3 className="font-semibold">Manage Stores</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage your stores.
            </p>
          </Link>

          <Link
            to="/seller/categories"
            className="rounded-lg border p-5 hover:border-green-600 hover:bg-green-50"
          >
            <FolderTree className="mb-3 text-green-600" />
            <h3 className="font-semibold">Manage Categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create product categories.
            </p>
          </Link>

          <Link
            to="/seller/products"
            className="rounded-lg border p-5 hover:border-green-600 hover:bg-green-50"
          >
            <Package className="mb-3 text-green-600" />
            <h3 className="font-semibold">Manage Products</h3>
            <p className="mt-1 text-sm text-gray-500">
              View and edit products.
            </p>
          </Link>

          <Link
            to="/seller/products"
            className="rounded-lg border p-5 hover:border-green-600 hover:bg-green-50"
          >
            <ShoppingCart className="mb-3 text-green-600" />
            <h3 className="font-semibold">Orders</h3>
            <p className="mt-1 text-sm text-gray-500">View customer orders.</p>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">Recent Products</h2>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="py-3 text-left">Product</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Stock</th>
                  <th className="py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3">{product.name}</td>

                    <td className="py-3">
                      ${Number(product.price).toFixed(2)}
                    </td>

                    <td className="py-3">{product.stock}</td>

                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.is_available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
        </div>

        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
