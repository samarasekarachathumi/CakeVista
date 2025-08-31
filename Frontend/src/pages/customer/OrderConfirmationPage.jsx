import { Result, Card, Typography, Space, Tag, Button } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatCurrencyLKR } from '../../shared/utils/currency.js'

const { Title, Text } = Typography

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const ordersData = location.state?.data.orders // Access the 'orders' array

  if (!ordersData || ordersData.length === 0) {
    return (
      <Result
        status="warning"
        title="No order data found"
        subTitle="Please complete a purchase to view order confirmation."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Browse Products
          </Button>
        }
      />
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Result
        status="success"
        title="Orders Placed Successfully!"
        subTitle={`You have placed ${ordersData.length} order(s). A confirmation email has been sent to you.`}
        extra={[
          <Button type="primary" key="orders" onClick={() => navigate('/customer/orders')}>
            View My Orders
          </Button>,
          <Button key="home" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>,
        ]}
      />
      
      {ordersData.map((order, orderIndex) => (
        <Card 
          key={order._id} 
          title={`Order Details for Shop: ${order.shop_id}`} // You might want to populate shop name in the future
          style={{ marginTop: 24 }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong>Order ID:</Text>
              <br />
              <Text type="secondary">{order._id}</Text>
            </div>
            <div>
              <Text strong>Delivery Address:</Text>
              <br />
              <Text type="secondary">{order.delivery_address}</Text>
            </div>
            <div>
              <Text strong>Payment Method:</Text>
              <br />
              <Tag color={order.payment_type === 'card' ? 'blue' : 'orange'}>
                {order.payment_type === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
              </Tag>
            </div>
            
            <div>
              <Text strong>Order Summary:</Text>
              <br />
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} style={{ marginTop: 8, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  {/* You'll need to fetch product details to display the name */}
                  <Text strong>Product ID: {item.product_id}</Text> 
                  <br />
                  <Text type="secondary">
                    Quantity: {item.quantity} | Price: {formatCurrencyLKR(item.price)}
                  </Text>
                  {item.selected_customizations && (
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.selected_customizations.size && `Size: ${item.selected_customizations.size.name}`}
                        {item.selected_customizations.extra_toppings && item.selected_customizations.extra_toppings.length > 0 && ` | Toppings: ${item.selected_customizations.extra_toppings.map(t => t.name).join(', ')}`}
                        {item.selected_customizations.custom_message?.message && ` | Message: ${item.selected_customizations.custom_message.message}`}
                      </Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <Title level={4} style={{ margin: 0, color: '#E75480' }}>
                Total: {formatCurrencyLKR(order.total_amount)}
              </Title>
            </div>
          </Space>
        </Card>
      ))}
    </div>
  )
}
