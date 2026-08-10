import axiosInstance from "../../services/axios";
import type { Store, StorePayload } from "./storeTypes";

// The backend expects multipart/form-data because "logo" can be a file.
function toFormData(payload: Partial<StorePayload>): FormData {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value as string | Blob);
  });

  return formData;
}

export async function fetchMyStoresRequest(): Promise<Store[]> {
  const { data } = await axiosInstance.get<Store[]>("/stores/mystore/");
  return data;
}

export async function createStoreRequest(payload: StorePayload): Promise<Store> {
  const { data } = await axiosInstance.post<Store>(
    "/stores/create/",
    toFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function updateStoreRequest(
  id: number,
  payload: Partial<StorePayload>,
): Promise<Store> {
  const { data } = await axiosInstance.put<Store>(
    `/stores/${id}/update/`,
    toFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteStoreRequest(id: number): Promise<void> {
  await axiosInstance.delete(`/stores/${id}/delete/`);
}

export async function toggleStoreStatusRequest(
  id: number,
): Promise<{ is_open: boolean }> {
  const { data } = await axiosInstance.patch<{ is_open: boolean }>(
    `/stores/${id}/toggle/`,
  );
  return data;
}

// =========================
// Admin: All Stores
// =========================

export async function fetchAllStoresRequest(): Promise<Store[]> {
  const { data } = await axiosInstance.get<Store[]>("/stores/");
  return data;
}

export async function updateStoreApprovalRequest(
  id: number,
  status: Store["status"],
): Promise<Store> {
  const { data } = await axiosInstance.patch<Store>(`/stores/${id}/status/`, {
    status,
  });
  return data;
}
