import Link from "next/link"
import IstoriyaZakazov from "./IstoriyaZakazov"

const TekushchieZakazy = ({ data, setActiveComponent }) => {
	// фильтруем только текущие заказы
	const orders = data?.wholesaleBuyer?.orders?.filter(order => order.status !== 'completed') || []

	return (
		<div className="pt-10">
			<h3 className='sd:text-2xl xz:text-xl font-semibold mb-6'>
				{orders.length > 0 ? "Текущие заказы" : "Текущие заказы не найдены"}
			</h3>

			{orders.length > 0 ? (
				<div className="flex flex-col gap-4">
					{orders.map(order => (
						<div key={order.id} className="border p-4 rounded-sm">
							<div className="flex justify-between items-center mb-2">
								<h4 className="font-semibold text-lg">Заказ №{order.id}</h4>
								<span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
							</div>
							<p className="text-sm mb-1">Статус: <span className="font-semibold">{order.status}</span></p>
							<p className="text-sm mb-1">Доставка: <span className="font-semibold">{order.deliveryStatus}</span></p>
							<p className="text-sm mb-1">Сумма: <span className="font-semibold">{order.totalAmount} BYN</span></p>

							{order.shippingInfo && (
								<p className="text-sm mb-1">
									Трек-номер: <span className="font-semibold">{order.shippingInfo.trackingNumber || 'Нет'}</span>
								</p>
							)}

							<div className="mt-2">
								<p className="text-sm font-semibold mb-1">Товары:</p>
								<ul className="list-disc pl-5 text-sm">
									{order.orderItems.map(item => (
										<li key={item.id}>
											{item.product.title} — {item.quantity} шт.
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
			) : (
				<>
					<div className='border sd:p-6 xz:p-4 rounded-sm mt-8'>
						<p
							onClick={() => setActiveComponent('IstoriyaZakazov')}
							className='font-bold text-primary text-sm cursor-pointer'>
							Посмотреть историю заказов
						</p>
					</div>
					<div className='border sd:p-6 xz:p-4 rounded-sm mt-4'>
						<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/catalog`} className="font-semibold text-primary text-sm">
							Перейти в каталог
						</Link>
					</div>
				</>
			)}

		</div>
	)
}

export default TekushchieZakazy
