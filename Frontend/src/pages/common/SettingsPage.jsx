import { Card, Form, Switch } from 'antd'

export default function SettingsPage() {
  return (
    <Card title="Settings">
      <Form layout="vertical" initialValues={{ emailNotifs: true }}>
        <Form.Item label="Email notifications" name="emailNotifs" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Card>
  )
}

