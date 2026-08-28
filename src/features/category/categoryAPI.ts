import axiosInstance from "../../services/axios";
import type { Category, CategoryPayload } from "./categoryTypes";

function toFormData(payload: Partial<CategoryPayload>): FormData {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value as string | Blob);
  });

  return formData;
}

export async function fetchCategoriesRequest(): Promise<Category[]> {
  const { data } = await axiosInstance.get<Category[]>("/categories/");
  console.log("categories response data from api", data);
  return data;
}

export async function createCategoryRequest(
  payload: CategoryPayload,
): Promise<Category> {
  const { data } = await axiosInstance.post<Category>(
    "/categories/create/",
    toFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function updateCategoryRequest(
  id: number,
  payload: Partial<CategoryPayload>,
): Promise<Category> {
  const { data } = await axiosInstance.put<Category>(
    `/categories/${id}/update/`,
    toFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteCategoryRequest(id: number): Promise<void> {
  await axiosInstance.delete(`/categories/${id}/delete/`);
}
