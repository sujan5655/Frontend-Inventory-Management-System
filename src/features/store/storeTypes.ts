export type StoreStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

// This "Store" is a seller's shop (a database row). It has nothing to do
// with app/store.ts, which is the Redux store that holds all app state.
export interface Store {
  id: number;
  owner: number;
  owner_name: string;
  name: string;
  description: string;
  logo: string | null;
  phone: string;
  email: string;
  address: string;
  city: string;
  status: StoreStatus;
  is_open: boolean;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

// Fields the seller can submit when creating/updating a store.
export interface StorePayload {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  logo?: File | null;
}

export type StoreOpStatus = "idle" | "loading" | "succeeded" | "failed";

export interface StoreState {
  items: Store[];
  status: StoreOpStatus;
  error: string | null;

  // Admin: every store in the system (not just the logged-in seller's).
  allItems: Store[];
  allStatus: StoreOpStatus;
  allError: string | null;
}
