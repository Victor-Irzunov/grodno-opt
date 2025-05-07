import { getAllPendingOrders } from "@/http/adminAPI";
import { useEffect, useState } from "react";
import { message, Button, Empty } from "antd";
import ShippingPanel from "./ShippingPanel";
import OrderPrint from "./OrderPrint";

const TekushchieZakazyAdmin = () => {
	const [data, setData] = useState([]);
	const [activeComponent, setActiveComponent] = useState(null);

	const fetchOrders = async () => {
		try {
			const response = await getAllPendingOrders();
			if (response) {
				setData(response);
			} else {
				message.error('Не удалось получить заказы');
			}
		} catch (error) {
			console.error('Ошибка при получении всех заказов:', error);
			message.error('Ошибка при получении всех заказов');
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const groupedByUser = data.reduce((acc, order) => {
		const userId = order.buyer?.user?.id;
		if (!userId) return acc;
		if (!acc[userId]) acc[userId] = { user: order.buyer.user, buyer: order.buyer, orders: [] };
		acc[userId].orders.push(order);
		return acc;
	}, {});

	return (
		<div className="pt-10 px-12 text-white pb-28">
			<p className='text-3xl mb-16 text-primary'>Текущие заказы</p>

			{Object.keys(groupedByUser).length === 0 ? (
				<Empty className="invert" description="Нет текущих заказов" />
			) : (
				Object.values(groupedByUser).map((group, groupIndex) => {
					const totalSum = group.orders.reduce((sum, order) => {
						return sum + order.orderItems.reduce((orderSum, item) => {
							return orderSum + (item.quantity * parseFloat(item.price));
						}, 0);
					}, 0);

					const { balance, debt, discount, limit } = group.buyer || {};
					const debtAfterOrders = parseFloat(debt || 0);

					return (
						<div key={groupIndex} className="mb-12">
							<h2 className="text-sm text-gray-500 mb-1">id клиента: {group.user?.id || '-'}</h2>
							<h3 className="text-2xl mb-2">
								{group.user?.userData?.fullName || 'Неизвестный покупатель'} — {group.user?.userData?.phone || '-'}
							</h3>
							<p className="text-sm text-gray-300 mb-4">
								Баланс: <span className="text-white">{parseFloat(balance || 0).toFixed(2)} $</span> |
								Долг: <span className={
									parseFloat(balance || 0) === 0 && debtAfterOrders > parseFloat(limit || 0)
										? "text-red-500 font-semibold"
										: "text-white"
								}>
									{debtAfterOrders.toFixed(2)} $
								</span> |
								Лимит: <span className="text-white">{parseFloat(limit || 0).toFixed(2)} $</span> |
								Скидка: <span className="text-white">{parseFloat(discount || 0).toFixed(2)} %</span>
							</p>


							{group.orders.map((order) => (
								<div
									key={order.id}
									className={`mb-6 p-2 rounded ${order.deliveryStatus !== "processing"
										? "bg-green-800/30 border-green-400"
										: "border-white"
										} border`}
								>
									<p className="mb-2 text-sm text-gray-300">
										Номер заказа: <span className="text-white font-semibold">{order.id}</span>
									</p>

									{order.deliveryStatus !== "processing" && (
										<p className="text-green-400 font-semibold mb-2">
											✅ Заказ оформлен ({order.deliveryStatus === "shipped" ? "Отправлен" : "Завершён"})
										</p>
									)}

									<table className="table-auto w-full text-left border-collapse border border-white">
										<thead>
											<tr className="bg-gray-800 text-xs">
												<th className="border border-white px-4 py-2">Товар</th>
												<th className="border border-white px-4 py-2">Артикул</th>
												<th className="border border-white px-4 py-2">Количество</th>
												<th className="border border-white px-4 py-2">Цена за единицу</th>
												<th className="border border-white px-4 py-2">Итого</th>
												<th className="border border-white px-4 py-2">Доставка</th>
												<th className="border border-white px-4 py-2">Комментарий</th>
											</tr>
										</thead>
										<tbody>
											{order.orderItems.map(item => (
												<tr key={item.id} className="border border-white text-xs">
													<td className="border border-white px-4 py-2">{item.product?.title}</td>
													<td className="border border-white px-4 py-2">{item.product?.article}</td>
													<td className="border border-white px-4 py-2">{item.quantity}</td>
													<td className="border border-white px-4 py-2">{item.price} $</td>
													<td className="border border-white px-4 py-2">{(item.quantity * parseFloat(item.price)).toFixed(2)} $</td>
													<td className="border border-white px-4 py-2">
														{order.shippingInfo ? (
															<div>
																<p className="text-primary">{order.shippingInfo.courier}</p>
																<p>Адрес: {order.shippingInfo.address}</p>
																<p className="mt-2">Трек: {order.shippingInfo.trackingNumber || '—'}</p>
															</div>
														) : (
															<p>Самовывоз</p>
														)}
													</td>
													<td className="border border-white px-4 py-2">{order.message || '—'}</td>
												</tr>
											))}
										</tbody>
									</table>

									{order.deliveryStatus === "processing" && (
										<Button className="mt-2 mr-4" onClick={() => setActiveComponent(order.id)}>
											Оформить заказ
										</Button>
									)}

									{order.deliveryStatus !== "processing" && (
										<>
											<OrderPrint order={order} user={group.user} />
											<div className='flex justify-end pr-12 mt-8'>
												<Button
													danger
													className="ml-4"
													onClick={async () => {
														try {
															const response = await fetch("/api/order/shipping", {
																method: "PATCH",
																headers: { "Content-Type": "application/json" },
																body: JSON.stringify({ orderId: order.id }),
															});

															const result = await response.json();
															if (response.ok) {
																message.success("Заказ успешно закрыт");
																fetchOrders();
															} else {
																message.error(result.message || "Ошибка при закрытии");
															}
														} catch (err) {
															console.error("Ошибка закрытия заказа:", err);
															message.error("Ошибка при закрытии заказа");
														}
													}}
												>
													Закрыть заказ
												</Button>
											</div>
										</>
									)}

									{activeComponent === order.id && (
										<ShippingPanel
											orderId={order.id}
											address={order.shippingInfo?.address || group.user?.userData?.address || ''}
											orderItems={order.orderItems}
											onSuccess={() => {
												message.success('Заказ обновлён');
												setActiveComponent(null);
												fetchOrders();
											}}
											onCancel={() => setActiveComponent(null)}
										/>
									)}
								</div>
							))}

							<p className="mt-4 text-right text-lg font-semibold">
								Итого по клиенту: {totalSum.toFixed(2)} $
							</p>
						</div>
					);
				})
			)}
		</div>
	);
};

export default TekushchieZakazyAdmin;
