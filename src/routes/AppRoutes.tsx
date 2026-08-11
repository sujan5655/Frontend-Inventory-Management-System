import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/home/HomePage";
import AdminLayout from "../layouts/AdminLayout";
import SellerLayout from "../layouts/SellerLayout";
import MainLayout from "../layouts/Mainlayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import SellerStoresPage from "../pages/seller/SellerStoresPage";
import SellerCategoriesPage from "../pages/seller/SellerCategoriesPage";
import SellerProductsPage from "../pages/seller/SellerProductsPage";
import SellerDashboardPage from "../pages/seller/SellerDashboardPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminStoresPage from "../pages/admin/AdminStoresPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import BuyerDashboard from "../pages/buyer/BuyerDashboard";

import MyOrdersPage from "../pages/buyer/MyOrdersPage";
import OrderDetailPage from "../pages/buyer/OrderDetailPage";
import CheckoutPage from "../pages/buyer/CheckoutPage";
import CartPage from "../pages/cart/CartPage";
import PaymentSuccessPage from "../pages/payments/paymentSuccessPage";
import PaymentFailurePage from "../pages/payments/paymentFailurepage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Route>

      {/* Public storefront — visible to everyone, logged in or not.
          Adding items to the cart is gated behind login inside ProductCard. */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/buyer/orders" element={<MyOrdersPage />} />

        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/buyer/orders" element={<MyOrdersPage />} />

        <Route path="/buyer/orders/:id" element={<OrderDetailPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["BUYER"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/payment/success" element={<PaymentSuccessPage />} />

            <Route path="/payment/failure" element={<PaymentFailurePage />} />
            <Route path="/buyer" element={<BuyerDashboard />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/buyer/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["SELLER"]} />}>
          <Route element={<SellerLayout />}>
            <Route path="/seller" element={<SellerDashboardPage />} />
            <Route path="/seller/stores" element={<SellerStoresPage />} />
            <Route
              path="/seller/categories"
              element={<SellerCategoriesPage />}
            />
            <Route path="/seller/products" element={<SellerProductsPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/stores" element={<AdminStoresPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
