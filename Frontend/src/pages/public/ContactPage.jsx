import { Card, Form, Input, Button, Typography, message } from 'antd'

const { Title } = Typography

export default function ContactPage() {
  const onFinish = async () => {
    await new Promise((r) => setTimeout(r, 400))
    message.success('Message sent')
  }
  return (
    <Card>
      <Title level={3}>Contact Us</Title>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 520 }}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
        <Form.Item label="Message" name="message" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
        <Button type="primary" htmlType="submit">Send</Button>
      </Form>
    </Card>
  )
}


