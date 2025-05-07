"use client"
import { useEffect, useState } from "react"
import { deleteGroup, getAllCategory, getAllGroupOneCategory } from "@/http/adminAPI"
import { message,  } from "antd"
import EditDiscountGroupForm from "../FormsAdmin/EditDiscountGroupForm"

const EditDiscountGroupAdmin = () => {
	const [groups, setGroups] = useState([])
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [isRender, setIsRender] = useState(null);
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

	const onCategorySelect = (categoryId) => {
		setSelectedCategory(categoryId); // Устанавливаем выбранную категорию
	}


	return (
		<div className="pt-10 px-12 text-white pb-28">
			<p className='text-3xl mb-16'>
				Редактировать скидки групп
			</p>
			<EditDiscountGroupForm
				selectedCategory={selectedCategory}
				setIsRender={setIsRender}
				setSelectedCategory={setSelectedCategory}
				groups={groups}
				categories={categories}
			/>
		</div>
	)
}

export default EditDiscountGroupAdmin