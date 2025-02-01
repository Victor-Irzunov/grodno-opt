"use client";
import { GetGoogle, uploadPriceProduct } from '@/http/adminAPI';
import { Button, Form, message } from 'antd';
import { useEffect, useState } from 'react';

const AddProductPrice = ({ setData, data }) => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false); // 🔥 Добавлено состояние загрузки

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await GetGoogle();
				setData(response.data);
			} catch (err) {
				console.error("🚀 🚀 🚀  _ fetchData _ err:", err);
				setError(err.message || 'Ошибка загрузки прайса');
			}
		}
		fetchData();
	}, []);

	const onFinish = async () => {
		try {
			if (data.length) {
				setIsLoading(true); // 🔥 Блокируем кнопку перед запросом
				const response = await uploadPriceProduct({ data });
				console.log("🚀 🚀 🚀  _ onFinish _ response:", response);

				if (response.success === false) {
					message.warning(response.message || 'Этот прайс уже был загружен ранее');
				} else {
					message.success('Прайс успешно загружен');
					setData(response);
				}
			}
		} catch (error) {
			console.error('Ошибка при загрузке прайса:', error);
			message.error(error.response?.data?.message || 'Ошибка при добавлении товара');
		} finally {
			setIsLoading(false); // 🔥 Разблокируем кнопку после запроса
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
				<Form.Item wrapperCol={{ span: 12 }}>
					<Button
						color="primary"
						variant="outlined"
						style={{ backgroundColor: '#191919' }}
						htmlType="submit"
						disabled={isLoading} // 🔥 Кнопка блокируется во время запроса
					>
						{isLoading ?
							<span className='text-white/80'>Загрузка ....</span>
							:
							'Загрузить прайс'
						}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default AddProductPrice;
