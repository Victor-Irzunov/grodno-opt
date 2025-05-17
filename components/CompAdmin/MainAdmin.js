import { MyContext } from '@/contexts/MyContextProvider'
import { Button } from 'antd'
import { useContext, useMemo, useState } from 'react'

const MainAdmin = () => {
	const { products } = useContext(MyContext)
	const [selectedCategory, setSelectedCategory] = useState('')
	const [selectedGroup, setSelectedGroup] = useState('')

	// Группировка: категория → группа → продукты
	const grouped = useMemo(() => {
		return products.reduce((acc, product) => {
			const categoryTitle = product.category?.title || 'Без категории'
			const groupTitle = product.group?.title || 'Без группы'

			if (!acc[categoryTitle]) acc[categoryTitle] = {}
			if (!acc[categoryTitle][groupTitle]) acc[categoryTitle][groupTitle] = []

			acc[categoryTitle][groupTitle].push(product)

			return acc
		}, {})
	}, [products])

	const categories = Object.keys(grouped)
	const groups = selectedCategory ? Object.keys(grouped[selectedCategory] || {}) : []

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

			{/* Вывод таблиц */}
			{(selectedCategory ? [selectedCategory] : categories).map((category) => (
				<div key={category} className="mb-10">
					<h2 className="text-2xl mb-4 text-primary font-bold underline">{category}</h2>

					{(selectedGroup
						? [selectedGroup]
						: Object.keys(grouped[category])
					).map((group) => {
						const items = grouped[category][group]

						return (
							<div key={group} className="mb-6">
								<h3 className="text-xl font-semibold mb-2 text-green-400">{group}</h3>

								<div className="overflow-auto">
									<table className="w-full text-left border border-gray-600 text-xs">
										<thead className="bg-gray-700 text-white">
											<tr>
												<th className="p-2 border border-gray-600">#</th>
												<th className="p-2 border border-gray-600">Название</th>
												<th className="p-2 border border-gray-600">Артикул</th>
												<th className="p-2 border border-gray-600">Количество</th>
												<th className="p-2 border border-gray-600">Цена</th>
												<th className="p-2 border border-gray-600">Статус</th>
											</tr>
										</thead>
										<tbody>
											{items.map((product, index) => (
												<tr key={product.id} className="hover:bg-gray-800">
													<td className="p-2 border border-gray-700">{index + 1}</td>
													<td className="p-2 border border-gray-700">{product.title}</td>
													<td className="p-2 border border-gray-700">{product.article}</td>
													<td className="p-2 border border-gray-700">{product.count}</td>
													<td className="p-2 border border-gray-700">
														{parseFloat(product.price).toFixed(2)} $
													</td>
													<td className="p-2 border border-gray-700">{product.status}</td>
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
		</div>
	)
}

export default MainAdmin
