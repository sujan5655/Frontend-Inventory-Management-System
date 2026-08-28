import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  createProduct,
  deleteProduct,
  fetchMyProducts,
  updateProduct,
} from "../../features/products/productThunk";

import type {
  Product,
  ProductAttribute,
  ProductPayload,
} from "../../features/products/productTypes";
import {
  selectMyProducts,
  selectMyProductsStatus,
  selectMyProductsError, // you need this selector
} from "../../features/products/productSelectors"; // adjust path if needed
import { clearMyProductError } from "../../features/products/productSlice"; // adjust path

import { selectMyStores } from "../../features/store/storeSelectors";
import { fetchMyStores } from "../../features/store/storeThunk";
import { selectCategories } from "../../features/category/categorySelectors";
import { fetchCategories } from "../../features/category/categoryThunk";
import { resolveMediaUrl } from "../../config/env";
import Modal from "../../components/common/Modal";

const emptyForm: ProductPayload = {
  store: 0,
  category: 0,
  name: "",
  description: "",
  brand: "",
  sku: "",
  barcode: "",
  price: "",
  discount_price: "",
  stock: 0,
  unit: "",
  is_available: true,
  image: null,
  attributes: [],
};

export default function SellerProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectMyProducts);
  const status = useAppSelector(selectMyProductsStatus);
  const error = useAppSelector(selectMyProductsError);

  const stores = useAppSelector(selectMyStores);
  const categories = useAppSelector(selectCategories);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);

  useEffect(() => {
    dispatch(fetchMyProducts());
    dispatch(fetchMyStores());
    dispatch(fetchCategories());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  function openCreateModal() {
    setEditingProduct(null);

    setAttributes([]);

    setForm({
      ...emptyForm,
      store: stores[0]?.id ?? 0,
      category: categories[0]?.id ?? 0,
    });

    setFormError(null);
    setModalOpen(true);
  }

  function addAttribute() {
    setAttributes([
      ...attributes,
      {
        name: "",
        value: "",
      },
    ]);
  }

  function removeAttribute(index: number) {
    setAttributes((current) => current.filter((_, i) => i !== index));
  }

  function updateAttribute(
    index: number,
    field: "name" | "value",
    value: string,
  ) {
    setAttributes((current) =>
      current.map((attribute, i) =>
        i === index
          ? {
              ...attribute,
              [field]: value,
            }
          : attribute,
      ),
    );
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);

    setAttributes(
      product.attributes?.map((attribute) => ({
        id: attribute.id,
        name: attribute.name,
        value: attribute.value,
      })) ?? [],
    );

    setForm({
      store: product.store,
      category: product.category,
      name: product.name,
      description: product.description,
      brand: product.brand ?? "",
      sku: product.sku ?? "",
      barcode: product.barcode ?? "",
      price: product.price,
      discount_price: product.discount_price ?? "",
      stock: product.stock,
      unit: product.unit ?? "",
      is_available: product.is_available,
      image: null,
      attributes: [],
    });

    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.store) {
      setFormError("Create a store first — products must belong to one.");
      return;
    }

    if (!form.category) {
      setFormError("Create a category first — products must belong to one.");
      return;
    }

    setSaving(true);

    const payload: ProductPayload = {
      ...form,
      discount_price: form.discount_price === "" ? null : form.discount_price,

      attributes: attributes.filter(
        (attribute) =>
          attribute.name.trim() !== "" && attribute.value.trim() !== "",
      ),
    };

    const result = editingProduct
      ? await dispatch(
          updateProduct({
            id: editingProduct.id,
            payload,
          }),
        )
      : await dispatch(createProduct(payload));

    setSaving(false);

    if (
      (editingProduct && updateProduct.rejected.match(result)) ||
      (!editingProduct && createProduct.rejected.match(result))
    ) {
      setFormError((result.payload as string) ?? "Something went wrong");
      return;
    }

    setModalOpen(false);
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    await dispatch(deleteProduct(product.id));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Products listed under your own store(s).
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          + New Product
        </button>
      </div>

      {stores.length === 0 && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You need a store before you can add products. Head to the Stores tab
          to create one first.
        </p>
      )}

      {error && !isModalOpen && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => dispatch(clearMyProductError())}>
            ✕
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          No products yet.
        </p>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const primaryImage =
              product.images.find((img) => img.is_primary) ?? product.images[0];
            const imageUrl = resolveMediaUrl(primaryImage?.image);
            return (
              <div
                key={product.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="truncate text-sm font-semibold text-gray-800">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-800">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.discount_price && (
                    <span className="text-xs text-gray-400 line-through">
                      ${Number(product.discount_price).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Stock: {product.stock} {product.unit}
                </p>
                <span
                  className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                    product.is_available
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {product.is_available ? "Available" : "Unavailable"}
                </span>
                <div className="mt-auto flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <Modal
          title={editingProduct ? "Edit Product" : "Create Product"}
          onClose={() => setModalOpen(false)}
        >
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
                  value={form.store || ""}
                  onChange={(e) =>
                    setForm({ ...form, store: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select store
                  </option>
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
                  value={form.category || ""}
                  onChange={(e) =>
                    setForm({ ...form, category: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select category
                  </option>
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
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Description
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium text-gray-700">
                Brand
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Unit (e.g. kg, pcs)
                <input
                  required
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Product Attributes
                  </h3>

                  <p className="text-xs text-gray-500">
                    Add specifications specific to this product.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addAttribute}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                >
                  + Add Attribute
                </button>
              </div>

              {attributes.length === 0 && (
                <p className="text-xs text-gray-400">No attributes added.</p>
              )}

              <div className="space-y-2">
                {attributes.map((attribute, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Attribute name"
                      value={attribute.name}
                      onChange={(e) =>
                        updateAttribute(index, "name", e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Value"
                      value={attribute.value}
                      onChange={(e) =>
                        updateAttribute(index, "value", e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium text-gray-700">
                SKU
                <input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Barcode
                <input
                  value={form.barcode}
                  onChange={(e) =>
                    setForm({ ...form, barcode: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm font-medium text-gray-700">
                Price
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
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
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
            </div>

            <label className="text-sm font-medium text-gray-700">
              Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files?.[0] ?? null })
                }
                className="mt-1 w-full text-sm"
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.is_available ?? true}
                onChange={(e) =>
                  setForm({ ...form, is_available: e.target.checked })
                }
              />
              Available for sale
            </label>

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
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Save Changes"
                    : "Create Product"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
