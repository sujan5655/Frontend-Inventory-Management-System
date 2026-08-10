import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectMyStores,
  selectStoreError,
  selectStoreStatus,
} from "../../features/store/storeSelectors";
import {
  createStore,
  deleteStore,
  fetchMyStores,
  toggleStoreStatus,
  updateStore,
} from "../../features/store/storeThunk";
import { clearStoreError } from "../../features/store/storeSlice";
import type { Store, StorePayload } from "../../features/store/storeTypes";
import { resolveMediaUrl } from "../../config/env";
import Modal from "../../components/common/Modal";

const emptyForm: StorePayload = {
  name: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  logo: null,
};

const STATUS_STYLES: Record<Store["status"], string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  APPROVED: "bg-green-50 text-green-600 border-green-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
  SUSPENDED: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function SellerStoresPage() {
  const dispatch = useAppDispatch();
  const stores = useAppSelector(selectMyStores);
  const status = useAppSelector(selectStoreStatus);
  const error = useAppSelector(selectStoreError);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [form, setForm] = useState<StorePayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchMyStores());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  function openCreateModal() {
    setEditingStore(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(store: Store) {
    setEditingStore(store);
    setForm({
      name: store.name,
      description: store.description,
      phone: store.phone,
      email: store.email,
      address: store.address,
      city: store.city,
      logo: null,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    const result = editingStore
      ? await dispatch(updateStore({ id: editingStore.id, payload: form }))
      : await dispatch(createStore(form));
    setSaving(false);

    if (
      (editingStore && updateStore.rejected.match(result)) ||
      (!editingStore && createStore.rejected.match(result))
    ) {
      setFormError((result.payload as string) ?? "Something went wrong");
      return;
    }

    setModalOpen(false);
  }

  async function handleDelete(store: Store) {
    if (!window.confirm(`Delete "${store.name}"? This can't be undone.`)) return;
    await dispatch(deleteStore(store.id));
  }

  async function handleToggle(store: Store) {
    await dispatch(toggleStoreStatus(store.id));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Stores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the shop(s) you sell through.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          + New Store
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => dispatch(clearStoreError())}>
            ✕
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && stores.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          You don't have any stores yet. Create one to start listing products.
        </p>
      )}

      {!isLoading && stores.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stores.map((store) => {
            const logoUrl = resolveMediaUrl(store.logo);
            return (
              <div
                key={store.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={store.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No logo
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-gray-800">
                      {store.name}
                    </h3>
                    <p className="truncate text-xs text-gray-500">
                      {store.city} · {store.phone}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[store.status]}`}
                    >
                      {store.status}
                    </span>
                  </div>
                </div>

                <p className="line-clamp-2 text-sm text-gray-500">
                  {store.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(store)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      store.is_open
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {store.is_open ? "Open" : "Closed"} · toggle
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(store)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(store)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <Modal
          title={editingStore ? "Edit Store" : "Create Store"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {formError && (
              <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </p>
            )}

            <label className="text-sm font-medium text-gray-700">
              Store name
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
                Phone (98/97XXXXXXXX)
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-medium text-gray-700">
                City
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, logo: e.target.files?.[0] ?? null })
                  }
                  className="mt-1 w-full text-sm"
                />
              </label>
            </div>

            <label className="text-sm font-medium text-gray-700">
              Address
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
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
                {saving ? "Saving..." : editingStore ? "Save Changes" : "Create Store"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
