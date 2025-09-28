import { Card, Col, Row, Statistic, Table, Tag, Switch, Spin } from "antd";
import { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";
import { getAllAdvertisements } from "../../service/advertisementService";
import { getAllUsers } from "../../service/userService";
import { getAllShops } from "../../service/shopService.js";
import { getAllOrders } from "../../service/orderService.js";

export default function AdminDashboardPage() {
  const [rows, setRows] = useState([]);
  const { showError } = useNotification();
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

    const getAllShopsForAdmin = async () => {
      try {
        setLoading(true);//sp
        const response = await getAllShops();
        setShops(response.data);
      } catch (error) {
        showError("Failed to fetch shops: " + error.message);
      } finally {
        setLoading(false);
      }
    };

  const getAllUserDetails = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      showError("Failed to fetch user details: " + error.message);
    }
  };

  const getAllOrdersForAdmin = async () => {
    try {
      const response = await getAllOrders();
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showError("Failed to fetch orders: " + error.message);
    }
  };

  const weeklySignUpByStatus = useMemo(() => {
    if (!users.length) return [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = days.map((day) => ({
      day,
      active: 0,
      blocked: 0,
    }));
    users.forEach((user) => {
      if (user.createdAt) {
        const dayIndex = new Date(user.createdAt).getDay();
        if (user.isActive) {
          counts[dayIndex].active += 1;
        } else {
          counts[dayIndex].blocked += 1;
        }
      }
    });

    return counts;
  }, [users]);

  const paymentSummary = Object.values(//Creates a new array from the values of an object
    rows.reduce((acc, item) => {
      if (item.paymentStatus === "completed" && item.shopDetails) {
        const shopName = item.shopDetails.shopName;

        if (!acc[shopName]) {
          acc[shopName] = { name: shopName, value: 0 };//If this shop hasn’t been seen before, initialize an object with name and value (counter).
        }

        acc[shopName].value += 1;
      }
      return acc;
    }, {})
  );

  const currentYear = new Date().getFullYear();

  const adsThisYear = rows.filter((ad) => {
    if (!ad.createdAt) return false;
    return new Date(ad.createdAt).getFullYear() === currentYear;
  });

  const completedAdsThisYear = adsThisYear.filter(
    (ad) => ad.paymentStatus === "completed"
  ).length;

  const failedAdsThisYear = adsThisYear.filter(
    (ad) => ad.paymentStatus === "failed"
  ).length;

  const getAllAdsForAdmin = async () => {
    try {
      const response = await getAllAdvertisements();
      setRows(response.data);
    } catch (error) {
      showError("Failed to fetch ads:", error.message);
    }
  };

  useEffect(() => {
    getAllAdsForAdmin();
    getAllUserDetails();
    getAllShopsForAdmin();
    getAllOrdersForAdmin();
  }, []);

  const STATUS_COLORS = ["#73d13d", "#faad14", "#ff4d4f"];

  return (
    <div>
      <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
        <Card>
            <Row gutter={16}>
              <div
                style={{
                  justifyContent: "center",
                  display: "flex",
                  width: "100%",
                  fontWeight: 700,
                }}
              >
              </div>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Available Shops" value={shops.filter(shop => shop.isActive === true).length} />
              </Col>
              <Col span={12}>
                <Statistic title="Disabled Shops" value={shops.filter(shop => shop.isActive === false).length} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Row gutter={16}>
              <div
                style={{
                  justifyContent: "center",
                  display: "flex",
                  width: "100%",
                  fontWeight: 700,
                }}
              >
              </div>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Completed Ads" value={completedAdsThisYear} />
              </Col>
              <Col span={12}>
                <Statistic title="Failed Ads" value={failedAdsThisYear} />
              </Col>
            </Row>
          </Card>
        </Col>
        
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={14}>
          <Card title="Weekly Signups">
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart
                  data={weeklySignUpByStatus}
                  margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="active"
                    name="Active Users"
                    stroke="#3d5426ff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="blocked"
                    name="Blocked Users"
                    stroke="#ff4d4f"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Legend verticalAlign="bottom" height={24} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card title="Ads Performance">
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={paymentSummary}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    label
                  >
                    {paymentSummary.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={24} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Recent Ads">
            <Table
              rowKey="id"
              size="small"
              dataSource={rows}
              pagination={{ pageSize: 5 }}
              columns={[
                { title: "ID", dataIndex: "_id", width: 80 },
                { title: "Title", dataIndex: "title" },
                {
                  title: "Payment",
                  dataIndex: "paymentStatus",
                  render: (status) => (
                    <Tag
                      color={
                        status === "pending"
                          ? "orange"
                          : status === "completed"
                          ? "green"
                          : status === "failed"
                          ? "red"
                          : ""
                      }
                    >
                      {status}
                    </Tag>
                  ),
                },
                {
                  title: "Is Active",
                  dataIndex: "isActive",
                  render: (isActive) => <Switch checked={isActive} disabled />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
      </Spin>
    </div>
  );
}
