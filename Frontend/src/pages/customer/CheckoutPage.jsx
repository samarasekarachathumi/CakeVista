import { Button, Card, Form, Input, Radio, Typography, message } from 'antd'
import { useCart } from '../../shared/contexts/CartContext.jsx'
import { formatCurrencyLKR } from '../../shared/utils/currency.js'

const { Title } = Typography

export default function CheckoutPage() {
  const { total, clear } = useCart()
  const onFinish = async () => {
    await new Promise((r) => setTimeout(r, 600))
    message.success('Payment successful')
    clear()
  }

  return (
    <Card>
      <Title level={3}>Checkout</Title>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 640 }}>
        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Address" name="address" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
        <Form.Item label="Payment Method" name="payment" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="card">Card</Radio>
            <Radio value="cod">Cash on Delivery</Radio>
          </Radio.Group>
        </Form.Item>
        <Button type="primary" htmlType="submit">Pay {formatCurrencyLKR(total)}</Button>
      </Form>
    </Card>
  )
}


