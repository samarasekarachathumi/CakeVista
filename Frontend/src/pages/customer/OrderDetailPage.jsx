import { Card, Descriptions, Tag } from 'antd'
import { useParams } from 'react-router-dom'
import { formatCurrencyLKR } from '../../shared/utils/currency.js'

export default function OrderDetailPage() {
  const { id } = useParams()
  const order = { id, total: 5400, status: 'Delivered' }
  return (
    <Card title={`Order #${order.id}`}>
      <Descriptions bordered items={[
        { key: 'total', label: 'Total', children: formatCurrencyLKR(order.total) },
        { key: 'status', label: 'Status', children: <Tag color="green">{order.status}</Tag> },
      ]} />
    </Card>
  )
}


