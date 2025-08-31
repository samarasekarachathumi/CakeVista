import { List, Card } from 'antd'

export default function NotificationsPage() {
  const items = [
    { id: 1, title: 'Order shipped', description: 'Your order #123 has been shipped.' },
    { id: 2, title: 'Ad approved', description: 'Your ad has been approved.' },
  ]
  return (
    <Card title="Notifications">
      <List
        dataSource={items}
        renderItem={(n) => (
          <List.Item>
            <List.Item.Meta title={n.title} description={n.description} />
          </List.Item>
        )}
      />
    </Card>
  )
}


