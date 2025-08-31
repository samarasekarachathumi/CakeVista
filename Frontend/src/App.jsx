import { ConfigProvider, theme } from "antd";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./shared/layouts/AppLayout.jsx";
import PublicLayout from "./shared/layouts/PublicLayout.jsx";
import HomePage from "./pages/public/HomePage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import RegisterPage from "./pages/public/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import ContactPage from "./pages/public/ContactPage.jsx";
import ShopSearchPage from "./pages/public/ShopSearchPage.jsx";
import CakeSearchPage from "./pages/public/CakeSearchPage.jsx";
import ShopProfilePage from "./pages/public/ShopProfilePage.jsx";
import ProductDetailPage from "./pages/customer/ProductDetailPage.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import PurchasePage from "./pages/customer/PurchasePage.jsx";
import OrderConfirmationPage from "./pages/customer/OrderConfirmationPage.jsx";
import OrdersPage from "./pages/customer/OrdersPage.jsx";
import TestNotificationPage from "./pages/customer/TestNotificationPage.jsx";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage.jsx";
import CustomerHomePage from "./pages/customer/CustomerHomePage.jsx";
import CustomerShopListPage from "./pages/customer/CustomerShopListPage.jsx";
import CustomerShopProfilePage from "./pages/customer/CustomerShopProfilePage.jsx";
import CheckoutPage from "./pages/customer/CheckoutPage.jsx";
import OrderDetailPage from "./pages/customer/OrderDetailPage.jsx";
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage.jsx";
import OwnerOrdersPage from "./pages/owner/OwnerOrdersPage.jsx";
import OwnerProductsPage from "./pages/owner/OwnerProductsPage.jsx";
import OwnerAdsPage from "./pages/owner/OwnerAdsPage.jsx";
import ShopProfileEditPage from "./pages/owner/ShopProfileEditPage.jsx";
import ProductFormPage from "./pages/owner/ProductFormPage.jsx";
import ProductEditPage from "./pages/owner/ProductEditPage.jsx";
import CreateAdPage from "./pages/owner/CreateAdPage.jsx";
import {
  AdminDashboardPage,
  ShopsApprovalPage,
  AdsManagementPage,
  AdminUsersPage,
} from "./pages/admin/index.js";
import NotFoundPage from "./pages/common/NotFoundPage.jsx";
import ProtectedRoute from "./shared/routes/ProtectedRoute.jsx";
import { Roles } from "./shared/constants/roles.js";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#E75480",
          colorSuccess: "#6B4226",
          colorWarning: "#FFD700",
          colorError: "#FF4D4F",
          colorInfo: "#FFB6C1",
          colorBgBase: "#FFF5E1",
          colorTextBase: "#333333",
          colorBorder: "#EADBC8",
          colorLink: "#E75480",
          colorLinkHover: "#C7436A",
          colorLinkActive: "#A73255",
          fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif",
          borderRadius: 12,
          wireframe: false,
        },
        components: {
          Button: {
            borderRadius: 16,
            controlHeight: 42,
            colorPrimaryHover: "#C7436A",
            colorPrimaryActive: "#A73255",
          },
          Card: {
            borderRadiusLG: 16,
            paddingLG: 20,
            colorBgContainer: "#FFFFFF",
          },
          Layout: {
            headerBg: "#E75480",
            headerColor: "#FFFFFF",
            footerBg: "#FFF5E1",
          },
          Menu: {
            itemColor: "#333333",
            itemHoverColor: "#E75480",
            itemSelectedColor: "#E75480",
            colorBgContainer: "#FFF5E1",
          },
          Input: {
            activeBorderColor: "#E75480",
            hoverBorderColor: "#E75480",
          },
          Message: {
            borderRadius: 8,
            contentPadding: "8px 16px",
          },
          Notification: {
            borderRadius: 8,
            padding: "12px 16px",
          },
        },
      }}
    >
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="shops" element={<ShopSearchPage />} />
          <Route path="cakes" element={<CakeSearchPage />} />
          <Route path="shop/:shopId" element={<ShopProfilePage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="customer/cart" element={<CartPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={[Roles.Customer]}>
              <AppLayout role={Roles.Customer} />
            </ProtectedRoute>
          }
        >
          <Route path="customer/home" element={<CustomerHomePage />} />
          <Route path="customer/shops" element={<CustomerShopListPage />} />
          <Route
            path="customer/shops/:id"
            element={<CustomerShopProfilePage />}
          />
          <Route path="purchase" element={<PurchasePage />} />
          <Route
            path="order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="customer/checkout" element={<CheckoutPage />} />
          <Route path="customer/orders" element={<OrdersPage />} />
          <Route path="customer/orders/:id" element={<OrderDetailPage />} />
          <Route path="customer/profile" element={<CustomerProfilePage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={[Roles.ShopOwner]}>
              <AppLayout role={Roles.ShopOwner} />
            </ProtectedRoute>
          }
        >
          <Route path="owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="owner/orders" element={<OwnerOrdersPage />} />
          <Route path="owner/orders/:id" element={<OrderDetailPage />} />
          <Route path="owner/products" element={<OwnerProductsPage />} />
          <Route path="owner/products/new" element={<ProductFormPage />} />
          <Route path="owner/products/:id/edit" element={<ProductEditPage />} />
          <Route path="owner/ads" element={<OwnerAdsPage />} />
          <Route path="owner/ads/new" element={<CreateAdPage />} />
          <Route path="owner/shop-profile" element={<ShopProfileEditPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={[Roles.Admin]}>
              <AppLayout role={Roles.Admin} />
            </ProtectedRoute>
          }
        >
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="admin/shops" element={<ShopsApprovalPage />} />
          <Route path="admin/ads" element={<AdsManagementPage />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
