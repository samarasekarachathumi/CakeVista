import { Button, Card, Form, Input, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { userLogin } from "../../service/userService";
import { useAuth } from "../../shared/contexts/AuthContext.jsx";
import { Roles } from "../../shared/constants/roles.js";
import { useNotification } from '../../shared/contexts/NotificationContext.jsx'

const { Title } = Typography;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const onFinish = async (values) => {
    try {
      const response = await userLogin(values);
      showSuccess("Login successful");
      login(response.user, response.token, response.extraData);
      if (response.user.role === Roles.Admin) {
        navigate("/admin/dashboard");
      } else if (response.user.role === Roles.ShopOwner) {
        navigate("/owner/dashboard");
      } 
      else if (response.user.role === Roles.Customer) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      showError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Card style={{ maxWidth: 420, margin: "40px auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Login
      </Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ role: "customer" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="john@example.com" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>
        {/* <Form.Item label="Role" name="role">
          <Radio.Group>
            <Radio.Button value="customer">Customer</Radio.Button>
            <Radio.Button value="owner">Shop Owner</Radio.Button>
            <Radio.Button value="admin">Admin</Radio.Button>
          </Radio.Group>
        </Form.Item> */}
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          New here? <Link to="/register">Create an account</Link>
        </div>
      </Form>
    </Card>
  );
}
