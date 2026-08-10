import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import storeReducer from "../features/store/storeSlice";
import categoryReducer from "../features/category/categorySlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import adminUsersReducer from "../features/adminUsers/adminUserSlice";
import ordersReducer from "../features/orders/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    store: storeReducer,
    category: categoryReducer,
    dashboard: dashboardReducer,
    adminUsers: adminUsersReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
