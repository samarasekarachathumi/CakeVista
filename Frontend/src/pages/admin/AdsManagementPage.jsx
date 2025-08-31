import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Image,
  Card,
  Switch
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getAllAdvertisements, updateAdvertisementById } from "../../service/advertisementService";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";

export default function AdsManagementPage() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const getAllAdsForAdmin = async () => {
    try {
      setLoading(true);
      const response = await getAllAdvertisements();
      setRows(response.data);
    } catch (error) {
      showError("Failed to fetch ads: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAdsForAdmin();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "_id", width: 80 },
    { title: "Title", dataIndex: "title" },
    {
      title: "Type",
      dataIndex: "paymentMethod",
      filters: [
        { text: "Card", value: "card" },
        { text: "Bank", value: "bank" },
      ],
      onFilter: (val, rec) => rec.paymentMethod === val,
    },
    {
      title: "Shop",
      dataIndex: "shop",
      filters: Array.from(
        new Set(rows.map((r) => r.shopDetails?.shopName).filter(Boolean))
      ).map((shopName) => ({ text: shopName, value: shopName })),
      onFilter: (value, record) => record.shopDetails?.shopName === value,
      render: (_, record) => (
        <Space>
          <span>{record.shopDetails?.shopName || "N/A"}</span>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => <span>LKR {price}</span>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
        { text: "Failed", value: "failed" },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
      render: (status) => (
        <Space>
          <Tag color={
            status === "pending" ? "orange" :
            status === "completed" ? "green" :
            status === "failed" ? "red" : ""
          }>{status}</Tag>
        </Space>
      ),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setEditing(record);
            form.setFieldsValue({
              ...record,
              startDate: record.startDate ? dayjs(record.startDate) : null,
              endDate: record.endDate ? dayjs(record.endDate) : null,
              paymentStatus: record.paymentStatus || "pending",
            });
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateAdvertisementById(editing._id, {
        ...values,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
      });
      setEditing(null);
      form.resetFields();
      showSuccess("Ad updated successfully");
      getAllAdsForAdmin();
    } catch (error) {
      showError("Failed to update ad:", error.message);
    }
  };

  return (
    <>
      <Card title="Shop Ads">
        <Table
          loading={loading}
          rowKey={(r) => r._id}
          dataSource={rows}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <Modal
        open={!!editing}
        title={`Edit Advertisement #${editing?._id}`}
        onCancel={() => setEditing(null)}
        onOk={handleOk}
      >
        {editing?.imageUrl && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Image
              src={editing?.imageUrl[0]}
              style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }}
            />
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item label="Start Date" name="startDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="End Date" name="endDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Payment Status" name="paymentStatus">
            <Select
              options={[
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "failed", label: "Failed" },
              ]}
            />
          </Form.Item>
          <Form.Item label="is Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
