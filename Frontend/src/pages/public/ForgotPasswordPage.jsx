import { Card, Form, Input, Typography, Button, message } from 'antd'

const { Title, Paragraph } = Typography

export default function ForgotPasswordPage() {
  const onFinish = async () => {
    await new Promise((r) => setTimeout(r, 500))
    message.success('If an account exists, reset link was sent')
  }
  return (
    <Card style={{ maxWidth: 420, margin: '40px auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>Forgot Password</Title>
      <Paragraph style={{ textAlign: 'center' }}>Enter your email to receive a reset link.</Paragraph>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Send Reset Link</Button>
      </Form>
    </Card>
  )
}


