import { Button, Space, Card } from 'antd'
import { useNotification } from '../../shared/contexts/NotificationContext.jsx'

export default function TestNotificationPage() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification()

  const handleShowSuccess = () => {
    showSuccess('Success', 'This is a success message!')
  }

  const handleShowError = () => {
    showError('Error', 'This is an error message!')
  }

  const handleShowWarning = () => {
    showWarning('Warning', 'This is a warning message!')
  }

  const handleShowInfo = () => {
    showInfo('Info', 'This is an info message!')
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Test Notifications">
        <Space direction="vertical" size="middle">
          <Button type="primary" onClick={handleShowSuccess}>
            Show Success Message
          </Button>
          <Button danger onClick={handleShowError}>
            Show Error Message
          </Button>
          <Button onClick={handleShowWarning}>
            Show Warning Message
          </Button>
          <Button type="default" onClick={handleShowInfo}>
            Show Info Message
          </Button>
        </Space>
      </Card>
    </div>
  )
}
