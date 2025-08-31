import { Col, Row, Select, Input, Tag, Divider, Spin, Alert } from "antd";
import ProductCard from "../../shared/components/ProductCard.jsx";
import { useMemo, useState, useEffect } from "react";
import { CATEGORY_GROUPS } from "../../shared/constants/catalog.js";
import { getAllProducts } from "../../service/productService.js"; // 👈 import API

export default function CakeSearchPage() {
  const [selected, setSelected] = useState({
    flavors: [],
    occasions: [],
    dietary: [],
    styles: [],
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cakes on mount
  useEffect(() => {
    const fetchCakes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllProducts();
        if (res.success) {
          setCakes(res.data.data || []);
        } else {
          setError(res.message || "Failed to load cakes");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCakes();
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = cakes;

    // Filter by search query
    if (normalizedQuery) {
      result = result.filter((c) => {
        const inName = c.name.toLowerCase().includes(normalizedQuery);
        const categoriesString = Object.values(c.categories)
          .flat()
          .join(" ")
          .toLowerCase();
        const inCategories = categoriesString.includes(normalizedQuery);
        return inName || inCategories;
      });
    }

    const anySelected = Object.values(selected).some((arr) => arr.length > 0);
    if (anySelected) {
      result = result.filter((c) => {
        // 1. Check if ALL selected groups have a match in the cake's categories
        return Object.entries(selected).every(([group, selectedCats]) => {
          if (selectedCats.length === 0) return true; // 2. If no categories are selected for this group, it's a match
          const cakeCatsInGroup = c.categories[group] || [];
          // 3. For a given group, check if ANY of the selected categories exist in the cake's categories
          return selectedCats.some((cat) => cakeCatsInGroup.includes(cat));
        });
      });
    }

    // Sort the results
    if (sort === "price_asc") {
      result = [...result].sort((a, b) => a.basePrice - b.basePrice);
    } else if (sort === "price_desc") {
      result = [...result].sort((a, b) => b.basePrice - a.basePrice);
    } else if (sort === "name_asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [cakes, selected, query, sort]);

  return (
    <div>
      {/* Filters & Search UI */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={24} md={6}>
          <Input.Search
            placeholder="Search by name or category"
            enterButton
            allowClear
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={setQuery}
          />
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={[8, 8]}>
            <Col xs={24} md={6}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Flavors"
                options={CATEGORY_GROUPS.flavors.map((c) => ({
                  value: c,
                  label: c,
                }))}
                value={selected.flavors}
                onChange={(v) => setSelected((s) => ({ ...s, flavors: v }))}
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Occasions"
                options={CATEGORY_GROUPS.occasions.map((c) => ({
                  value: c,
                  label: c,
                }))}
                value={selected.occasions}
                onChange={(v) => setSelected((s) => ({ ...s, occasions: v }))}
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Dietary"
                options={CATEGORY_GROUPS.dietary.map((c) => ({
                  value: c,
                  label: c,
                }))}
                value={selected.dietary}
                onChange={(v) => setSelected((s) => ({ ...s, dietary: v }))}
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Styles"
                options={CATEGORY_GROUPS.styles.map((c) => ({
                  value: c,
                  label: c,
                }))}
                value={selected.styles}
                onChange={(v) => setSelected((s) => ({ ...s, styles: v }))}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Sort by"
            options={[
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "name_asc", label: "Name: A → Z" },
            ]}
            value={sort || undefined}
            onChange={setSort}
            allowClear
          />
        </Col>
      </Row>

      {/* Selected Filters */}
      {Object.values(selected).some((arr) => arr.length) && (
        <div style={{ marginBottom: 12 }}>
          {["flavors", "occasions", "dietary", "styles"].map((group) =>
            selected[group].length ? (
              <div key={group} style={{ marginBottom: 6 }}>
                <strong style={{ marginRight: 8 }}>
                  {group[0].toUpperCase() + group.slice(1)}:
                </strong>
                {selected[group].map((c) => (
                  <Tag key={c} color="magenta">
                    {c}
                  </Tag>
                ))}
              </div>
            ) : null
          )}
          <Divider style={{ margin: "8px 0" }} />
        </div>
      )}

      {/* Loading / Error / Cakes */}
      {loading && <Spin tip="Loading cakes..." />}
      {error && (
        <Alert type="error" message={error} style={{ marginBottom: 12 }} />
      )}
      {!loading && !error && (
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
