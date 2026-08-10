import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectAllStores,
  selectAllStoresError,
  selectAllStoresStatus,
} from "../../features/store/storeSelectors";
import {
  deleteStore,
  fetchAllStores,
  toggleStoreStatus,
  updateStoreApproval,
} from "../../features/store/storeThunk";
import type { Store, StoreStatus } from "../../features/store/storeTypes";
import { resolveMediaUrl } from "../../config/env";

const STATUS_STYLES: Record<StoreStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  APPROVED: "bg-green-50 text-green-600 border-green-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
  SUSPENDED: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function AdminStoresPage() {
  const dispatch = useAppDispatch();
  const stores = useAppSelector(selectAllStores);
  const status = useAppSelector(selectAllStoresStatus);
  const error = useAppSelector(selectAllStoresError);

  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllStores());
  }, [dispatch]);

  const isLoading = status === "loading" || status === "idle";

  async function handleStatusChange(store: Store, next: StoreStatus) {
    setBusyId(store.id);
    await dispatch(updateStoreApproval({ id: store.id, status: next }));
    setBusyId(null);
  }

  async function handleToggleOpen(store: Store) {
    setBusyId(store.id);
    await dispatch(toggleStoreStatus(store.id));
    setBusyId(null);
  }

  async function handleDelete(store: Store) {
    if (!window.confirm(`Delete "${store.name}"? This can't be undone.`)) return;
    setBusyId(store.id);
    await dispatch(deleteStore(store.id));
    setBusyId(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stores</h1>
        <p className="mt-1 text-sm text-gray-500">
          Approve, reject, or suspend seller stores across the platform.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && stores.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          No stores have been created yet.
        </p>
      )}

      {!isLoading && stores.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => {
            const logoUrl = resolveMediaUrl(store.logo);
            const isBusy = busyId === store.id;
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
                      {store.owner_name} · {store.city}
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

                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                  {store.status !== "APPROVED" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleStatusChange(store, "APPROVED")}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      Approve
                    </button>
                  )}
                  {store.status !== "REJECTED" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleStatusChange(store, "REJECTED")}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  )}
                  {store.status !== "SUSPENDED" && store.status === "APPROVED" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleStatusChange(store, "SUSPENDED")}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                    >
                      Suspend
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleToggleOpen(store)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${
                      store.is_open
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {store.is_open ? "Open" : "Closed"} · toggle
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(store)}
                    className="ml-auto rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
