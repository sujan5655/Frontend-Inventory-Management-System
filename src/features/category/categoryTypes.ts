export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
  image?: File | null;
}

export type CategoryOpStatus = "idle" | "loading" | "succeeded" | "failed";

export interface CategoryState {
  items: Category[];
  status: CategoryOpStatus;
  error: string | null;
}
