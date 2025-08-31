import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Upload,
  Avatar,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import {
  getShopByShopOwnerId,
  updateShopDetails,
} from "../../service/shopService";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";
import mediaUpload from "../../util/mediaUpload.jsx";

const { Title, Text } = Typography;
const { Option } = Select;

const provincesAndDistricts = {
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
  "Eastern Province": ["Ampara", "Batticaloa", "Trincomalee"],
  "Northern Province": [
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Mullaitivu",
    "Vavuniya",
  ],
  "North Central Province": ["Anuradhapura", "Polonnaruwa"],
  "North Western Province": ["Kurunegala", "Puttalam"],
  "Sabaragamuwa Province": ["Kegalle", "Ratnapura"],
  "Southern Province": ["Galle", "Hambantota", "Matara"],
  "Uva Province": ["Badulla", "Monaragala"],
  "Western Province": ["Colombo", "Gampaha", "Kalutara"],
};

export default function ShopProfileEditPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [images, setImages] = useState(null);
  const [currentShopId, setCurrentShopId] = useState(null);
  const { showSuccess, showError } = useNotification();

  const onFinish = async (values) => {
    setLoading(true);

    let uploadedUrl = shopData?.profilePicture;
    if (images) {
      uploadedUrl = await mediaUpload(images[0]);
    }

    const payload = {
      shopName: values.shopName,
      shopAddress: [
        {
          streetAddress: values.streetAddress,
          city: values.city,
          district: values.district,
          province: values.province,
        },
      ],
      profilePicture: uploadedUrl,
      description: values.description,
    };

    try {
      await updateShopDetails(currentShopId, payload);
      showSuccess("Profile updated successfully!");
      getShopDetails();
    } catch (error) {
      showError("Failed to update profile. Please try again. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getShopDetails = async () => {
    try {
      const res = await getShopByShopOwnerId();
      const data = res.data;
      setCurrentShopId(data._id);
      setShopData(data);
      form.setFieldsValue({
        shopName: data.shopName,
        streetAddress: data.shopAddress?.[0]?.streetAddress || "",
        city: data.shopAddress?.[0]?.city || "",
        district: data.shopAddress?.[0]?.district || "",
        province: data.shopAddress?.[0]?.province || "",
        description: data.description || "",
      });
    } catch (error) {
      showError("Failed to load shop details. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getShopDetails();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Edit Your Shop Profile
      </Title>
      <Text
        type="secondary"
        style={{
          display: "block",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        Update your shop details to help customers find you.
      </Text>

      {/* Profile Picture Preview */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <Avatar
          size={100}
          src={previewImage || shopData?.profilePicture}
          icon={<UserOutlined />}
        />
      </div>

      <Card
        bordered
        style={{ maxWidth: 640, margin: "0 auto", borderRadius: "8px" }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Shop Name"
            name="shopName"
            rules={[
              { required: true, message: "Please enter your shop name!" },
            ]}
          >
            <Input placeholder="e.g., The Cake Factory" />
          </Form.Item>
          <Form.Item label="Street Address" name="streetAddress">
            <Input placeholder="e.g., 123 Main Street" />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please enter your city!" }]}
          >
            <Input placeholder="e.g., Colombo" />
          </Form.Item>

          <Form.Item
            label="Province"
            name="province"
            rules={[{ required: true, message: "Please select a province!" }]}
          >
            <Select
              placeholder="Select a province"
              onChange={() => form.setFieldsValue({ district: undefined })}
            >
              {Object.keys(provincesAndDistricts).map((province) => (
                <Option key={province} value={province}>
                  {province}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) => {
              if (prevValues === undefined) return false;
              return prevValues?.province !== currentValues?.province;
            }}
          >
            {({ getFieldValue }) => {
              const selectedProvince = getFieldValue("province");
              return (
                <Form.Item
                  label="District"
                  name={"district"}
                  rules={[{ required: true }]}
                  shouldUpdate={(prevValues, currentValues) => {
                    if (prevValues === undefined) return true;
                    return prevValues?.province !== currentValues?.province;
                  }}
                >
                  <Select
                    placeholder="Select a district"
                    disabled={!selectedProvince}
                  >
                    {selectedProvince &&
                      provincesAndDistricts[selectedProvince].map(
                        (district) => (
                          <Option key={district} value={district}>
                            {district}
                          </Option>
                        )
                      )}
                  </Select>
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              rows={4}
              placeholder="Tell your customers about your shop and what makes your products special."
            />
          </Form.Item>
          <Form.Item label="Change Profile Picture" name="profilePicture">
            <input
              type="file"
              onChange={(e) => {
                setImages(e.target.files);
                setPreviewImage(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%", marginTop: "16px" }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
