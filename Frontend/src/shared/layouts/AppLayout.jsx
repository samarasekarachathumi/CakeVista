import { ConfigProvider, Layout, Menu, Badge } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import {
  ShoppingCartOutlined,
  DashboardOutlined,
  AppstoreAddOutlined,
  ProductOutlined,
  FireOutlined,
  ShopOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Roles } from "../constants/roles.js";

const { Header, Content, Footer } = Layout;

export default function AppLayout({ role }) {
  const location = useLocation();
  const { logout } = useAuth();
  const { items } = useCart();
  const selectedKey = `/${location.pathname.split("/").slice(0, 3).join("/")}`;

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const ownerItems = [
    {
      key: "/owner/dashboard",
      label: (
        <Link to="/owner/dashboard">
          <Badge size="small">
            <DashboardOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Dashboard</span>
        </Link>
      ),
    },
    {
      key: "/owner/orders",
      label: (
        <Link to="/owner/orders">
          <Badge size="small">
            <PieChartOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Orders</span>
        </Link>
      ),
    },
    {
      key: "/owner/products",
      label: (
        <Link to="/owner/products">
          <Badge size="small">
            <ProductOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Products</span>
        </Link>
      ),
    },
    {
      key: "/owner/ads",
      label: (
        <Link to="/owner/ads">
          <Badge size="small">
            <FireOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Ads</span>
        </Link>
      ),
    },
    {
      key: "/owner/shop-profile",
      label: (
        <Link to="/owner/shop-profile">
          <Badge size="small">
            <ShopOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Shop Profile</span>
        </Link>
      ),
    },
  ];

  const customerItems = [
    {
      key: "/customer/home",
      label: (
        <Link to="/customer/home">
          <Badge size="small">
            <HomeOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Home</span>
        </Link>
      ),
    },
    {
      key: "/customer/shops",
      label: (
        <Link to="/customer/shops">
          <Badge size="small">
            <AppstoreAddOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Shops</span>
        </Link>
      ),
    },
    {
      key: "/customer/orders",
      label: (
        <Link to="/customer/orders">
          <Badge size="small">
            <PieChartOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Orders</span>
        </Link>
      ),
    },
    {
      key: "/customer/profile",
      label: (
        <Link to="/customer/profile">
          <Badge size="small">
            <UserOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Profile</span>
        </Link>
      ),
    },
    {
      key: "/customer/cart",
      label: (
        <Link to="/customer/cart">
          <Badge count={cartItemCount} size="small">
            <ShoppingCartOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Cart</span>
        </Link>
      ),
    },
  ];

  const adminItems = [
    {
      key: "/admin/dashboard",
      label: (
        <Link to="/admin/dashboard">
          <Badge size="small">
            <DashboardOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Dashboard</span>
        </Link>
      ),
    },
    {
      key: "/admin/shops",
      label: (
        <Link to="/admin/shops">
          <Badge size="small">
            <ShopOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Shops</span>
        </Link>
      ),
    },
    {
      key: "/admin/ads",
      label: (
        <Link to="/admin/ads">
          <Badge size="small">
            <FireOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Ads</span>
        </Link>
      ),
    },
    {
      key: "/admin/users",
      label: (
        <Link to="/admin/users">
          <Badge size="small">
            <UserOutlined style={{ fontSize: 18, color: "#fff" }} />
          </Badge>
          <span style={{ marginLeft: 8, color: "#fff" }}>Users</span>
        </Link>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            marginRight: 24,
            fontSize: 18,
          }}
        >
          {role === Roles.Customer && (
            <Link to="/" style={{ color: "#fff" }}>
              Cake Vista
            </Link>
          )}
          {role === Roles.Admin && (
            <Link to="/admin/dashboard" style={{ color: "#fff" }}>
              Cake Vista
            </Link>
          )}
          {role === Roles.ShopOwner && (
            <Link to="/owner/dashboard" style={{ color: "#fff" }}>
              Cake Vista
            </Link>
          )}
        </div>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemColor: "#FFFFFF",
                itemHoverColor: "#FFFFFF",
                itemSelectedColor: "#FFFFFF",
                horizontalItemHoverBg: "transparent",
              },
            },
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={
              role === Roles.ShopOwner
                ? ownerItems
                : role === Roles.Admin
                ? adminItems
                : customerItems
            }
            style={{ flex: 1, background: "transparent" }}
          />
        </ConfigProvider>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemColor: "#FFFFFF",
                itemHoverColor: "#FFFFFF",
                itemSelectedColor: "#FFFFFF",
                horizontalItemHoverBg: "transparent",
              },
            },
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false}
            style={{ background: "transparent" }}
            items={[
              {
                key: "logout",
                label: (
                  <a onClick={logout}>
                    <Badge size="small">
                      <LogoutOutlined style={{ fontSize: 18, color: "#fff" }} />
                    </Badge>
                    <span style={{ marginLeft: 8, color: "#fff" }}>Logout</span>
                  </a>
                ),
              },
            ]}
          />
        </ConfigProvider>
      </Header>
      <Content
        style={{
          padding: "24px 32px",
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        © {new Date().getFullYear()} Cake Vista
      </Footer>
    </Layout>
  );
}
