import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Steps,
  Table,
  Switch,
  Radio,
  Popconfirm,
  Space,
  Tag
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  createAdvertisement,
  getAdvertisementsDetailsByShopId,
  deleteAdvertisementById,
} from "../../service/advertisementService.js";
import mediaUpload from "../../util/mediaUpload.jsx";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";

export default function OwnerAdsPage() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [ads, setAds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const { showSuccess, showError } = useNotification();
  const [images, setImages] = useState([]);

  const PRICES = {
    top: 5000,
    popup: 3000,
  };

  const next = async () => {
    if (step === 0) {
      await form.validateFields();
    }
    setStep((step) => step + 1);
  };
  const prev = () => setStep((step) => step - 1);

  const submit = async () => {
    try {
      await form.validateFields();
      setSubmitting(true);
      const values = form.getFieldsValue();
      const promises = [];
      for (let i = 0; i < images.length; i++) {
        const promise = mediaUpload(images[i]);
        promises.push(promise);
      }

      const imageUrls = await Promise.all(promises);
      const payload = {
        title: values.title,
        description: values.description || "",
        imageUrl: imageUrls,
        price: PRICES[values.adPosition],
        adPosition: values.adPosition,
        isActive: false,
        paymentStatus: "pending",
        paymentMethod,
      };
      await createAdvertisement(payload);
      showSuccess("Advertisement created");
      setOpen(false);
      setStep(0);
      setPaymentMethod("bank");
      getAdsDetails();
      form.resetFields();
    } catch (err) {
      console.error(err);
      showError("Failed to create advertisement");
    } finally {
      setSubmitting(false);
    }
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
    getAdsDetails();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAdvertisementById(id);
      showSuccess("Ad deleted successfully");
      getAdsDetails();
    } catch (error) {
      showError("Failed to delete ad: " + error.message);
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Position", dataIndex: "adPosition" },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => <span>LKR {price}</span>,
    },
    { title: "Payment Method", dataIndex: "paymentMethod" },
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Popconfirm
            title="Are you sure to delete this cake?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 16 }}>
        <Col xs={4} md={4}>
          <Button type="primary" block onClick={() => setOpen(true)}>
            Create Ad
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={24}>
          <Card title="My Shop Ads">
            <Table
              rowKey={(r) => r._id}
              dataSource={ads}
              pagination={{ pageSize: 10 }}
              columns={columns}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={720}
        title="Create Ad"
      >
        <Steps
          current={step}
          items={[
            { title: "Details" },
            { title: "Payment" },
            { title: "Done" },
          ]}
          style={{ marginBottom: 16 }}
        />

        {/* Step 0: Ad details */}
        <div style={{ display: step === 0 ? "block" : "none" }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ adPosition: "top" }}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="e.g. Weekend Discount Promo" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} placeholder="Optional description" />
            </Form.Item>
            <Form.Item
              label="Ad Position"
              name="adPosition"
              rules={[{ required: true }]}
            >
              <Select
                onChange={(val) => {
                  form.setFieldsValue({ price: PRICES[val] });
                }}
                options={[
                  { value: "top", label: "Home Page Top (LKR 5000)" },
                  { value: "popup", label: "Popup (LKR 3000)" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Price (LKR)" name="price">
              <Input disabled defaultValue={5000} />
            </Form.Item>

            <Form.Item
              label="Upload Image"
              name="imageUrl"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
            >
              <input
                multiple
                type="file"
                onChange={(e) => {
                  setImages(e.target.files);
                }}
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" onClick={next}>
                Next
              </Button>
            </div>
          </Form>
        </div>

        {/* Step 1: Payment */}
        <div style={{ display: step === 1 ? "block" : "none" }}>
          <Card>
            <Form layout="vertical">
              <Form.Item label="Select Payment Method">
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Radio value="bank">Bank Transfer</Radio>
                  <Radio value="card">Card Payment</Radio>
                </Radio.Group>
              </Form.Item>

              {paymentMethod === "bank" && (
                <div
                  style={{
                    background: "#fafafa",
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <h4>Bank Transfer Details</h4>
                  <p>
                    <b>Bank:</b> Commercial Bank
                  </p>
                  <p>
                    <b>Account No:</b> 123456789
                  </p>
                  <p>
                    <b>Account Name:</b> Cake Vista pvt Ltd.
                  </p>
                  <p>
                    <b>Branch:</b> Colombo
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div>
                  <Form.Item
                    label="Card Number"
                    rules={[{ required: true, message: "Enter card number" }]}
                  >
                    <Input placeholder="xxxx xxxx xxxx xxxx" maxLength={16} />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        label="Expiry Date"
                        rules={[{ required: true, message: "Enter expiry" }]}
                      >
                        <Input placeholder="MM/YY" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="CVV"
                        rules={[{ required: true, message: "Enter CVV" }]}
                      >
                        <Input.Password placeholder="***" maxLength={3} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}
            </Form>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <Button onClick={prev}>Back</Button>
              <Button type="primary" onClick={next}>
                Pay
              </Button>
            </div>
          </Card>
        </div>

        {/* Step 2: Done */}
        <div style={{ display: step === 2 ? "block" : "none" }}>
          <Card>
            Payment successful. Please click finish button for create
            advertisement.
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <Button type="primary" loading={submitting} onClick={submit}>
                Finish
              </Button>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
}
