import { Carousel, Col, Row, Typography, Button, Modal, Card } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../shared/components/ProductCard.jsx";
import { getActiveAdvertisementByAdPosition } from "../../service/advertisementService.js";
import { getLatestProducts } from "../../service/productService.js";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAd, setPopupAd] = useState(null);
  const [topAds, setTopAds] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  const getAdsInAdsPosition = async (position) => {
    try {
      const activeAd = await getActiveAdvertisementByAdPosition(position);
      if (activeAd && position === "popup") {
        setPopupAd(activeAd);
        setPopupOpen(true);
      } else if (activeAd && position === "top") {
        setTopAds(activeAd.data);
      }
    } catch {
      console.error(`Failed to fetch ads for position: ${position}`);
      return null;
    }
  };

  const getLatestProductsForHome = async () => {
    try {
      const response = await getLatestProducts();
      setLatestProducts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Failed to fetch latest products:", error);
    }
  };

  useEffect(() => {
    getLatestProductsForHome();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      await Promise.all([
        getAdsInAdsPosition("popup"),
        getAdsInAdsPosition("top"),
      ]);
    };
    fetchAds();
  }, []);

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div>
      {/* Top Banner Carousel */}
      <Carousel autoplay style={{ marginBottom: 48 }}>
        {topAds.map((ad) => (
          <div key={ad.id}>
            <div
              style={{
                height: 400,
                backgroundImage: `url(${ad.imageUrl[0]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  padding: "40px 24px 24px",
                  color: "white",
                }}
              >
                <Title level={2} style={{ color: "white", margin: 0 }}>
                  {ad.title}
                </Title>
                <Paragraph style={{ color: "white", margin: "8px 0 16px" }}>
                  {ad.description}
                </Paragraph>
                <Link to={`shop/${ad.shopOwnerId}`}>
                  <Button type="primary" size="large">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Featured Categories */}
      <Title level={2} style={{ marginBottom: 16 }}>Featured Categories</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        {[
          { title: "Birthday Cakes", image: "https://static.vecteezy.com/system/resources/thumbnails/023/130/979/small_2x/happy-birthday-background-with-cake-illustration-ai-generative-free-photo.jpg" },
          { title: "Wedding Cakes", image: "https://www.thephotoargus.com/wp-content/uploads/2021/07/wedding-cake-pictures-foreground.jpg" },
          { title: "Cupcakes", image: "https://blueskyeating.com/wp-content/uploads/2020/08/LandscapeBlog1.jpg" },
          { title: "Custom Designs", image: "https://www.lolas.co.uk/cdn/shop/files/birthday-cake-desktop_0a105677-74a7-4599-9347-d8d6431a1b9b.png" },
        ].map((cat, i) => (
          <Col xs={12} md={6} key={i}>
            <Card
              hoverable
              cover={<img src={cat.image} alt={cat.title} style={{ height: 180, objectFit: "cover" }} />}
              style={{ borderRadius: 12, overflow: "hidden" }}
            >
              <Title level={4} style={{ marginBottom: 0 }}>{cat.title}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Latest Products */}
      <Title level={2}>Discover Cakes & Shops</Title>
      <Paragraph style={{ marginBottom: 24 }}>
        Explore our latest and trending cakes from top shops.
      </Paragraph>

      <Row gutter={[16, 16]}>
        {latestProducts.map((product, i) => (
          <Col xs={24} sm={12} md={8} lg={6} key={i}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {/* Popup Modal */}
      <Modal
        open={popupOpen}
        onCancel={closePopup}
        footer={null}
        centered
        width={520}
        destroyOnClose
      >
        {popupAd ? (
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {popupAd.data[0]?.title || "Advertisement"}
            </div>
            {popupAd.data[0]?.imageUrl[0] ? (
              <img
                src={popupAd.data[0]?.imageUrl[0]}
                alt={popupAd.data[0]?.title || "Popup Ad Image"}
                style={{ width: "100%", borderRadius: 8, marginBottom: 12 }}
              />
            ) : null}
            {popupAd.data[0]?.description ? (
              <Paragraph style={{ marginBottom: 16 }}>
                {popupAd.data[0]?.description}
              </Paragraph>
            ) : null}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button onClick={closePopup}>Close</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
