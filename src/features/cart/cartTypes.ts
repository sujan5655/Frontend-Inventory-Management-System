export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface CartResponse {
  items: CartItem[];
  total_items: number;
  subtotal: string | number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;

  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
