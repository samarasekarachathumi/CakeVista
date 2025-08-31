import { Button, Card, Form, Input, InputNumber, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'

export default function ProductEditPage() {
  const { id } = useParams()
  const onFinish = async () => {
    await new Promise((r) => setTimeout(r, 500))
    message.success('Product updated')
  }
  return (
    <Card title={`Edit Product #${id}`}>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 640 }}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Price" name="price" rules={[{ required: true }]}><InputNumber min={0} addonBefore="LKR" style={{ width: '100%' }} /></Form.Item>
        <Form.Item label="Image" name="image"><Upload><Button icon={<UploadOutlined />}>Upload</Button></Upload></Form.Item>
        <Button type="primary" htmlType="submit">Save</Button>
      </Form>
    </Card>
  )
}


