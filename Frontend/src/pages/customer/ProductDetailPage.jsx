import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  Upload,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../shared/contexts/CartContext.jsx";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";
import { formatCurrencyLKR } from "../../shared/utils/currency.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProductById } from "../../service/productService.js";
// import { getProductById } from '../../shared/data/mockProducts.js'
import { UploadOutlined } from "@ant-design/icons";
import mediaUpload from "../../util/mediaUpload.jsx";

const { Title, Text } = Typography;

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showSuccess, showError } = useNotification();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState({});
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [cakeText, setCakeText] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const response = await getProductById(id);
        console.log(response);
        setInitialValues(response.data.data);
        setProductData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        showError("Error", "Failed to fetch product data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const setInitialValues = useCallback((selectedProductData) => {
    if (!selectedProductData) return;
    setSelectedSize(selectedProductData.customization.size[0]);
    setSelectedFlavor(selectedProductData.customization?.flavor[0] || null);
    setSelectedToppings([]);
    setMainImage(selectedProductData?.images[0]);
    setCakeText("");
  }, []);

  // useEffect(() => {
  //   setInitialValues();
  // }, [productData, setInitialValues]);

  const totalPrice = useMemo(() => {
    if (!productData) return 0;

    let price = productData.basePrice;

    // Add size price adjustment
    if (selectedSize?.price) {
      price += selectedSize.price;
    }

    // Add flavor price adjustment
    if (selectedFlavor?.price) {
      price += selectedFlavor.price;
    }

    // Add toppings prices
    selectedToppings.forEach((toppingName) => {
      const topping = productData.customization.toppings.find(
        (t) => t.name === toppingName
      );
      if (topping && topping.price) {
        price += topping.price;
      }
    });

    // Add cake text price if provided
    if (
      cakeText &&
      cakeText.trim() &&
      productData.customization.customMessage?.isAvailable
    ) {
      price += productData.customization.customMessage.price;
    }

    return Math.max(0, price); // Ensure price is never negative
  }, [productData, selectedSize, selectedFlavor, selectedToppings, cakeText]);

  const handleToppingToggle = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping.name)
        ? prev.filter((t) => t !== topping.name)
        : [...prev, topping.name]
    );
  };

  const handleAddToCart = async () => {
    let uploadedUrl = null;
    if (images) {
      try {
        for (let i = 0; i < images.length; i++) {
          uploadedUrl = await mediaUpload(images[i]);
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        showError("Error", "Failed to upload image. Please try again.");
        return;
      }
    }

    const variantId = [
      productData?._id,
      selectedSize?.name || "no-size",
      selectedFlavor?.name || "no-flavor",
      [...selectedToppings].sort().join("+") || "no-toppings",
      cakeText || "no-text",
      specialNote || "no-note",
    ].join("-");

    const cartItem = {
      id: variantId,
      productId: productData?._id,
      name: productData?.name,
      price: totalPrice,
      quantity: 1,
      imageUrl: mainImage,
      categories: productData?.categories || [],
      uploadedUrl,
      customization: {
        size: selectedSize?.name || null,
        flavor: selectedFlavor?.name || null,
        toppings: selectedToppings || [],
        cakeText: cakeText || "",
        specialNote: specialNote || "",
      },
    };

    try {
      addItem(cartItem, 1);
      showSuccess("Success", "Item added to cart successfully!");
    } catch (error) {
      console.error("Add to cart failed:", error);
      showError("Error", "Could not add item to cart. Please try again.");
    }
  };

  const handleBuyNow = () => {
    console.log("Buy Now - Total Price:", totalPrice);
    console.log("Buy Now - Selected Options:", {
      size: selectedSize,
      flavor: selectedFlavor,
      toppings: selectedToppings,
      cakeText,
      specialNote,
    });

    const variantId = `${productData._id}-${selectedSize.name}-${
      selectedFlavor.name
    }-${selectedToppings.sort().join("+")}-${cakeText}-${specialNote}`;
    const cartItem = {
      id: variantId,
      productId: productData._id,
      name: productData.name,
      price: totalPrice,
      quantity: 1, // Explicitly set quantity
      imageUrl: mainImage,
      categories: productData.categories,
      customization: {
        size: selectedSize.name,
        flavor: selectedFlavor.name,
        toppings: selectedToppings,
        cakeText,
        specialNote,
      },
    };

    console.log("Buy Now - Cart Item:", cartItem);

    // Add to cart temporarily and navigate to purchase
    addItem(cartItem, 1);
    navigate("/purchase", {
      state: { items: [cartItem], isDirectPurchase: true },
    });
  };

  if (isLoading) {
    return (
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          {/* Skeleton for the main product image */}
          <div>
            <Skeleton.Image style={{ width: 600, height: 500 }} active />
          </div>

          <div style={{ marginTop: 12 }}>
            {/* Skeletons for the thumbnail images */}
            <Space size="middle" wrap>
              <Skeleton.Image style={{ width: 80, height: 60 }} active />
              <Skeleton.Image style={{ width: 80, height: 60 }} active />
              <Skeleton.Image style={{ width: 80, height: 60 }} active />
            </Space>
          </div>
        </Col>
        <Col xs={24} md={12}>
          {/* Skeleton for the product title and description text */}
          <Skeleton active paragraph={{ rows: 8 }} />
          {/* Skeletons for buttons and inputs */}
          <Space style={{ marginTop: 16 }}>
            <Skeleton.Button active size="large" />
            <Skeleton.Button active size="large" />
          </Space>
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card
          bodyStyle={{ padding: 0 }}
          style={{ borderRadius: 16, overflow: "hidden" }}
        >
          <div
            style={{
              height: 500,
              backgroundImage: `url(${mainImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Card>
        <Space size="middle" wrap style={{ marginTop: 12 }}>
          {productData.images.map((img) => (
            <img
              key={img}
              src={img}
              style={{
                width: 80,
                height: 60,
                borderRadius: 8,
                objectFit: "cover",
                cursor: "pointer",
                border:
                  img === mainImage
                    ? "2px solid #d2b48c"
                    : "2px solid transparent",
              }}
              onClick={() => setMainImage(img)}
            />
          ))}
        </Space>
      </Col>
      <Col xs={24} md={12}>
        <Title level={2} style={{ fontWeight: 700 }}>
          {productData.name}
        </Title>
        <Text type="secondary">
          Customize your cake. Price updates automatically.
        </Text>

        <div style={{ marginTop: 24 }}>
          {productData.customization?.size.length && (
            <>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Size:
              </Text>
              <Space size="small" style={{ marginBottom: 16 }}>
                {productData.customization.size.map((option) => (
                  <Button
                    key={option.name}
                    type={
                      selectedSize.name === option.name ? "primary" : "default"
                    }
                    onClick={() => setSelectedSize(option)}
                  >
                    {option.name} ({option.price >= 0 ? "+" : ""}
                    {formatCurrencyLKR(option.price)})
                  </Button>
                ))}
              </Space>
            </>
          )}

          {productData.customization?.flavor.length > 0 && (
            <>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Flavor:
              </Text>
              <Space size="small" style={{ marginBottom: 16 }}>
                {productData.customization.flavor.map((option) => (
                  <Button
                    key={option.name}
                    type={
                      selectedFlavor.name === option.name
                        ? "primary"
                        : "default"
                    }
                    onClick={() => setSelectedFlavor(option)}
                  >
                    {option.name} ({option.price >= 0 ? "+" : ""}
                    {formatCurrencyLKR(option.price)})
                  </Button>
                ))}
              </Space>
            </>
          )}

          {productData.customization?.toppings.length > 0 && (
            <>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Toppings:
              </Text>
              <Space
                size="small"
                style={{ marginBottom: 16, flexWrap: "wrap" }}
              >
                {productData.customization.toppings.map((option) => (
                  <Button
                    key={option.name}
                    type={
                      selectedToppings.includes(option.name)
                        ? "primary"
                        : "default"
                    }
                    onClick={() => handleToppingToggle(option)}
                  >
                    {option.name} ({option.price >= 0 ? "+" : ""}
                    {formatCurrencyLKR(option.price)})
                  </Button>
                ))}
              </Space>
            </>
          )}

          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Cake Text:
          </Text>
          <Input.TextArea
            rows={2}
            value={cakeText}
            onChange={(e) => setCakeText(e.target.value)}
            placeholder="e.g., Happy Birthday!"
          />
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Upload Sample Image:
          </Text>
          <input
            type="file"
            onChange={(e) => {
              setImages(e.target.files);
            }}
          />
          <Text strong style={{ display: "block", margin: "12px 0 8px" }}>
            Special Note:
          </Text>
          <Input.TextArea
            rows={3}
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            placeholder="e.g., nut-free, less sugar"
          />

          <Divider style={{ margin: "24px 0" }} />

          {/* Price Breakdown */}
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Price Breakdown:
            </Text>
            <div style={{ fontSize: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text>
                  {productData.discountPrice
                    ? "Discounted Price:"
                    : "Base Price:"}
                </Text>
                <Text>
                  {formatCurrencyLKR(
                    productData.discountPrice
                      ? productData.discountPrice
                      : productData.basePrice
                  )}
                </Text>
              </div>
              {selectedSize?.price !== 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text>Size ({selectedSize?.name}):</Text>
                  <Text>
                    {selectedSize?.price >= 0 ? "+" : ""}
                    {formatCurrencyLKR(selectedSize?.price || undefined)}
                  </Text>
                </div>
              )}
              {selectedFlavor && selectedFlavor?.price !== 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text>Flavor ({selectedFlavor?.name}):</Text>
                  <Text>
                    {selectedFlavor?.price >= 0 ? "+" : ""}
                    {formatCurrencyLKR(selectedFlavor?.price || undefined)}
                  </Text>
                </div>
              )}
              {selectedToppings.length > 0 &&
                selectedToppings.map((toppingName) => {
                  const topping = productData.customization.toppings.find(
                    (t) => t.name === toppingName
                  );
                  return (
                    <div
                      key={toppingName}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <Text>Topping ({toppingName}):</Text>
                      <Text>
                        +{formatCurrencyLKR(topping?.price || undefined)}
                      </Text>
                    </div>
                  );
                })}
              {/* {cakeText &&
                cakeText.trim() &&
                productData.customization.customMessage?.isAvailable && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text>Cake Text:</Text>
                    <Text>
                      +
                      {formatCurrencyLKR(
                        productData.customization.customMessage.price
                      )}
                    </Text>
                  </div>
                )}
              <Divider style={{ margin: "8px 0" }} /> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 600,
                }}
              >
                <Text strong>Total:</Text>
                <Text strong style={{ color: "#E75480", fontSize: 16 }}>
                  {formatCurrencyLKR(totalPrice)}
                </Text>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              size="large"
              onClick={handleAddToCart}
              style={{ marginRight: 8 }}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        <Divider style={{ margin: "24px 0" }} />
        <div>
          <Title level={4} style={{ marginBottom: 8 }}>
            Details
          </Title>
          <div style={{ color: "#6f594e" }}>
            Customizable handcrafted cake. Choose size, flavor, toppings, and
            add your message.
          </div>
          <div style={{ marginTop: 8 }}>
            {Object.keys(productData.categories)
              .map((categoryType) => productData.categories[categoryType])
              .flatMap((category, idx) => (
                <Tag key={`${productData._id}-cat-${idx}`} color="magenta">
                  {category}
                </Tag>
              ))}
          </div>
        </div>
      </Col>
    </Row>
  );
}
