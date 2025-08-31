import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Modal,
  Select,
  Table,
  message,
  Descriptions,
  List,
  Card,
} from "antd";
import {EditOutlined} from "@ant-design/icons";
import { formatCurrencyLKR } from "../../shared/utils/currency.js";
import {
  getOrdersByShop,
  updateOrderStatus,
} from "../../service/orderService.js";
import { useNavigate } from "react-router-dom";

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getOrdersByShop();
    if (res.success) {
      setOrders(res.data.orders);
    } else {
      message.error(res.message || "Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdate = (record) => {
    setUpdatingOrder(record);
  };

  const handleSave = async () => {
    if (!updatingOrder) return;
    setLoading(true);
    const res = await updateOrderStatus(
      updatingOrder._id,
      updatingOrder.order_status
    );
    if (res.success) {
      message.success("Order updated");
      fetchOrders();
    } else {
      message.error(res.message || "Update failed");
    }
    setUpdatingOrder(null);
    setLoading(false);
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/products/${productId}`);
    setViewingOrder(null);
  };

  const columns = [
    { title: "Order #", dataIndex: "_id", render: (id) => id.slice(-6) },
    {
      title: "Customer",
      render: (record) =>
        `${record.customer_id?.phone} (${record.customer_id?.address})`,
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      render: (v) => formatCurrencyLKR(v),
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Processing", value: "Processing" },
        { text: "Ready", value: "Ready" },
        { text: "Delivered", value: "Delivered" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.order_status === value,
      render: (s) => (
        <Badge
          status={
            s === "Pending"
              ? "processing"
              : s === "Delivered"
              ? "success"
              : "warning"
          }
          text={s}
        />
      ),
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Paid", value: "Paid" },
        { text: "Failed", value: "Failed" },
        { text: "Refunded", value: "Refunded" },
      ],
      onFilter: (value, record) => record.payment_status === value,
      render: (s, record) => (
        <Badge
          status={s === "Paid" ? "success" : "error"}
          text={`${s} (${record.payment_type})`}
        />
      ),
    },
    { title: "Delivery Address", dataIndex: "delivery_address" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      filters: [
        {
          text: "Last 7 Days",
          value: "last_7_days",
        },
        {
          text: "Last 30 Days",
          value: "last_30_days",
        },
      ],
      onFilter: (value, record) => {
        const createdAt = new Date(record.createdAt);
        const now = new Date();
        if (value === "last_7_days") {
          return createdAt >= new Date(now.setDate(now.getDate() - 7));
        }
        if (value === "last_30_days") {
          return createdAt >= new Date(now.setDate(now.getDate() - 30));
        }
        return false;
      },
      render: (d) => new Date(d).toLocaleString(),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          size="small"
          icon={<EditOutlined />}
          style={{ backgroundColor: "#f0f0f0" }}
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate(record);
          }}
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card title="Orders">
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={orders}
          onRow={(record) => ({
            onClick: () => setViewingOrder(record),
          })}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Update Modal */}
      <Modal
        open={!!updatingOrder}
        title="Update Order Status"
        onCancel={() => setUpdatingOrder(null)}
        onOk={handleSave}
        okText="Save"
      >
        <Select
          value={updatingOrder?.order_status}
          onChange={(val) =>
            setUpdatingOrder({ ...updatingOrder, order_status: val })
          }
          style={{ width: "100%" }}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Processing">Processing</Select.Option>
          <Select.Option value="Ready">Ready</Select.Option>
          <Select.Option value="Delivered">Delivered</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
        </Select>
      </Modal>

      {/* Details Modal */}
      <Modal
        open={!!viewingOrder}
        title={`Order Details (#${viewingOrder?._id?.slice(-6)})`}
        footer={null}
        onCancel={() => setViewingOrder(null)}
        width={700}
      >
        {viewingOrder && (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Customer">
                {viewingOrder.customer_id?.phone} (
                {viewingOrder.customer_id?.address})
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                {formatCurrencyLKR(viewingOrder.total_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="Order Status">
                {viewingOrder.order_status}
              </Descriptions.Item>
              <Descriptions.Item label="Payment">
                {viewingOrder.payment_status} ({viewingOrder.payment_type})
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Address">
                {viewingOrder.delivery_address}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(viewingOrder.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <h3 style={{ marginTop: 16 }}>Items</h3>
            <List
              bordered
              dataSource={viewingOrder.items || []}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      onClick={() =>
                        handleNavigateToProduct(item.product_id._id)
                      }
                    >
                      View Product
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={`${item.product_id?.name} x ${item.quantity}`}
                    description={
                      <>
                        <p>
                          Total: {formatCurrencyLKR(item.price * item.quantity)}
                        </p>
                        {item.selected_customizations?.size && (
                          <p>
                            Size: {item.selected_customizations.size.name} (
                            {formatCurrencyLKR(
                              item.selected_customizations.size.price
                            )}
                            )
                          </p>
                        )}
                        {item.selected_customizations?.custom_message
                          ?.message && (
                          <p>
                            Message:{" "}
                            {
                              item.selected_customizations.custom_message
                                .message
                            }
                          </p>
                        )}
                        {item.selected_customizations?.extra_toppings &&
                          item.selected_customizations.extra_toppings.length >
                            0 && (
                            <p>
                              Toppings:{" "}
                              {item.selected_customizations.extra_toppings
                                .map(
                                  (t) =>
                                    `${t.name} (${formatCurrencyLKR(t.price)})`
                                )
                                .join(", ")}
                            </p>
                          )}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>
    </>
  );
}
