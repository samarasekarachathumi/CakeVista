import { Button, Card, Typography, Tag, Space } from "antd";
import { Link } from "react-router-dom";
import { StarFilled } from "@ant-design/icons";

const { Text } = Typography;

export default function ShopCard({ shop }) {
  const imageUrl =
    shop.profilePicture ||
    `https://www.lacherpatisserie.com/cdn/shop/articles/lacher-viennoiserie-01.jpg`;

  return (
    <Card
      hoverable
      cover={
        <img
          alt={shop.name}
          src={imageUrl}
          style={{ height: 180, objectFit: "cover" }}
        />
      }
      actions={[
        <Link key="view" to={`/shop/${shop._id}`}>
          <Button type="primary">View Shop</Button>
        </Link>,
      ]}
    >
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 4,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 16 }}>{shop.shopName}</div>
          {!!shop.rating && (
            <Space size="small">
              <StarFilled style={{ color: "#FFD700" }} />
              <Text strong>{shop.rating}</Text>
            </Space>
          )}
        </div>

        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text type="secondary">{shop.shopAddress[0].city}</Text>

          {shop.shopAddress[0].province && (
            <Space size="small" wrap>
              <Tag color="blue" size="small">
                {shop.shopAddress[0].province
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Tag>
              {shop.shopAddress[0].district && (
                <Tag color="green" size="small">
                  {shop.shopAddress[0].district
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Tag>
              )}
            </Space>
          )}
        </Space>
      </div>
    </Card>
  );
}
