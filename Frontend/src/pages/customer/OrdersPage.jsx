import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Spin,
  message,
  Modal,
  Descriptions,
  List,
  Card,
} from "antd";
import { formatCurrencyLKR } from "../../shared/utils/currency.js";
import { getOrdersByCustomer } from "../../service/orderService.js";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const res = await getOrdersByCustomer();

      if (res.success) {
        setOrders(res.data.orders);
      } else {
        message.error(res.message || "Failed to load orders");
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order #",
      dataIndex: "_id",
      render: (id) => id.slice(-6),
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      render: (v) => formatCurrencyLKR(v),
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      render: (s) => (
        <Tag
          color={
            s === "Delivered" ? "green" : s === "Pending" ? "orange" : "blue"
          }
        >
          {s}
        </Tag>
      ),
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      render: (s, record) => (
        <Tag color={s === "Paid" ? "green" : "red"}>
          {`${s} (${record.payment_type})`}
        </Tag>
      ),
    },
    {
      title: "Delivery Address",
      dataIndex: "delivery_address",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleString(),
    },
    {
      title: "Items",
      dataIndex: "items",
      render: (items) => items.length,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Card title="Orders">
        <Table
          rowKey="_id"
          dataSource={orders}
          onRow={(record) => ({
            onClick: () => setViewingOrder(record),
          })}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>

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
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{ marginBottom: "16px" }}
            >
              <Descriptions.Item label="Order Status">
                {viewingOrder.order_status}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                {formatCurrencyLKR(viewingOrder.total_amount)}
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

            <h3>Items</h3>
            <List
              bordered
              dataSource={viewingOrder.items || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.product_id?.name} x ${item.quantity}`}
                    description={
                      <>
                        <p>Price: {formatCurrencyLKR(item.price)}</p>
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
                            Message:
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
                              Toppings:
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
    </Spin>
  );
}
