import { Card, Col, Row, Statistic, Spin } from "antd";
import { formatCurrencyLKR } from "../../shared/utils/currency.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getOrdersByShop } from "../../service/orderService.js";
import { useEffect, useState } from "react";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";
import { getAdvertisementsDetailsByShopId } from "../../service/advertisementService.js";

export default function OwnerDashboardPage() {
  const [loading, setLoading] = useState(false);
  const { showError } = useNotification();
  const [shopOrderDetails, setShopOrderDetails] = useState(null);
  const [ads, setAds] = useState([]);

  const getShopOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrdersByShop();
      setShopOrderDetails(response.data.orders);
    } catch (error) {
      showError("Failed to fetch ads: " + error.message);
    } finally {
      setLoading(false);
    }
  };

const getWeeklySalesData = (shopOrderDetails) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return weekDays.map((day) => {
    const dailySales = shopOrderDetails
      ?.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const weekdayName = orderDate.toLocaleDateString("en-US", {
          weekday: "short",
        });
        return weekdayName === day;
      })
      .reduce((sum, order) => sum + order.total_amount, 0);

    return {
      name: day,
      sales: dailySales || 0,
    };
  });
};

const getBestSellers = (shopOrderDetails) => {
  const productCount = {};

  shopOrderDetails?.forEach((order) => {
    const uniqueProducts = new Set(
      order.items.map((item) => item.product_id?.name || "Unknown")
    );

    uniqueProducts.forEach((name) => {
      productCount[name] = (productCount[name] || 0) + 1;
    });
  });

  return Object.entries(productCount)
    .map(([name, orders]) => ({ name, orders }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);
};

  const getAdsDetails = async () => {
    try {
      const response = await getAdvertisementsDetailsByShopId();
      setAds(response.data);
    } catch (error) {
      showError("Failed to fetch ads:", error.message);
    }
  };

  useEffect(() => {
    getShopOrderDetails();
    getAdsDetails();
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Sales"
                valueRender={() => (
                  <strong>
                    {formatCurrencyLKR(
                      shopOrderDetails?.reduce(
                        (sum, order) => sum + order.total_amount,
                        0
                      )
                    )}
                  </strong>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="Orders" value={shopOrderDetails?.length || 0} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Active Ads"
                value={ads.filter((ad) => ad.isActive === true).length}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={16}>
            <Card title="Weekly Sales">
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={getWeeklySalesData(shopOrderDetails)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Best Sellers">
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={getBestSellers(shopOrderDetails)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
