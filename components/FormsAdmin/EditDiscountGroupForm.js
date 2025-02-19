"use client";
import React, { useEffect, useState } from 'react';
import { Button, Form, message, Input } from 'antd';
import Image from 'next/image';
import { editDiscountGroup } from '@/http/adminAPI';

const EditDiscountGroupForm = ({ selectedCategory, setSelectedCategory, setIsRender, groups, categories }) => {
	const [form] = Form.useForm();
	const [discounts, setDiscounts] = useState({});

	useEffect(() => {
		// Инициализируем скидки из пропса groups
		const initialDiscounts = {};
		groups.forEach(group => {
			initialDiscounts[group.id] = group.discount !== null ? group.discount : '';
		});
		setDiscounts(initialDiscounts);
		form.setFieldsValue(initialDiscounts);
	}, [groups, form]);

	const onCategorySelect = (categoryId) => {
		setSelectedCategory(categoryId);
	};

	const handleDiscountChange = (groupId, value) => {
		setDiscounts(prev => ({ ...prev, [groupId]: value }));
	};

	const onFinish = async (values) => {
		// Создаём payload, заменяя пустые строки на 0
		const payload = Object.entries(values).map(([groupId, discount]) => ({
			groupId: Number(groupId),
			discount: discount === '' ? 0 : Number(discount),
		}));

		try {
			await editDiscountGroup({ discounts: payload });
			message.success('Скидки успешно обновлены');
			setIsRender(prev => !prev);
		} catch (error) {
			console.error('Ошибка при добавлении скидки:', error);
			message.error(error.response?.data?.message || 'Ошибка при добавлении скидки');
		}
	};

	return (
		<div className="pl-10">
			<Form
				form={form}
				name="editDiscountGroup"
				onFinish={onFinish}
				initialValues={discounts} // Устанавливаем начальные значения
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 12 }}
			>
				<div className="form-control mb-9 mt-12">
					<label className="label">
						<span className="label-text text-gray-300 flex items-center">
							Выберите категорию
							<div className="ml-2 tooltip" data-tip="Выберите категорию к которой будет относиться данная группа.">
								<Image src='/svg/question.svg' alt='Вопрос' width={15} height={15} />
							</div>
						</span>
					</label>
					<div className='grid grid-cols-4'>
						{categories.map((category) => (
							<label className="label cursor-pointer flex justify-start space-x-2" key={category.id}>
								<input type="checkbox" className="checkbox checkbox-primary"
									checked={selectedCategory === category.id}
									onChange={() => onCategorySelect(category.id)}
								/>
								<span className="label-text text-white">{category.title}</span>
							</label>
						))}
					</div>
				</div>

				<div className='mt-20'>
					{groups.length > 0 && <p className='text-sm text-white'>Группы данной категории:</p>}
					<ul className='mt-6 max-w-xl'>
						{groups.map((el, idx) => (
							<li className='text-gray-400 border-b border-gray-700 pb-2 flex items-center justify-between text-base mb-4 cursor-pointer hover:text-white' key={el.id}>
								<span>{idx + 1}. {el.title}</span>
								<div className='flex space-x-3'>
									<Form.Item label={<span className='text-[7px] uppercase font-light text-primary'>Скидка группы</span>} name={el.id} initialValue={discounts[el.id]}>
										<Input
											type="number"
											onChange={(e) => handleDiscountChange(el.id, e.target.value)}
											style={{ backgroundColor: '#191919', color: 'white', width: '100px' }}
										/>
									</Form.Item>
								</div>
							</li>
						))}
					</ul>
				</div>

				<Form.Item wrapperCol={{ span: 12 }} className="mt-6">
					<Button type="primary" htmlType="submit">Сохранить</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default EditDiscountGroupForm;
