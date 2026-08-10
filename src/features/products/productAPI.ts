import axiosInstance from "../../services/axios";

import type { Product, ProductPayload } from "./productTypes";

// =========================
// Public Products
// =========================

export const fetchProductsRequest = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/products/");

  return response.data;
};

// =========================
// Seller Products
// =========================

export const fetchMyProductsRequest = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/products/my/");

  return response.data;
};

// =========================
// Convert FormData
// =========================

const createFormData = (payload: Partial<ProductPayload>) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });

  return formData;
};

// =========================
// Create Product
// =========================

export const createProductRequest = async (
  payload: ProductPayload,
): Promise<Product> => {
  const response = await axiosInstance.post(
    "/products/create/",
    createFormData(payload),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =========================
// Update Product
// =========================

export const updateProductRequest = async (
  id: number,
  payload: Partial<ProductPayload>,
): Promise<Product> => {
  const response = await axiosInstance.put(
    `/products/${id}/update/`,
    createFormData(payload),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =========================
// Delete Product
// =========================

export const deleteProductRequest = async (id: number) => {
  await axiosInstance.delete(`/products/${id}/delete/`);
};

export const fetchProductDetailRequest = async (
  id: number,
): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}/`);
  return response.data;
};
