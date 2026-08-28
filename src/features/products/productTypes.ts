export interface ProductImage {
  id: number;
  product: number;
  image: string;
  is_primary: boolean;
}
export interface ProductPayload {
  store: number;
  category: number;
  name: string;
  description: string;
  brand: string;
  sku: string;
  barcode: string;
  price: string;
  discount_price: string | null;
  stock: number;
  unit: string;
  is_available: boolean;
  image: File | null;
  attributes: ProductAttribute[];
}
export interface RelatedProduct {
  id: number;
  store: number;
  category: number;
  name: string;
  price: string;
  discount_price: string | null;
  stock: number;
  is_available: boolean;
  image: string | null;
}
export interface ProductAttribute {
  id: number;
  name: string;
  value: string;
}
export interface Product {
  id: number;

  store: number;

  category: number;

  name: string;

  description: string;

  brand: string;

  sku: string;

  barcode: string;
  price: string;
  discount_price: string | null;
  stock: number;

  sold_count: number;

  unit: string;

  is_available: boolean;

  images: ProductImage[];

  related_products: RelatedProduct[];

  created_at: string;

  updated_at: string;
  attributes?: ProductAttribute[];
}

export type ProductStatus = "idle" | "loading" | "succeeded" | "failed";

export interface ProductState {
  items: Product[];

  myItems: Product[];

  selectedProduct: Product | null;

  status: ProductStatus;

  myStatus: ProductStatus;

  detailStatus: ProductStatus;

  error: string | null;

  myError: string | null;

  detailError: string | null;
}
