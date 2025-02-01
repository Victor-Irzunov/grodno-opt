"use client"

import { deleteCategory, getAllCategory } from "@/http/adminAPI";
import AddCategoryForm from "../FormsAdmin/AddCategoryForm"
import { useEffect, useState } from "react";
import { Button, message, Modal, Popconfirm } from "antd"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UpdateCategoryForm from "../FormsAdmin/UpdateCategoryForm";


const AddCategoryAdmin = () => {
	const [category, setGategory] = useState([])
	const [addCategory, setAddCategory] = useState(null);
	const [isRender, setIsRender] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);


	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await getAllCategory();
				if (response) {
					setGategory(response);
				} else {
					message.error('Не удалось загрузить категории');
				}
			} catch (error) {
				console.error('Ошибка при получении категорий:', error);
				message.error('Ошибка при получении категорий');
			}
		};
			fetchGroups();
	}, [addCategory, isRender]);


	const showModal = (category) => {
			setEditingCategory(category);
			setIsModalOpen(true);
		};
	
		const handleCancel = () => {
			setIsModalOpen(false);
			setEditingCategory(null);
		};
	
		const confirm = (id) => {
			deleteCategory(id)
				.then(data => {
					console.log('data: ', data)
					if (data) {
						message.success(data.message)
						setIsRender(i => !i)
					}
				})
		};
		const cancel = (e) => {
			message.success('Отмена');
		};
	

	
	return (
		<div className="pt-10 px-12 text-white pb-20">
			<p className='text-3xl mb-16'>
				Добавить категорию
			</p>
			<AddCategoryForm setAddCategory={setAddCategory} />
			<div className='mt-20 pl-11'>
				{
					category.length ? <p className='text-sm'>
						Категории в базе:
					</p>
						:
						null
				}
				<ul className='mt-4 grid grid-cols-2' >
					{
						category.length ? category.map((el,idx) => {
							return (
								<li className='text-gray-400 mx-3 border-b border-gray-700 pb-2 flex items-center justify-between text-sm mb-4 cursor-pointer hover:text-white' key={el.id}>
									<span className="">{idx + 1}. {el.title}</span>
									<div className='flex space-x-3'>
										<Button size="small"
											shape=""
											className="bg-transparent text-white"
											icon={<EditOutlined />}
											onClick={() => showModal(el)}
										/>
										<Popconfirm
											title="Удалить категорию"
											description="Удаление категории приведёт к удалению всех товаров, связанных с ней. Вы уверены, что хотите удалить категорию?"
											onConfirm={() => confirm(el.id)}
											onCancel={cancel}
											okText="Да"
											cancelText="Нет"
										>
											<Button
												size="small"
												shape=""
												className="bg-transparent text-red-500 border-red-500"
												icon={<DeleteOutlined />}
											/>
										</Popconfirm>
									</div>
								</li>
							)
						})
							:
							null
					}
				</ul>
			</div>


			<Modal
				title="Редактировать категорию"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
			>
				<UpdateCategoryForm editingCategory={editingCategory} handleCancel={handleCancel} setIsRender={setIsRender} />
			</Modal>
		</div>
	)
}

export default AddCategoryAdmin