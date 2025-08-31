import { Button, Table, Card, Switch } from "antd";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";
import { useEffect, useState } from "react";
import { getAllShops, updateShopStatus } from "../../service/shopService.js";

export default function ShopsApprovalPage() {
  const [data, setData] = useState([]);
  const { showError, showSuccess } = useNotification();
  const [loading, setLoading] = useState(false);

  const getAllShopsForAdmin = async () => {
    try {
      setLoading(true);
      const response = await getAllShops();
      setData(response.data);
    } catch (error) {
      showError("Failed to fetch shops: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, isActive) => {
    try {
      setLoading(true);
      await updateShopStatus(id, { isActive });
      getAllShopsForAdmin();
      showSuccess(
        `Shop status ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      showError(`Failed to update shop status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllShopsForAdmin();
  }, []);

  return (
    <Card title="Shops Management">
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        columns={[
          {
            title: "ID",
            dataIndex: "_id",
          },
          {
            title: "Name",
            dataIndex: "shopName",
            filters: Array.from(
              new Set(data.map((shop) => shop.shopName).filter(Boolean))
            ).map((name) => ({ text: name, value: name })),
            onFilter: (value, record) => record.shopName === value,
          },
          {
            title: "Email",
            dataIndex: "email",
            render: (_, record) => record.user.email,
            filters: Array.from(
              new Set(data.map((shop) => shop.user?.email).filter(Boolean))
            ).map((email) => ({ text: email, value: email })),
            onFilter: (value, record) => record.user?.email === value,
          },
          {
            title: "Province",
            dataIndex: "province",
            render: (_, record) => record.shopAddress[0]?.province,
            filters: Array.from(
              new Set(
                data
                  .map((shop) => shop.shopAddress[0]?.province)
                  .filter(Boolean)
              )
            ).map((province) => ({ text: province, value: province })),
            onFilter: (value, record) =>
              record.shopAddress[0]?.province === value,
          },
          {
            title: "Action",
            render: (_, record) => (
              <Switch
                checked={record.isActive}
                onChange={(checked) => handleStatusChange(record._id, checked)}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
