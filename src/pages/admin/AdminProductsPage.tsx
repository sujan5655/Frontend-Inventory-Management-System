import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  deleteProduct,
  fetchMyProducts,
  updateProduct,
} from "../../features/products/productThunk";
import type { Product, ProductPayload } from "../../features/products/productTypes";
import {
  selectMyProducts,
  selectMyProductsError,
  selectMyProductsStatus,
} from "../../features/products/productSelectors";
import { clearMyProductError } from "../../features/products/productSlice";

import { selectAllStores } from "../../features/store/storeSelectors";
import { fetchAllStores } from "../../features/store/storeThunk";
import { selectCategories } from "../../features/category/categorySelectors";
import { fetchCategories } from "../../features/category/categoryThunk";
import { resolveMediaUrl } from "../../config/env";
import Modal from "../../components/common/Modal";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();

  // The backend's /products/my/ endpoint returns *every* product when the
  // caller is an admin (see MyProductsAPIView), so this doubles as the
  // "all products" list here.
  const products = useAppSelector(selectMyProducts);
  const status = useAppSelector(selectMyProductsStatus);
  const error = useAppSelector(selectMyProductsError);

  const stores = useAppSelector(selectAllStores);
  const categories = useAppSelector(selectCategories);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<ProductPayload>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyProducts());
    dispatch(fetchAllStores());
    dispatch(fetchCategories());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  function storeName(id: number) {
    return stores.find((s) => s.id === id)?.name ?? `#${id}`;
  }

  function categoryName(id: number) {
    return categories.find((c) => c.id === id)?.name ?? `#${id}`;
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm({
      store: product.store,
      category: product.category,
      name: product.name,
      description: product.description,
      brand: product.brand ?? "",
      sku: product.sku ?? "",
      price: product.price,
      discount_price: product.discount_price ?? "",
      stock: product.stock,
      unit: product.unit ?? "",
      is_available: product.is_available,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    setFormError(null);
    setSaving(true);

    const payload: Partial<ProductPayload> = {
      ...form,
      discount_price: form.discount_price === "" ? null : form.discount_price,
    };

    const result = await dispatch(
      updateProduct({ id: editingProduct.id, payload }),
    );
    setSaving(false);

    if (updateProduct.rejected.match(result)) {
      setFormError((result.payload as string) ?? "Something went wrong");
      return;
    }

    setModalOpen(false);
  }

  async function handleToggleAvailability(product: Product) {
    setBusyId(product.id);
    await dispatch(
      updateProduct({
        id: product.id,
        payload: { is_available: !product.is_available },
      }),
    );
    setBusyId(null);
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    setBusyId(product.id);
    await dispatch(deleteProduct(product.id));
    setBusyId(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Every product listed across all stores. Admins can edit or remove
          any listing; creating new products is done by sellers from their
          own store.
        </p>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => dispatch(clearMyProductError())}>
            ✕
          </button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          No products have been listed yet.
        </p>
      )}

      {!isLoading && products.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Store
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Stock
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const primaryImage =
                  product.images.find((img) => img.is_primary) ?? product.images[0];
                const imageUrl = resolveMediaUrl(primaryImage?.image);
                const isBusy = busyId === product.id;
                return (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <span className="font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {storeName(product.store)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {categoryName(product.category)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {product.stock} {product.unit}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggleAvailability(product)}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium disabled:opacity-60 ${
                          product.is_available
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {product.is_available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(product)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && editingProduct && (
        <Modal title="Edit Product" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {formError && (
              <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium text-gray-700">
                Store
                <select
                  required
                  value={form.store ?? ""}
                  onChange={(e) => setForm({ ...form, store: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-gray-700">
                Category
                <select
                  required
                  value={form.category ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, category: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="text-sm font-medium text-gray-700">
              Name
              <input
                required
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Description
              <textarea
                required
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm font-medium text-gray-700">
                Price
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price ?? ""}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Discount price
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.discount_price ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, discount_price: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Stock
                <input
                  required
                  type="number"
                  min="0"
                  value={form.stock ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_available"
                type="checkbox"
                checked={form.is_available ?? true}
                onChange={(e) =>
                  setForm({ ...form, is_available: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="is_available" className="text-sm text-gray-700">
                Available for purchase
              </label>
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
