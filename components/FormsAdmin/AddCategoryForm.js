"use client";
import { addCategory } from '@/http/adminAPI';
import { Button, Form, message, Input } from 'antd';


const AddCategoryForm = ({setAddCategory}) => {
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		try {
			const response = await addCategory({ title: values.title });
			if (response && response.id) {
				setAddCategory(response)
				message.success('Категория успешно добавлена!');
				form.resetFields();
			} else {
				message.error('Не удалось добавить категорию. Попробуйте снова.');
			}
		} catch (error) {
			console.error('Ошибка при добавлении категории:', error);
			message.error(error.response?.data?.message || 'Ошибка при добавлении категории');
		}
	};
	return (
		<div className='pl-10'>
			<Form
				form={form}
				name="addCategory"
				onFinish={onFinish}
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 12 }}
			>
				<Form.Item
					label={<span style={{ color: 'white' }}>Введите название категории</span>}
					name="title"
					rules={[{ required: true, message: 'Введите название категории' }]}
				>
					<Input size="large" style={{ backgroundColor: '#191919', color: 'white' }} />
				</Form.Item>

				<Form.Item
					wrapperCol={{ span: 12 }}
				>
					<Button color="primary" variant="outlined" style={{ backgroundColor: '#191919' }} htmlType="submit">
						Сохранить
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default AddCategoryForm