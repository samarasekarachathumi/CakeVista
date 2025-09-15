import { useState, useMemo, useEffect } from "react";
import { Col, Input, Row, Select, Space, Tag, Typography } from "antd";
import ShopCard from "../../shared/components/ShopCard.jsx";
import { PROVINCES, DISTRICTS } from "../../shared/data/ProvincesAndDistricts.js";
import { getAllActiveShops } from "../../service/shopService";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";

const { Title, Text } = Typography;

export default function ShopSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [shopDetails, setShopDetails] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const { showError } = useNotification();

  const availableDistricts = selectedProvince
    ? DISTRICTS[selectedProvince] || []
    : [];

  const filteredShops = useMemo(() => {
    let shops = [...shopDetails];

    if (searchQuery) {
      shops = shops.filter(
        (shop) =>
          shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.shopAddress[0].city
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedProvince) {
      shops = shops.filter(
        (shop) => shop.shopAddress[0].province === selectedProvince
      );
    }
    if (selectedDistrict) {
      shops = shops.filter(
        (shop) => shop.shopAddress[0].district === selectedDistrict
      );
    }
    if (sortBy) {
      shops.sort((a, b) => {
        if (sortBy === "rating") {
          return b.rating - a.rating;
        } else if (sortBy === "shopName") {
          return a.shopName.localeCompare(b.shopName);
        }
        return 0;
      });
    }

    return shops;
  }, [shopDetails, searchQuery, selectedProvince, selectedDistrict, sortBy]);

  const getAllActiveShopForAllUsers = async () => {
    try {
      const data = await getAllActiveShops();
      setShopDetails(data.data);
      return data;
    } catch (error) {
      showError("Error fetching active shops: " + error.message);
    }
  };

  useEffect(() => {
    getAllActiveShopForAllUsers();
  }, []);

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSortBy(null);
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Find Cake Shops
      </Title>

      {/* Search and Filter Controls */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={6}>
          <Input.Search
            placeholder="Search shops by name or city"
            enterButton
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={setSearchQuery}
          />
        </Col>
        <Col xs={24} md={5}>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Province"
            value={selectedProvince}
            onChange={handleProvinceChange}
            allowClear
            options={PROVINCES}
          />
        </Col>
        <Col xs={24} md={5}>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select District"
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            allowClear
            disabled={!selectedProvince}
            options={availableDistricts}
          />
        </Col>
        <Col xs={24} md={4}>
          <Select
            style={{ width: "100%" }}
            placeholder="Sort by"
            value={sortBy}
            onChange={setSortBy}
            allowClear
            options={[
              { value: "rating", label: "Rating (High to Low)" },
              { value: "shopName", label: "Name (A-Z)" },
            ]}
          />
        </Col>
        <Col xs={24} md={4}>
          <Input
            placeholder={`${filteredShops.length} shops found`}
            disabled
            style={{ textAlign: "center", fontWeight: 500 }}
          />
        </Col>
      </Row>

      {/* Active Filters Display */}
      {(searchQuery || selectedProvince || selectedDistrict || sortBy) && (
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ marginRight: 8 }}>
            Active Filters:
          </Text>
          <Space size="small" wrap>
            {searchQuery && (
              <Tag closable onClose={() => setSearchQuery("")}>
                Search: "{searchQuery}"
              </Tag>
            )}
            {selectedProvince && (
              <Tag closable onClose={() => handleProvinceChange(null)}>
                Province:
                {PROVINCES.find((p) => p.value === selectedProvince)?.label}
              </Tag>
            )}
            {selectedDistrict && (
              <Tag closable onClose={() => setSelectedDistrict(null)}>
                District:
                {
                  availableDistricts.find((d) => d.value === selectedDistrict)
                    ?.label
                }
              </Tag>
            )}
            {sortBy && (
              <Tag closable onClose={() => setSortBy(null)}>
                Sort: {sortBy === "rating" ? "Rating" : "Name"}
              </Tag>
            )}
            <Tag
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={clearFilters}
            >
              Clear All
            </Tag>
          </Space>
        </div>
      )}

      {/* Results */}
      {filteredShops.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <Text type="secondary">No shops found matching your criteria.</Text>
          <br />
          <Text type="secondary">
            Try adjusting your filters or search terms.
          </Text>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredShops.map((shop) => (
            <Col xs={24} sm={12} md={8} lg={6} key={shop._id}>
              <ShopCard shop={shop} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
