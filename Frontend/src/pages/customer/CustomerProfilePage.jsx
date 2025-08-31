import { Card, Avatar, Typography, Tag } from 'antd'
import { UserOutlined, MailOutlined, CrownOutlined } from '@ant-design/icons'
import { useAuth } from '../../shared/contexts/AuthContext.jsx'

const { Title, Text } = Typography

export default function CustomerProfilePage() {
  const { user } = useAuth()
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem',
      background: 'linear-gradient(135deg, #fce4ec, #e3f2fd)', 
      borderRadius: '15px'
    }}>
      <Card
        style={{ 
          width: 400, 
          borderRadius: '20px', 
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          background: '#fff'
        }}
      >
        <Avatar 
          size={100} 
          icon={<UserOutlined />} 
          style={{ backgroundColor: '#ffb6c1', marginBottom: '1rem' }}
        >
          {fullName ? fullName.charAt(0) : ''}
        </Avatar>

        <Title level={3} style={{ marginBottom: 0, color: '#333' }}>
          {fullName || 'Anonymous User'}
        </Title>

        <Text type="secondary" style={{ display: 'block', marginBottom: '1rem' }}>
          <MailOutlined /> {user?.email}
        </Text>

        <Tag color="pink" style={{ padding: '5px 12px', borderRadius: '12px', fontSize: '14px' }}>
          <CrownOutlined /> {user?.role}
        </Tag>
      </Card>
    </div>
  )
}
