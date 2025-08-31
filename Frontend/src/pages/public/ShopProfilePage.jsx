import {
  Col,
  Descriptions,
  Row,
  Typography,
  Select,
  Tag,
  Divider,
  Card,
  Empty,
} from "antd";
import { useParams } from "react-router-dom";
import ProductCard from "../../shared/components/ProductCard.jsx";
import { useEffect, useMemo, useState } from "react";
import { CATEGORY_GROUPS } from "../../shared/constants/catalog.js";
import { getProductsByShopOwnerId } from "../../service/shopService.js";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";

const { Title, Text } = Typography;

export default function ShopProfilePage() {
  const { shopId } = useParams();
  const [selected, setSelected] = useState({
    flavors: [],
    occasions: [],
    dietary: [],
    styles: [],
  });
  const [shopAndProductDetails, setShopAndProductDetails] = useState([]);
  const [shopDetails, setShopDetails] = useState({});
  const { showError } = useNotification();

  const getShopAndProductDetails = async (shopId) => {
    try {
      const data = await getProductsByShopOwnerId(shopId);
      const products = Array.isArray(data.data.products)
        ? data.data.products
        : [];
      const shopDetails = data.data.shopOwner;
      setShopDetails(shopDetails);
      setShopAndProductDetails(products);
      return data;
    } catch (error) {
      showError("Error fetching active shops: " + error.message);
    }
  };

  useEffect(() => {
    getShopAndProductDetails(shopId);
  }, [shopId]);

  const filtered = useMemo(() => {
    const anySelected = Object.values(selected).some((arr) => arr.length > 0);
    if (!anySelected) return shopAndProductDetails;

    return shopAndProductDetails.filter((c) =>
      Object.entries(selected).every(([group, selectedCats]) => {
        if (selectedCats.length === 0) return true;
        const cakeCatsInGroup = c.categories?.[group] || [];
        return selectedCats.some((cat) => cakeCatsInGroup.includes(cat));
      })
    );
  }, [shopAndProductDetails, selected]);

  return (
    <div>
      <Card
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #fff0f6, #e6f7ff)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ color: "#eb2f96", marginBottom: 12 }}>
          🎀 Welcome to {shopDetails.shopName || "our sweet shop"} 🎀
        </Title>
        <Descriptions
          bordered
          size="small"
          column={1}
          items={[
            { key: "name", label: "Shop Name", children: shopDetails.shopName },
            {
              key: "city",
              label: "City",
              children: shopDetails.shopAddress?.[0]?.city,
            },
          ]}
        />
      </Card>

      <Title level={4} style={{ marginTop: 16, color: "#722ed1" }}>
        🍰 Cakes
      </Title>
      <div style={{ marginBottom: 12 }}>
        <Row gutter={[8, 8]}>
          {["flavors", "occasions", "dietary", "styles"].map((group) => (
            <Col xs={24} md={6} key={group}>
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                  borderRadius: 12,
                }}
                placeholder={`Select ${group}`}
                options={CATEGORY_GROUPS[group].map((c) => ({
                  value: c,
                  label: c,
                }))}
                value={selected[group]}
                onChange={(v) => setSelected((s) => ({ ...s, [group]: v }))}
              />
            </Col>
          ))}
        </Row>

        {Object.values(selected).some((arr) => arr.length) && (
          <div style={{ marginTop: 8 }}>
            {["flavors", "occasions", "dietary", "styles"].map((group) =>
              selected[group].length ? (
                <div key={group} style={{ marginBottom: 6 }}>
                  <strong style={{ marginRight: 8, color: "#eb2f96" }}>
                    {group[0].toUpperCase() + group.slice(1)}:
                  </strong>
                  {selected[group].map((c) => (
                    <Tag
                      key={c}
                      color="pink"
                      style={{
                        borderRadius: 12,
                        padding: "2px 10px",
                        fontSize: 13,
                      }}
                    >
                      {c}
                    </Tag>
                  ))}
                </div>
              ) : null
            )}
            <Divider style={{ margin: "8px 0" }} />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <Empty
          description={<Text type="secondary">No cakes found 🧁</Text>}
          imageStyle={{ height: 80 }}
          style={{ marginTop: 24 }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((cake) => (
            <Col xs={24} sm={12} md={8} lg={6} key={cake.id}>
              <ProductCard product={cake} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
