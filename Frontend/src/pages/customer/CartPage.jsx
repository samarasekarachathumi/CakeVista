import {
  Button,
  Card,
  InputNumber,
  List,
  Result,
  Space,
  Typography,
  Image,
} from "antd";
import { useCart } from "../../shared/contexts/CartContext.jsx";
import { formatCurrencyLKR } from "../../shared/utils/currency.js";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function CartPage() {
  const { items, updateQuantity, removeItem, clear, total } = useCart();
  const navigate = useNavigate();

  const handleProceedToPurchase = () => {
    navigate("/purchase", { state: { items, isDirectPurchase: false } });
  };

  if (!items.length) {
    return (
      <Result
        status="info"
        title="Your cart is empty"
        subTitle="Browse cakes and add them to your cart."
      />
    );
  }

  return (
    <Card
      title="Your Cart"
      extra={<strong>Total: {formatCurrencyLKR(total)}</strong>}
    >
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            actions={[
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(v) => updateQuantity(item.id, v)}
              />,
              <a onClick={() => removeItem(item.id)}>Remove</a>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Image
                  width={60}
                  height={60}
                  src={
                    item.imageUrl ||
                    "https://img.freepik.com/premium-vector/cake-logo-icon-design-illustration_775854-2226.jpg"
                  }
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
              }
              title={item.name}
              description={
                <Space direction="vertical" size="small">
                  <Text>
                    {formatCurrencyLKR(item.price)} x {item.quantity}
                  </Text>
                  {item.customization && (
                    <Space size="small" wrap>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Size: {item.customization.size}
                        {item.customization.flavor &&
                          ` | Flavor: ${item.customization.flavor}`}
                      </Text>
                      {item.customization.toppings.length > 0 && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Toppings: {item.customization.toppings.join(", ")}
                        </Text>
                      )}
                    </Space>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 16,
        }}
      >
        <Button onClick={clear}>Clear Cart</Button>
        <Button type="primary" onClick={handleProceedToPurchase}>
          Proceed to Purchase
        </Button>
      </div>
    </Card>
  );
}
