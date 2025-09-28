import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Table,
  Popconfirm,
  Space,
  Select,
  Upload,
  Switch,
  Row,
  Col,
  Cascader,
  Tag,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react"; // Import useEffect
import { CATEGORY_GROUPS } from "../../shared/constants/catalog.js";
import { formatCurrencyLKR } from "../../shared/utils/currency.js";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";

// Import your API service functions
import {
  createProduct,
  getProductsByShopOwner,
  updateProduct,
  deleteProduct,
} from "../../service/productService.js";
import mediaUpload from "../../util/mediaUpload.jsx";

const { Option } = Select;
const { TextArea } = Input;

// Convert CATEGORY_GROUPS to Cascader options format
const categoryOptions = Object.keys(CATEGORY_GROUPS).map((group) => ({
  value: group,
  label: group.charAt(0).toUpperCase() + group.slice(1),
  children: CATEGORY_GROUPS[group].map((category) => ({
    value: category,
    label: category,
  })),
}));

export default function OwnerCakesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [editingCake, setEditingCake] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setTableLoading(true);
    const result = await getProductsByShopOwner();
    const products = result.data.data;
    if (result.success) {
      setData(products);
    } else {
      showError(result.message);
    }
    setTableLoading(false);
  };

  const showModal = (cake = null) => {
    setEditingCake(cake);
    if (cake) {
      const transformedValues = {
        ...cake,
        ...cake.customization,
        availabilityStatus: cake.availability.status,
        stock: cake.availability.stock,
      };
      console.log(transformedValues);
      form.setFieldsValue(transformedValues);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCake(null);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    console.log(values);

    const { customization, categories, ...rest } = values;
    console.log(rest.images);
    const images =
      rest?.images?.fileList?.map((file) => file.originFileObj) || [];
    console.log(images);
    const promises = [];
    for (let i = 0; i < images.length; i++) {
      const promise = mediaUpload(images[i]);
      promises.push(promise);
    }

    const imageUrls = await Promise.all(promises);
    const previousImageUrls =
      editingCake && editingCake.images ? editingCake.images : [];
    console.log(imageUrls, previousImageUrls);
    imageUrls.push(...previousImageUrls);

    // Extract customization options

    const {
      colors,
      flavor,
      size,
      toppings,
      customMessage,
      availabilityStatus,
      stock,
    } = customization;

    const finalValues = {
      ...rest,
      images: imageUrls,
      availability: {
        stock: stock,
        status: availabilityStatus,
      },
      categories: categories,
      customization: {
        colors,
        flavor,
        size,
        toppings,
        customMessage,
      },
    };

    let result;
    if (editingCake) {
      result = await updateProduct(editingCake._id, finalValues);
      if (result.success) {
        showSuccess("Product updated successfully!");
      } else {
        showError(result.message);
      }
    } else {
      result = await createProduct(finalValues);
      if (result.success) {
        showSuccess("New product added successfully!");
      } else {
        showError(result.message);
      }
    }

    if (result.success) {
      await fetchProducts();
      handleCancel();
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const result = await deleteProduct(id);
    if (result.success) {
      showSuccess("Product deleted successfully!");
      await fetchProducts();
    } else {
      showError(result.message);
    }
    setLoading(false);
  };

  const renderOptionList = (title, name) => (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          <p>{title}</p>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, "name"]}
                rules={[
                  {
                    required: true,
                    message: `Missing ${title.toLowerCase()} name`,
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "price"]}
                rules={[{ required: true, message: "Missing price" }]}
              >
                <InputNumber placeholder="Price Adj." style={{ width: 120 }} />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add {title.slice(0, -1)} Option
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (v) => formatCurrencyLKR(v),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories, product) => {
        return (
          !!(categories && Object.keys(categories).length) && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {(() => {
                // Flatten categories
                const allCategories = Object.keys(product.categories)
                  .map((categoryType) => categories[categoryType])
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
          )
        );
      },
    },
    {
      title: "Status",
      key: "status",
      filters: [
        { text: "", value: "In Stock" },
        { text: "Unavailable", value: "Out of Stock" },
      ],
      onFilter: (value, record) => record.availability.status === value,
      render: (_, record) => record.availability.status,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => showModal()}
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
      >
        Add Cake
      </Button>
      <Card title="Shop Cakes">
        <Table
          style={{ marginTop: 16 }}
          rowKey="_id"
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          loading={tableLoading}
        />
      </Card>
      <Modal
        title={editingCake ? "Edit Cake" : "Add New Cake"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={750}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Flavors" name={["categories", "flavors"]}>
                <Select
                  mode="multiple"
                  options={CATEGORY_GROUPS.flavors.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Occasions" name={["categories", "occasions"]}>
                <Select
                  mode="multiple"
                  options={CATEGORY_GROUPS.occasions.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Dietary" name={["categories", "dietary"]}>
                <Select
                  mode="multiple"
                  options={CATEGORY_GROUPS.dietary.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Styles" name={["categories", "styles"]}>
                <Select
                  mode="multiple"
                  options={CATEGORY_GROUPS.styles.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Base Price"
                name="basePrice"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Discount Price" name="discountPrice">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Stock"
                name="stock"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Availability" name="availabilityStatus">
                <Select>
                  <Option value="In Stock">In Stock</Option>
                  <Option value="Out of Stock">Out of Stock</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Custom Message"
                name={["customization", "customMessage", "isAvailable"]}
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Available"
                  unCheckedChildren="Unavailable"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Images" name="images">
            <Upload listType="picture" multiple>
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>
          <h3>Customizations</h3>

          <Row gutter={16}>
            <Col span={12}>
              {renderOptionList("Colors:", ["customization", "color"])}
            </Col>
            <Col span={12}>
              {renderOptionList("Flavors:", ["customization", "flavor"])}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              {renderOptionList("Toppings:", ["customization", "toppings"])}
            </Col> 
            <Col span={12}>
              <p>Sizes</p>
              <Form.List name={["customization", "size"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          rules={[{ required: true, message: "Missing size" }]}
                        >
                          <Select placeholder="Select Size">
                            
                           
                            <Option value="1.5Kg">1.5Kg</Option>
                             <Option value="2Kg">2Kg</Option>
                            <Option value="2.5Kg">2.5Kg</Option>
                            <Option value="3Kg">3Kg</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          rules={[{ required: true, message: "Missing price" }]}
                        >
                          <InputNumber
                            placeholder="Price Adj."
                            style={{ width: 120 }}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Size Option
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editingCake ? "Save Changes" : "Add Cake"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
