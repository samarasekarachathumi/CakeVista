import { Card, Descriptions, Form, Input } from "antd";
import { useAuth } from "../../shared/contexts/AuthContext.jsx";

export default function OwnerProfilePage() {
  const { user } = useAuth();
  return (
    <Card title="Shop Profile">
      <Descriptions
        bordered
        items={[
          { key: "shop", label: "Shop Name", children: "My Cake Shop" },
          { key: "city", label: "City", children: "Colombo" },
        ]}
      />
      <Form layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label="Contact Email">
          <Input value={user?.email} />
        </Form.Item>
      </Form>
    </Card>
  );
}
