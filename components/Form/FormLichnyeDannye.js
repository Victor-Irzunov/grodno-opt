import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { dataUser2 } from '@/http/userAPI';

export const FormLichnyeDannye = ({ user }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("🚀 🚀 🚀  _ onFinish _ values:", values);
    const response = await dataUser2({ ...values, phone: values.phone });
    if (response) {
      setToastMessage('Данные сохранены');
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 4000);
      form.resetFields();
    } else {
      setToastMessage('Не удалось сохранить данные');
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 4000);
      console.log('Failed to save user data');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Form
        form={form}
        name="lichnye_dannye"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          email: user?.email,
			  fullName: user?.userData?.fullName,
			 phone: user?.userData?.phone
		  }}
		className='grid sd:grid-cols-2 xz:grid-cols-1 sd:gap-6 xz:gap-0'
      >
        <Form.Item
          label="Фамилия Имя Отчество"
          name="fullName"
          rules={[{ required: true, message: 'Пожалуйста, введите ФИО' }]}
        >
          <Input placeholder="Заполните, чтобы мы знали, как к вам обращаться" style={{ borderRadius: '2px' }} />
        </Form.Item>

        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            { required: true, message: 'Пожалуйста, введите E-mail' },
            { type: 'email', message: 'Введите корректный E-mail' },
          ]}
        >
          <Input placeholder="Для отправки уведомлений о статусе заказа" style={{ borderRadius: '2px' }} />
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phone"
          rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}
        >
          <Input placeholder="+375 29 491-19-11"  style={{ width: '100%', borderRadius: '2px' }} />
        </Form.Item>

        <Form.Item className='sd:mt-7 xz:mt-1'>
          <Button type="primary" htmlType="submit" style={{ width: '100%', borderRadius: '2px' }}>
            Сохранить изменения
          </Button>
        </Form.Item>
      </Form>

      {toastVisible && (
        <div className="toast toast-center toast-middle">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormLichnyeDannye;
