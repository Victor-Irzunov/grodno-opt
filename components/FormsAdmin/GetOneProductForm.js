"use client";
import { Button, Form, message, Divider, Input } from 'antd';
import { useState } from 'react';
import UpdateOneProductForm from './UpdateOneProductForm';
import { getOneProduct } from '@/http/adminAPI';

const GetOneProductForm = () => {
	const [form] = Form.useForm();
	const [product, setProduct] = useState({})

	const onFinish = async (values) => {
		getOneProduct(values.id)
			.then(data => {
				console.log("🚀 🚀 🚀  _ onFinish _ data:", data)
				if (data) {
					setProduct(data.oneProduct);
					message.success(`Товар с id: ${data?.oneProduct?.id} получен!`);
					form.resetFields();
				} else {
					message.warning(`Нет товара с id: ${values.id}!`);
				}
			})
			.catch(error => {
				console.error('Ошибка при получении товара:', error);
				message.error('Произошла ошибка при получении товара');
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
					label={<span style={{ color: 'white' }}>
						Введите ID товара</span>
					}
					name="id"
					rules={[{ required: true, message: 'Введите id товара' }]}
				>
					<Input type="number" style={{ backgroundColor: '#191919', color: 'white', width: '200px' }} />
				</Form.Item>

				<Form.Item
					// wrapperCol={{ offset: 5, span: 16 }}
					className=''
				>
					<Button type="primary" className='text-white bg-primary mt-7' htmlType="submit">
						Получить
					</Button>
				</Form.Item>
			</Form>
			<Divider />

			{
				product && Object.keys(product).length && typeof product !== 'string'
					?
					<UpdateOneProductForm data={product} setProduct={setProduct} />
					:
					null
			}
		</div>
	)
}

export default GetOneProductForm;