"use client";
import { Button, InputNumber, Form, message, Divider } from 'antd';
import { useState } from 'react';
import EditProductForm from './EditCarForm';
import { getOneCar } from '@/http/adminAPI';
import EditCarForm from './EditCarForm';

const GetCarForm = () => {
	const [form] = Form.useForm();
	const [product, setProduct] = useState({})

	const onFinish = async (values) => {
		getOneCar(values.id)
			.then(data => {
				if (data) {
					setProduct(data.car);
					message.success(`Машина с id: ${data.car.id} получена!`);
					form.resetFields();
				} else {
					message.warning(`Нет машины с id: ${values.id}!`);
				}
			})

			.catch(error => {
				console.error('Ошибка при получении машины:', error);
				message.error('Произошла ошибка при получении машины');
			});
	};

	return (
		<div className='pl-10'>
			<Form
				form={form}
				name="getProduct"
				onFinish={onFinish}
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 24 }}
			>
				<Form.Item
					label="Введите ID авто"
					name="id"
					rules={[{ required: true, message: 'Введите артикль продукта' }]}
				>
					<InputNumber />
				</Form.Item>

				<Form.Item
					// wrapperCol={{ offset: 5, span: 16 }}
				>
					<Button type="primary" className='text-white bg-primary' htmlType="submit">
						Получить
					</Button>
				</Form.Item>
			</Form>
			<Divider />

			{
				product && Object.keys(product).length && typeof product !== 'string'
					?
					<EditCarForm carData={product} setProduct={setProduct} />
					:
					null
			}
		</div>
	)
}

export default GetCarForm