import { Typography, Card } from 'antd'

const { Title, Paragraph } = Typography

export default function AboutPage() {
  return (
    <Card>
      <Title level={2}>About Cake Vista</Title>
      <Paragraph>
        Cake Vista connects cake lovers with local bakeries. Discover, order, and enjoy!
      </Paragraph>
    </Card>
  )
}


