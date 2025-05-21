// components/EditProductForm.js
import { Form, InputNumber, Select, Button, message } from 'antd'
import { useEffect } from 'react'

const { Option } = Select

const EditProductForm = ({ product, onFinish }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      count: product.count,
      status: product.status
    })
  }, [product])

  return (
    <Form form={form} layout="vertical" onFinish={(values) => onFinish({ ...values, id: product.id })}>
      <Form.Item name="count" label="Количество" rules={[{ required: true, message: 'Укажите количество' }]}> 
        <InputNumber min={0} className="w-full" />
      </Form.Item>

      <Form.Item name="status" label="Статус" rules={[{ required: true, message: 'Выберите статус' }]}> 
        <Select>
          <Option value="В наличии">в наличии</Option>
          <Option value="Нет в наличии">нет в наличии</Option>
          <Option value="Под заказ">под заказ</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Сохранить</Button>
      </Form.Item>
    </Form>
  )
}

export default EditProductForm