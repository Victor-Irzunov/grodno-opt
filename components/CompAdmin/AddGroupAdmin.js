"use client"
import { useEffect, useState } from "react"
import AddGroupForm from "../FormsAdmin/AddGroupForm"
import { deleteGroup, getAllGroupOneCategory } from "@/http/adminAPI"
import { Button, message, Modal, Popconfirm } from "antd"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UpdateGroupForm from "../FormsAdmin/UpdateGroupForm"

const AddGroupAdmin = () => {
	const [groups, setGroups] = useState([])
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [isRender, setIsRender] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingGroup, setEditingGroup] = useState(null);

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await getAllGroupOneCategory(selectedCategory);
				if (response) {
					setGroups(response.groupsOneCategory);
				} else {
					message.error('Не удалось загрузить группы');
				}
			} catch (error) {
				console.error('Ошибка при получении групп:', error);
				message.error('Ошибка при получении групп');
			}
		};
		if (selectedCategory) {
			fetchGroups();
		}

	}, [selectedCategory, isRender]);

	const showModal = (group) => {
		setEditingGroup(group);
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setEditingGroup(null);
	};

	const confirm = (id) => {
		deleteGroup(id)
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
		<div className="pt-10 px-12 text-white pb-28">
			<p className='text-3xl mb-16'>
				Добавить группу
			</p>
			<AddGroupForm selectedCategory={selectedCategory} setIsRender={setIsRender} setSelectedCategory={setSelectedCategory} />

			<div className='mt-20 pl-11'>
				{
					groups.length ? <p className='text-sm'>
						Группы данной категории:
					</p>
						:
						null
				}
				<ul className='mt-6 max-w-xs' >
					{
						groups.length ? groups.map((el, idx) => {
							return (
								<li className='text-gray-400 border-b border-gray-700 pb-2 flex items-center justify-between text-sm mb-4 cursor-pointer hover:text-white' key={el.id}>
									<span className="">{idx + 1}. {el.title}</span>
									<div className='flex space-x-3'>
										<Button size="small"
											shape=""
											className="bg-transparent text-white"
											icon={<EditOutlined />}
											onClick={() => showModal(el)}
										/>
										<Popconfirm
											title="Удалить группу"
											description="Удаление группы приведёт к удалению всех товаров, связанных с ней. Вы уверены, что хотите удалить группу?"
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
				title="Редактировать группу"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
			>
				<UpdateGroupForm editingGroup={editingGroup} handleCancel={handleCancel} setIsRender={setIsRender} />
			</Modal>

		</div>
	)
}

export default AddGroupAdmin