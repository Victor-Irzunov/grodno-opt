import { MyContext } from '@/contexts/MyContextProvider'
import { Button, Modal, Popconfirm, message } from 'antd'
import { useContext, useMemo, useState } from 'react'
import Image from 'next/image'
import EditProductForm from '../FormsAdmin/EditProductForm'
import { observer } from 'mobx-react-lite'

const MainAdmin = observer(() => {
	const { products, updateIsState } = useContext(MyContext)
	const [selectedCategory, setSelectedCategory] = useState('')
	const [selectedGroup, setSelectedGroup] = useState('')
	const [sortAsc, setSortAsc] = useState(false)
	const [editModalOpen, setEditModalOpen] = useState(false)
	const [currentProduct, setCurrentProduct] = useState(null)

	// фильтруем только активные (неудалённые) товары
	const activeProducts = useMemo(() => {
		return products.filter(product => product.isDeleted === false)
	}, [products])

	const grouped = useMemo(() => {
		return activeProducts.reduce((acc, product) => {
			const categoryTitle = product.category?.title || 'Без категории'
			const groupTitle = product.group?.title || 'Без группы'

			if (!acc[categoryTitle]) acc[categoryTitle] = {}
			if (!acc[categoryTitle][groupTitle]) acc[categoryTitle][groupTitle] = []

			acc[categoryTitle][groupTitle].push(product)

			return acc
		}, {})
	}, [activeProducts])

	const categories = Object.keys(grouped)
	const groups = selectedCategory ? Object.keys(grouped[selectedCategory] || {}) : []

	const handleEdit = async (values) => {
		try {
			const res = await fetch('/api/admin/product/edit', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values)
			})
			if (!res.ok) throw new Error()
			message.success('Товар обновлён')
			setEditModalOpen(false)
			updateIsState()
		} catch {
			message.error('Ошибка при обновлении')
		}
	}

	const handleDelete = async (productId) => {
		try {
			const res = await fetch('/api/admin/product/edit', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: productId })
			})

			if (!res.ok) {
				const errorText = await res.text()
				if (errorText.includes('P2014')) {
					message.error('Ты пытаешься удалить товар, который уже участвует в заказах')
				} else {
					message.error('Ошибка при удалении товара')
				}
				throw new Error(errorText)
			}

			message.success('Товар удалён')
			updateIsState()
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className="pt-10 px-12 text-white">
			<p className="text-3xl mb-10">Главная</p>

			{/* Фильтры */}
			<div className="mb-4 flex flex-wrap items-center gap-4">
				<div>
					<label className="mr-2 text-xs">Категория:</label>
					<select
						value={selectedCategory}
						onChange={(e) => {
							setSelectedCategory(e.target.value)
							setSelectedGroup('')
						}}
						className="bg-gray-900 text-white p-2 rounded"
					>
						<option value="">Все категории</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
				</div>

				{selectedCategory && (
					<div>
						<label className="mr-2 text-xs">Группа:</label>
						<select
							value={selectedGroup}
							onChange={(e) => setSelectedGroup(e.target.value)}
							className="bg-gray-900 text-white p-2 rounded"
						>
							<option value="">Все группы</option>
							{groups.map((grp) => (
								<option key={grp} value={grp}>
									{grp}
								</option>
							))}
						</select>
					</div>
				)}

				<Button
					size="small"
					style={{ backgroundColor: '#1f1f1f', color: '#fff' }}
					onClick={() => setSortAsc((prev) => !prev)}
				>
					Сортировать по количеству ({sortAsc ? '↑' : '↓'})
				</Button>

				{(selectedCategory || selectedGroup) && (
					<Button
						size="small"
						danger
						style={{ backgroundColor: '#191919' }}
						onClick={() => {
							setSelectedCategory('')
							setSelectedGroup('')
						}}
					>
						Сбросить фильтры
					</Button>
				)}
			</div>

			{/* Таблицы */}
			{(selectedCategory ? [selectedCategory] : categories).map((category) => (
				<div key={category} className="mb-10">
					<h2 className="text-2xl mb-4 text-primary font-bold underline">{category}</h2>

					{(selectedGroup
						? [selectedGroup]
						: Object.keys(grouped[category])
					).map((group) => {
						const items = grouped[category][group]
						const sortedItems = [...items].sort((a, b) =>
							sortAsc ? a.count - b.count : b.count - a.count
						)

						return (
							<div key={group} className="mb-6">
								<h3 className="text-xl font-semibold mb-2 text-green-400">{group}</h3>

								<div className="overflow-auto">
									<table className="w-full text-left border border-gray-600 text-xs">
										<thead className="bg-gray-700 text-white">
											<tr>
												<th className="p-2 border border-gray-600">#</th>
												<th className="p-2 border border-gray-600">id</th>
												<th className="p-2 border border-gray-600">Название</th>
												<th className="p-2 border border-gray-600">Артикул</th>
												<th className="p-2 border border-gray-600">Количество</th>
												<th className="p-2 border border-gray-600">Цена</th>
												<th className="p-2 border border-gray-600">Статус</th>
												<th className="p-2 border border-gray-600">Действия</th>
											</tr>
										</thead>
										<tbody>
											{sortedItems.map((product, index) => (
												<tr key={product.id} className="hover:bg-gray-800">
													<td className="p-2 border border-gray-700">{index + 1}</td>
													<td className="p-2 border border-gray-700">{product.id}</td>
													<td className="p-2 border border-gray-700">{product.title}</td>
													<td className="p-2 border border-gray-700">{product.article}</td>
													<td className="p-2 border border-gray-700">{product.count}</td>
													<td className="p-2 border border-gray-700">
														{parseFloat(product.price).toFixed(2)} $
													</td>
													<td className="p-2 border border-gray-700">{product.status}</td>
													<td className="p-2 border border-gray-700 flex items-center gap-2">
														<Image
															src='/svg/edit.svg'
															alt='edit'
															width={16}
															height={16}
															className='cursor-pointer'
															onClick={() => {
																setCurrentProduct(product)
																setEditModalOpen(true)
															}}
														/>
														<Popconfirm
															title='Вы точно хотите удалить товар?'
															onConfirm={() => handleDelete(product.id)}
															okText='Да'
															cancelText='Нет'
														>
															<Button danger size='small'>Удалить</Button>
														</Popconfirm>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)
					})}
				</div>
			))}

			<Modal
				open={editModalOpen}
				onCancel={() => setEditModalOpen(false)}
				footer={null}
				title={`Редактировать товар ID: ${currentProduct?.id}`}
			>
				{currentProduct && (
					<EditProductForm product={currentProduct} onFinish={handleEdit} />
				)}
			</Modal>
		</div>
	)
})

export default MainAdmin
