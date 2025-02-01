"use client";
import React, { useEffect, useState } from 'react';
import { addGroup, getAllCategory } from '@/http/adminAPI';
import { Button, Form, message, Input } from 'antd';
import Image from 'next/image';
import { RiAlignItemHorizontalCenterFill } from 'react-icons/ri';

const AddGroupForm = ({ selectedCategory, setSelectedCategory, setIsRender }) => {
	const [form] = Form.useForm();
	const [categories, setCategories] = useState([]);


	// Получение всех категорий
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await getAllCategory();
				if (response) {
					setCategories(response);
					setIsRender(response)
				} else {
					message.error('Не удалось загрузить категории');
				}
			} catch (error) {
				console.error('Ошибка при получении категорий:', error);
				message.error('Ошибка при получении категорий');
			}
		};
		fetchCategories();
	}, []);

	const onCategorySelect = (categoryId) => {
		setSelectedCategory(categoryId); // Устанавливаем выбранную категорию
	};

	const onFinish = async (values) => {
		if (!selectedCategory) {
			message.error('Пожалуйста, выберите категорию для группы.');
			return;
		}

		try {
			const response = await addGroup({ title: values.title, categoryId: selectedCategory });
			if (response && response.id) {
				message.success('Группа успешно добавлена!');
				form.resetFields();
				setSelectedCategory(null);
			} else {
				message.error('Не удалось добавить группу. Попробуйте снова.');
			}
		} catch (error) {
			console.error('Ошибка при добавлении группы:', error);
			message.error(error.response?.data?.message || 'Ошибка при добавлении группы');
		}
	};

	return (
		<div className="pl-10">
			<Form
				form={form}
				name="addGroup"
				onFinish={onFinish}
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 12 }}
			>
				<Form.Item
					label={<span style={{ color: 'white' }}>Введите название группы</span>}
					name="title"
					rules={[{ required: true, message: 'Введите название группы' }]}
				>
					<Input size="large" style={{ backgroundColor: '#191919', color: 'white' }} />
				</Form.Item>

				<div className="form-control mb-9 mt-12">
					<label className="label">
						<span className="label-text text-gray-300 flex items-center">
							Выберите категорию
							<div className="ml-2 tooltip" data-tip="Выберите категорию к которой будет отноститься данная группа.">
								<Image src='/svg/question.svg' alt='Вопрос' width={15} height={15} className='' />
							</div>
						</span>
					</label>
					<div className='grid grid-cols-4'>
						{categories.map((category) => (
							<label className="label cursor-pointer flex justify-start space-x-2" key={category.id}>
								<input type="checkbox" defaultChecked className="checkbox checkbox-primary"
									checked={selectedCategory === category.id}
									onChange={() => onCategorySelect(category.id)}
								/>
								<span className="label-text text-white">{category.title}</span>
							</label>
						))}
					</div>
				</div>

				<Form.Item wrapperCol={{ span: 12 }}>
					<Button color="primary" variant="outlined" style={{ backgroundColor: '#191919' }} htmlType="submit">
						Сохранить
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default AddGroupForm;
