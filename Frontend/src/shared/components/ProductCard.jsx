import { Card, Tag } from "antd";
import { formatCurrencyLKR } from "../utils/currency.js";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const imageUrl =
    product.imageUrl ||
    product.images?.[0] ||
    `https://img.freepik.com/premium-vector/cake-logo-icon-design-illustration_775854-2226.jpg`;

  return (
    <Card
      hoverable
      cover={
        <Link to={`/products/${product._id}`}>
          <img
            alt={product.name}
            src={imageUrl}
            style={{ height: 180, width: "100%", objectFit: "cover" }}
          />
        </Link>
      }
      onClick={() => {}}
    >
      <Link to={`/products/${product._id}`} style={{ color: "inherit" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ fontWeight: 600 }}>{product.name}</div>
          {!!product.discountPrice > 0 ? (
            <>
              <div
                style={{
                  color: "#706f6fff",
                  fontWeight: 500,
                  textDecoration: "line-through",
                  fontSize: 11,
                }}
              >
                {formatCurrencyLKR(product.basePrice)}
              </div>
              <div style={{ color: "#E75480", fontWeight: 700 }}>
                {formatCurrencyLKR(product.discountPrice)}
              </div>
            </>
          ) : (
            <div style={{ color: "#E75480", fontWeight: 700 }}>
              {formatCurrencyLKR(product.basePrice)}
            </div>
          )}
        </div>
      </Link>
      {!!(product.categories && Object.keys(product.categories).length) && (
        <div
          style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}
        >
          {(() => {
            // Flatten categories
            const allCategories = Object.keys(product.categories)
              .map((categoryType) => product.categories[categoryType])
              .flat();

            const visible = allCategories.slice(0, 2); // 👈 show only first 2
            const hiddenCount = allCategories.length - visible.length;

            return (
              <>
                {visible.map((category, index) => (
                  <Tag key={`${product._id}-cat-${index}`} color="magenta">
                    {category}
                  </Tag>
                ))}
                {hiddenCount > 0 && (
                  <Tag key={`${product._id}-cat-more`} color="blue">
                    +{hiddenCount} more
                  </Tag>
                )}
              </>
            );
          })()}
        </div>
      )}
    </Card>
  );
}
