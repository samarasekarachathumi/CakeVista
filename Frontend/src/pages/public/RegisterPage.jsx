import {
  Button,
  Card,
  Form,
  Input,
  Radio,
  Typography,
  Row,
  Col,
  Select,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../service/userService";
import { Roles } from "../../shared/constants/roles.js";
import { useNotification } from '../../shared/contexts/NotificationContext.jsx'

const { Title } = Typography;
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [role, setRole] = useState(Roles.Customer);
  const { showSuccess, showError } = useNotification();

  const onFinish = async (values) => {
    try {
      await registerUser(values);
      showSuccess("Account created");
      navigate("/login");
    } catch (e) {
      console.error("Registration failed:", e);
      showError("Registration failed");
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <Card style={{ maxWidth: 640, margin: "40px auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Create Account
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ role: Roles.Customer }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input placeholder="Jane" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="jane@example.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
              message:
                "Password must be at least 8 characters and contain at least one uppercase letter, one number, and one special character (!@#$%^&*).",
            },
          ]}
        >
          <Input.Password placeholder="Min 8 characters" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

        <Form.Item label="Role" name="role">
          <Radio.Group onChange={handleRoleChange}>
            <Radio.Button value={Roles.Customer}>Customer</Radio.Button>
            <Radio.Button value={Roles.ShopOwner}>Shop Owner</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {role === Roles.Customer && (
          <>
            <Form.Item label="Address" name="address">
              <Input placeholder="123 Main St." />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="+1 234 567 8900" />
            </Form.Item>
          </>
        )}

        {role === Roles.ShopOwner && (
          <>
            <Form.Item
              label="Shop Name"
              name="shopName"
              rules={[{ required: true }]}
            >
              <Input placeholder="My Shop" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Street Address"
                  name={["shopAddress", 0, "streetAddress"]}
                >
                  <Input placeholder="123 Main St." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="City" name={["shopAddress", 0, "city"]}>
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Province"
                  name={["shopAddress", 0, "province"]}
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select a province"
                  >
                    {Object.keys(provincesAndDistricts).map((province) => (
                      <Option key={province} value={province}>
                        {province}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  shouldUpdate={(prevValues, currentValues) => {
                    if (prevValues === undefined) return false;
                    return (
                      prevValues?.shopAddress?.[0]?.province !==
                      currentValues?.shopAddress?.[0]?.province
                    );
                  }}
                >
                  {({getFieldValue}) => {
                    const selectedProvince = getFieldValue(["shopAddress", 0, "province"]);
                    return (
                      <Form.Item
                        label="District"
                        name={["shopAddress", 0, "district"]}
                        rules={[{ required: true }]}
                        shouldUpdate={(prevValues, currentValues) => {
                          if (prevValues === undefined) return true;
                          return (
                            prevValues?.shopAddress?.[0]?.province !==
                            currentValues?.shopAddress?.[0]?.province
                          );
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
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Longitude"
                  name={["shopLocation", "coordinates", 0]}
                >
                  <Input type="number" placeholder="Longitude" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Latitude"
                  name={["shopLocation", "coordinates", 1]}
                >
                  <Input type="number" placeholder="Latitude" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Button type="primary" htmlType="submit" block>
          Sign Up
        </Button>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Form>
    </Card>
  );
}
