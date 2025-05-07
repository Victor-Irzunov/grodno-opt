import { useState } from 'react';
import { Form, InputNumber, Button, Select, message } from 'antd';

const { Option } = Select;

const AddBalance = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/add-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        message.success('Баланс успешно пополнен');
        form.resetFields();
      } else {
        message.error(data.message || 'Ошибка при пополнении баланса');
      }
    } catch (err) {
      console.error(err);
      message.error('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item
          label={<span style={{ color: 'white' }}>ID клиента</span>}
          name="userId"
          rules={[{ required: true, message: 'Введите ID клиента' }]}
        >
          <InputNumber
            style={{ backgroundColor: '#191919', color: 'white', width:'50%' }}
            className="white-text white-placeholder"
            placeholder="Введите ID пользователя"
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: 'white' }}>Сумма пополнения $</span>}
          name="amount"
          rules={[{ required: true, message: 'Введите сумму' }]}
        >
          <InputNumber
            min={0.01}
            step={0.01}
            placeholder="Введите сумму"
            style={{ backgroundColor: '#191919', color: 'white', width:'50%' }}
            className="white-text"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Пополнить баланс
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddBalance;
