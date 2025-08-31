import { ConfigProvider, Layout, Menu, Badge } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import {
  ShoppingCartOutlined,
  ShopOutlined,
  HomeOutlined,
  GiftOutlined,
  LoginOutlined,
  UserAddOutlined,
  DashboardOutlined,
  LogoutOutlined,
  PieChartOutlined
} from "@ant-design/icons";
import { Roles } from "../constants/roles.js";

const { Header, Content, Footer } = Layout;

export default function PublicLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const selectedKey =
    location.pathname === "/" ? "/" : `/${location.pathname.split("/")[1]}`;

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
          <Link to="/" style={{ color: "#fff" }}>
            Cake Vista
          </Link>
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
            items={[
              {
                key: "/",
                label: (
                  <Link to="/">
                    <Badge size="small">
                      <HomeOutlined style={{ fontSize: 18, color: "#fff" }} />
                      <span style={{ marginLeft: 8, color: "#fff" }}>Home</span>
                    </Badge>
                  </Link>
                ),
              },
              {
                key: "/shops",
                label: (
                  <Link to="/shops">
                    <Badge size="small">
                      <ShopOutlined style={{ fontSize: 18, color: "#fff" }} />
                    </Badge>
                    <span style={{ marginLeft: 8, color: "#fff" }}>Shops</span>
                  </Link>
                ),
              },
              {
                key: "/cakes",
                label: (
                  <Link to="/cakes">
                    <Badge size="small">
                      <GiftOutlined style={{ fontSize: 18, color: "#fff" }} />
                    </Badge>
                    <span style={{ marginLeft: 8, color: "#fff" }}>Cakes</span>
                  </Link>
                ),
              },
              {
                key: "/customer/cart",
                label: (
                  <Link to="/customer/cart">
                    <Badge size="small" count={cartItemCount}>
                      <ShoppingCartOutlined
                        style={{ fontSize: 18, color: "#fff" }}
                      />
                      <span style={{ marginLeft: 8, color: "#fff" }}>Cart</span>
                    </Badge>
                  </Link>
                ),
              },
            ]}
            style={{ flex: 1, background: "transparent" }}
          />
        </ConfigProvider>
        {user ? (
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
                  key: "hi",
                  label: (
                    <span
                      style={{ color: "#fff" }}
                    >{`Hi, ${user.firstName}`}</span>
                  ),
                },
                ...(user.role === Roles.Customer
                  ? [
                      {
                        key: "orders",
                        label: (
                          <Link to="/customer/orders">
                            <Badge size="small">
                              <PieChartOutlined
                                style={{ fontSize: 18, color: "#fff" }}
                              />
                            </Badge>
                            <span style={{ marginLeft: 8, color: "#fff" }}>
                              Orders
                            </span>
                          </Link>
                        ),
                      },
                    ]
                  : [
                      {
                        key: "dashboard",
                        label: (
                          <Link to="/owner/dashboard" >
                            <Badge size="small">
                              <DashboardOutlined
                                style={{ fontSize: 18, color: "#fff" }}
                              />
                            </Badge>
                            <span style={{ marginLeft: 8, color: "#fff" }}>
                              Dashboard
                            </span>
                          </Link>
                        ),
                      },
                    ]),
                {
                  key: "logout",
                  label: (
                    <a style={{ color: "#fff" }} onClick={logout}>
                      <Badge size="small">
                        <LogoutOutlined
                          style={{ fontSize: 18, color: "#fff" }}
                        />
                      </Badge>
                      <span style={{ marginLeft: 8, color: "#fff" }}>
                        Logout
                      </span>
                    </a>
                  ),
                },
              ]}
            />
          </ConfigProvider>
        ) : (
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
                  key: "login",
                  label: (
                    <Link to="/login">
                      <Badge size="small">
                        <LoginOutlined
                          style={{ fontSize: 18, color: "#fff" }}
                        />
                        <span style={{ marginLeft: 8, color: "#fff" }}>
                          Login
                        </span>
                      </Badge>
                    </Link>
                  ),
                },
                {
                  key: "register",
                  label: (
                    <Link to="/register">
                      <Badge size="small">
                        <UserAddOutlined
                          style={{ fontSize: 18, color: "#fff" }}
                        />
                        <span style={{ marginLeft: 8, color: "#fff" }}>
                          Register
                        </span>
                      </Badge>
                    </Link>
                  ),
                },
              ]}
            />
          </ConfigProvider>
        )}
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
