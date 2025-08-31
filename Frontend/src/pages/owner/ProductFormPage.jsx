import { Button, Card, Form, Input, InputNumber, Upload, message, Row, Col, Select, Space } from 'antd'
import { PlusOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { CATEGORY_GROUPS } from '../../shared/constants/catalog.js'

const { Option } = Select

export default function ProductFormPage() {
  const onFinish = async (values) => {
    await new Promise((r) => setTimeout(r, 500))
    message.success('Product created')
  }
  return (
    <Card title="New Product">
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 900 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Base Price" name="basePrice" rules={[{ required: true }]}><InputNumber min={0} addonBefore="LKR" style={{ width: '100%' }} /></Form.Item>
          </Col>
        </Row>

        <Form.Item label="Description" name="description"><Input.TextArea rows={3} /></Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Categories (Flavors)" name={[ 'categories', 'flavors' ]}>
              <Select mode="multiple" options={CATEGORY_GROUPS.flavors.map((c) => ({ value: c, label: c }))} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Categories (Occasions)" name={[ 'categories', 'occasions' ]}>
              <Select mode="multiple" options={CATEGORY_GROUPS.occasions.map((c) => ({ value: c, label: c }))} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Dietary" name={[ 'categories', 'dietary' ]}>
              <Select mode="multiple" options={CATEGORY_GROUPS.dietary.map((c) => ({ value: c, label: c }))} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Styles" name={[ 'categories', 'styles' ]}>
              <Select mode="multiple" options={CATEGORY_GROUPS.styles.map((c) => ({ value: c, label: c }))} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Images" name="images">
          <Upload listType="picture" multiple>
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>

        <h3>Customizations</h3>
        <Row gutter={16}>
          <Col span={12}>
            <Form.List name={[ 'customization', 'size' ]}>
              {(fields, { add, remove }) => (
                <>
                  <p>Sizes</p>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Missing size' }]}>
                        <Select placeholder="Select Size">
                          <Option value="1Lbs">1Lbs</Option>
                          <Option value="2Lbs">2Lbs</Option>
                          <Option value="3Lbs">3Lbs</Option>
                          <Option value="4Lbs">4Lbs</Option>
                          <Option value="5Lbs">5Lbs</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]}>
                        <InputNumber placeholder="Price Adj." style={{ width: 120 }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Size</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          <Col span={12}>
            <Form.List name={[ 'customization', 'flavor' ]}>
              {(fields, { add, remove }) => (
                <>
                  <p>Flavors</p>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                        <Input placeholder="Name" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]}>
                        <InputNumber placeholder="Price Adj." style={{ width: 120 }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Flavor</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.List name={[ 'customization', 'toppings' ]}>
              {(fields, { add, remove }) => (
                <>
                  <p>Toppings</p>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                        <Input placeholder="Name" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]}>
                        <InputNumber placeholder="Price Adj." style={{ width: 120 }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Topping</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          <Col span={12}>
            <Form.List name={[ 'customization', 'color' ]}>
              {(fields, { add, remove }) => (
                <>
                  <p>Colors</p>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                        <Input placeholder="Name" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]}>
                        <InputNumber placeholder="Price Adj." style={{ width: 120 }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Color</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">Create</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}


