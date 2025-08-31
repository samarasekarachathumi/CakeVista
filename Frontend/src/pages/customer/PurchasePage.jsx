import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Space,
  Divider,
  Radio,
  Input,
  Form,
  Image,
  List,
  Tag,
  notification,
  Result,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../shared/contexts/CartContext.jsx";
import { formatCurrencyLKR } from "../../shared/utils/currency.js";
import { createOrder } from "../../service/orderService.js";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PurchasePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clear, items } = useCart();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Get items from navigation state or use empty array
  const cartItems = location.state?.items || [];
  const isDirectPurchase = location.state?.isDirectPurchase || false;

  // Debug logging
  console.log("PurchasePage - Items:", cartItems);
  console.log("PurchasePage - IsDirectPurchase:", isDirectPurchase);

  if (!cartItems.length) {
    return (
      <Result
        status="warning"
        title="No items to purchase"
        subTitle="Please add items to your cart or select a product to buy."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Browse Products
          </Button>
        }
      />
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const deliveryFee = 200; // Mock delivery fee
  const total = subtotal + deliveryFee;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // // Mock payment processing
      // await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Payment processing...", values, items);

      const orderItems = cartItems.map((cartItem) => ({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        customization: cartItem.customization,
      }));

      const order = {
        orderItems,
        ...values,
        total,
      };
      console.log(order);
      const { data } = await createOrder(order);

      console.log(data);

      notification.success({
        message: "Order Placed",
        description: "Your order has been placed successfully!",
        placement: "topRight",
      });

      // Clear cart if not direct purchase
      if (!isDirectPurchase) {
        clear();
      }

      // Navigate to order confirmation
      navigate("/order-confirmation", {
        state: {
          data,
        },
      });
    } catch {
      notification.error({
        message: "Payment Failed",
        description: "Payment failed. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: 32, textAlign: "center" }}>
        Complete Your Purchase
      </Title>

      <Row gutter={[24, 24]}>
        {/* Product Details */}
        <Col xs={24} lg={12}>
          <Card title="Order Items" style={{ height: "fit-content" }}>
            <List
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Image
                        width={80}
                        height={80}
                        src={item.imageUrl}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    }
                    title={
                      <Space direction="vertical" size="small">
                        <Text strong>{item.name}</Text>
                        <Text type="secondary">Quantity: {item.quantity}</Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text style={{ color: "#E75480", fontWeight: 600 }}>
                          {formatCurrencyLKR(item.price)} each
                        </Text>
                        {item.customization && (
                          <div>
                            <Space size="small" wrap>
                              <Tag color="blue">
                                Size: {item.customization.size}
                              </Tag>
                              <Tag color="green">
                                Flavor: {item.customization.flavor}
                              </Tag>
                            </Space>
                            {item.customization.toppings.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  Toppings:{" "}
                                  {item.customization.toppings.join(", ")}
                                </Text>
                              </div>
                            )}
                            {item.customization.cakeText && (
                              <div style={{ marginTop: 8 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  Cake Text: "{item.customization.cakeText}"
                                </Text>
                              </div>
                            )}
                            {item.customization.specialNote && (
                              <div style={{ marginTop: 8 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  Special Note: {item.customization.specialNote}
                                </Text>
                              </div>
                            )}
                          </div>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Order Summary & Payment */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Order Summary */}
            <Card title="Order Summary">
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text>
                    Subtotal (
                    {cartItems.reduce(
                      (sum, item) => sum + (item.quantity || 1),
                      0
                    )}{" "}
                    items):
                  </Text>
                  <Text>{formatCurrencyLKR(subtotal)}</Text>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text>Delivery Fee:</Text>
                  <Text>{formatCurrencyLKR(deliveryFee)}</Text>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    Total:
                  </Text>
                  <Text strong style={{ fontSize: 16, color: "#E75480" }}>
                    {formatCurrencyLKR(total)}
                  </Text>
                </div>
              </Space>
            </Card>

            {/* Payment Form */}
            <Card title="Payment & Delivery">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ paymentMethod: "card" }}
              >
                {/* Delivery Address */}
                <Form.Item
                  label="Delivery Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your delivery address",
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter your complete delivery address"
                  />
                </Form.Item>

                {/* Payment Method */}
                <Form.Item
                  label="Payment Method"
                  name="paymentMethod"
                  rules={[
                    {
                      required: true,
                      message: "Please select a payment method",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Space direction="vertical">
                      <Radio value="card">
                        <Space>
                          <Text>Credit/Debit Card</Text>
                          <Tag color="blue">Secure</Tag>
                        </Space>
                      </Radio>
                      <Radio value="cod">
                        <Space>
                          <Text>Cash on Delivery</Text>
                          <Tag color="orange">Pay when delivered</Tag>
                        </Space>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                {/* Card Details (conditional) */}
                {paymentMethod === "card" && (
                  <>
                    <Form.Item
                      label="Card Number"
                      name="cardNumber"
                      rules={[
                        { required: true, message: "Please enter card number" },
                        {
                          pattern: /^\d{16}$/,
                          message: "Please enter a valid 16-digit card number",
                        },
                      ]}
                    >
                      <Input placeholder="1234 5678 9012 3456" maxLength={16} />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Expiry Date"
                          name="expiryDate"
                          rules={[
                            {
                              required: true,
                              message: "Please enter expiry date",
                            },
                            {
                              pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                              message: "Please enter in MM/YY format",
                            },
                          ]}
                        >
                          <Input placeholder="MM/YY" maxLength={5} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="CVV"
                          name="cvv"
                          rules={[
                            { required: true, message: "Please enter CVV" },
                            {
                              pattern: /^\d{3,4}$/,
                              message: "Please enter a valid CVV",
                            },
                          ]}
                        >
                          <Input placeholder="123" maxLength={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}

                {/* Special Instructions */}
                <Form.Item
                  label="Special Instructions (Optional)"
                  name="instructions"
                >
                  <TextArea
                    rows={2}
                    placeholder="Any special delivery instructions..."
                  />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: "100%", height: 48 }}
                  >
                    {loading
                      ? "Processing Payment..."
                      : `Pay ${formatCurrencyLKR(total)}`}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
