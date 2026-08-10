export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: string;
  subtotal: string;
}
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  buyer: number;
  status: OrderStatus;
  total_amount: string;
  delivery_address: string;
  phone: string;
  city: string;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  delivery_address: string;
  phone: string;
  city: string;
}

export type OrderState = {
  myOrders: Order[];
  selectedOrder: Order | null;

  myStatus: "idle" | "loading" | "succeeded" | "failed";
  detailStatus: "idle" | "loading" | "succeeded" | "failed";

  myError: string | null;
  detailError: string | null;

  adminItems: Order[];
  adminStatus: "idle" | "loading" | "succeeded" | "failed";
  adminError: string | null;

  sellerItems?: Order[];
  sellerStatus?: "idle" | "loading" | "succeeded" | "failed";
  sellerError?: string | null;
};

export interface Order {
  id: number;
  buyer: number;
  status: OrderStatus;
  total_amount: string;
  delivery_address: string;
  phone: string;
  city: string;
  created_at: string;
  items: OrderItem[];
}

export type OrderStateStatus = "idle" | "loading" | "succeeded" | "failed";
