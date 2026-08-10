import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCategories,
  selectCategoryError,
  selectCategoryStatus,
} from "../../features/category/categorySelectors";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../../features/category/categoryThunk";
import { clearCategoryError } from "../../features/category/categorySlice";
import type {
  Category,
  CategoryPayload,
} from "../../features/category/categoryTypes";
import { resolveMediaUrl } from "../../config/env";
import Modal from "../../components/common/Modal";

const emptyForm: CategoryPayload = {
  name: "",
  description: "",
  image: null,
};

export default function SellerCategoriesPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const status = useAppSelector(selectCategoryStatus);
  const error = useAppSelector(selectCategoryError);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryPayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  function openCreateModal() {
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description,
      image: null,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    const result = editingCategory
      ? await dispatch(
          updateCategory({ id: editingCategory.id, payload: form }),
        )
      : await dispatch(createCategory(form));
    setSaving(false);

    if (
      (editingCategory && updateCategory.rejected.match(result)) ||
      (!editingCategory && createCategory.rejected.match(result))
    ) {
      setFormError((result.payload as string) ?? "Something went wrong");
      return;
    }

    setModalOpen(false);
  }

  async function handleDelete(category: Category) {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    await dispatch(deleteCategory(category.id));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the categories your products can be listed under.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          + New Category
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => dispatch(clearCategoryError())}>
            ✕
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && categories.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          No categories yet. Create one before adding products.
        </p>
      )}

      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const imageUrl = resolveMediaUrl(category.image);
            return (
              <div
                key={category.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="truncate text-sm font-semibold text-gray-800">
                  {category.name}
                </h3>
                <p className="line-clamp-2 text-xs text-gray-500">
                  {category.description || "No description"}
                </p>
                <div className="mt-auto flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(category)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
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
          title={editingCategory ? "Edit Category" : "Create Category"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {formError && (
              <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </p>
            )}

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
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </label>

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
                  : editingCategory
                    ? "Save Changes"
                    : "Create Category"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
