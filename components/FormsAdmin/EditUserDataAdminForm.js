import { Button, Form, Input, InputNumber } from "antd";
import { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { sendOrderTelegram } from "@/http/telegramAPI";
import { editUserDataAdmin } from "@/http/adminAPI";

const EditUserDataAdminForm = ({ data, onSuccess }) => {
	const [form] = Form.useForm();
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState('');

	const onFinish = async (values) => {
		try {
			const response = await editUserDataAdmin(values);
			if (response) {
				form.resetFields();
				setToastMessage('Данные изменены!');
				setToastVisible(true);

				// Отправка в телеграм
				const messageForm = `
				<b>Измененые данные клиента:</b>\n
				<b>ФИО:</b> ${values.fullName}\n
				<b>Телефон:</b> <a href='tel:${values.phone}'>${values.phone}</a>\n
				<b>Почта:</b> ${values.email}\n
				<b>Адрес:</b> ${values.address}\n
				<b>Новый пароль:</b> ${values.password || ''}\n
				<b>Скидка:</b> ${values.discount}%\n
				<b>Лимит:</b> ${values.limit} $
				`;
				sendOrderTelegram(messageForm);

				setTimeout(() => {
					setToastVisible(false);
					setToastMessage('');
				}, 3000);

				if (onSuccess) onSuccess();
				
			} else {
				console.error('Ошибка редактирования клиента');
			}
		} catch (error) {
			console.error('Ошибка редактирования клиента:', error);
		}
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<>
			<Form
				form={form}
				name="editUser"
				layout="vertical"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				initialValues={data}
				className="grid sd:grid-cols-2 xz:grid-cols-1 sd:gap-6 xz:gap-0"
			>
				<Form.Item
					label={<span style={{ color: 'white' }}>Фамилия Имя Отчество</span>}
					name="fullName"
					rules={[{ required: true, message: 'Пожалуйста, введите ФИО' }]}
				>
					<Input
						placeholder="Полное ФИО"
						className="placeholder-white/45"
						style={{ backgroundColor: '#191919', color: 'white' }}
					/>
				</Form.Item>

				<Form.Item
					label={<span style={{ color: 'white' }}>E-mail</span>}
					name="email"
					rules={[
						{ required: true, message: 'Пожалуйста, введите E-mail' },
						{ type: 'email', message: 'Введите корректный E-mail' },
					]}
				>
					<Input
						placeholder="Почта клиента"
						className="placeholder-white/45"
						style={{ backgroundColor: '#191919', color: 'white' }}
					/>
				</Form.Item>

				<Form.Item
					label={<span style={{ color: 'white' }}>Пароль</span>}
					name="password"
					tooltip={{
						title: 'Придумайте клиенту пароль',
						color: '#191919',
						overlayStyle: { color: 'white' },
						icon: <QuestionCircleOutlined style={{ color: 'white' }} />
					}}
				>
					<Input.Password
						style={{ backgroundColor: '#191919', color: 'white' }}
						iconRender={(visible) =>
							visible ? <EyeOutlined style={{ color: 'white' }} /> : <EyeInvisibleOutlined style={{ color: 'white' }} />
						}
					/>
				</Form.Item>

				<Form.Item
					label={<span style={{ color: 'white' }}>Телефон</span>}
					name="phone"
					rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}
				>
					<Input
						placeholder="+375 29 491-19-11"
						className="placeholder-white/45"
						style={{ backgroundColor: '#191919', color: 'white' }} />
				</Form.Item>

				<div className='flex space-x-4'>
					<Form.Item
						label={<span style={{ color: 'white' }}>Скидка</span>}
						name="discount"
						rules={[{ required: true, message: 'Пожалуйста, введите скидку' }]}
					>
						<InputNumber
							min={0}
							max={100}
							formatter={value => `${value}%`}
							parser={value => (value ? value.replace('%', '') : '')}
							style={{ backgroundColor: '#191919', color: 'white' }}
							className="white-text"
						/>
					</Form.Item>

					<Form.Item
						label={<span style={{ color: 'white' }}>Лимит $</span>}
						name="limit"
						rules={[{ required: true, message: 'Пожалуйста, введите лимит' }]}
					>
						<InputNumber
							min={0}
							style={{ backgroundColor: '#191919', color: 'white' }}
							className="white-text"
						/>
					</Form.Item>
				</div>

				<Form.Item
					label={<span style={{ color: 'white' }}>Адрес</span>}
					name="address"
					rules={[{ required: true, message: 'Пожалуйста, введите адрес' }]}
				>
					<Input
						className="placeholder-white/45"
						placeholder="Адрес клиента"
						style={{ backgroundColor: '#191919', color: 'white' }} />
				</Form.Item>

				<Form.Item className='sd:mt-7 xz:mt-1'>
					<Button type="primary"
						htmlType="submit"
						color="primary"
						variant="outlined" style={{ width: '100%', backgroundColor: '#191919' }}>
						Сохранить
					</Button>
				</Form.Item>
			</Form>

			{toastVisible && (
				<div className="toast toast-center toast-middle">
					<div className="alert alert-success">
						<span className="text-white font-bold">{toastMessage}</span>
					</div>
				</div>
			)}
		</>
	);
};

export default EditUserDataAdminForm;
