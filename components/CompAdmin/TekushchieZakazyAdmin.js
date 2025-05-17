import { getAllPendingOrders } from "@/http/adminAPI";
import { useEffect, useState } from "react";
import { message, Button, Empty, Popconfirm } from "antd";
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
				message.error("Не удалось получить заказы");
			}
		} catch (error) {
			console.error("Ошибка при получении всех заказов:", error);
			message.error("Ошибка при получении всех заказов");
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleDelete = async (orderId) => {
		try {
			const res = await fetch(`/api/order?orderId=${orderId}`, {
				method: "DELETE",
			});
			const result = await res.json();
			if (res.ok) {
				message.success(result.message || "Заказ удалён");
				fetchOrders();
			} else {
				message.error(result.message || "Ошибка при удалении заказа");
			}
		} catch (err) {
			console.error("Ошибка удаления заказа:", err);
			message.error("Ошибка при удалении заказа");
		}
	};

	const handleCloseOrder = async (orderId) => {
		try {
			const response = await fetch("/api/order/shipping", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId }),
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
	};

	const groupedByUser = data.reduce((acc, order) => {
		const userId = order.buyer?.user?.id;
		if (!userId) return acc;
		if (!acc[userId]) acc[userId] = { user: order.buyer.user, buyer: order.buyer, orders: [] };
		acc[userId].orders.push(order);
		return acc;
	}, {});

	return (
		<div className="pt-10 px-12 text-white pb-28">
			<p className="text-3xl mb-16 text-primary">Текущие заказы</p>

			{Object.keys(groupedByUser).length === 0 ? (
				<Empty className="invert" description="Нет текущих заказов" />
			) : (
				Object.values(groupedByUser).map((group, groupIndex) => {
					const totalSum = group.orders.reduce((sum, order) => {
						return sum + order.orderItems.reduce((orderSum, item) => {
							return orderSum + item.quantity * parseFloat(item.price);
						}, 0);
					}, 0);

					return (
						<div key={groupIndex} className="mb-12">
							<h3 className="text-2xl mb-2">
								{group.user?.userData?.fullName || "Неизвестный покупатель"} — {group.user?.userData?.phone || "-"}
							</h3>

							{group.orders.map((order) => (
								<div key={order.id} className="mb-6 p-4 border rounded border-gray-600">
									<p className="text-sm mb-2">
										Номер заказа: <strong>{order.id}</strong>
									</p>

									<table className="w-full text-left border border-white text-xs mb-4">
										<thead className="bg-gray-800">
											<tr className="bg-gray-800 text-xs">
												<th className="border border-white px-4 py-2">id</th>
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
											{order.orderItems.map((item) => (
												<tr key={item.id} className="border border-white text-xs">
													<td className="border border-white px-4 py-2">{item.product?.id}</td>
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

									{order.deliveryStatus === "processing" ? (
										<div className="flex gap-3">
											<Button type="primary" onClick={() => setActiveComponent(order.id)}>
												Оформить заказ
											</Button>
											<Popconfirm
												title="Удалить заказ?"
												onConfirm={() => handleDelete(order.id)}
												okText="Да"
												cancelText="Нет"
											>
												<Button danger>Удалить заказ</Button>
											</Popconfirm>
										</div>
									) : (
										<div className="flex flex-col items-start gap-3">
											<div className="flex gap-3 items-center">
												<OrderPrint order={order} user={group.user} />
												{/* Здесь можно добавить кнопку для Telegram */}
											</div>
											<Button danger onClick={() => handleCloseOrder(order.id)}>
												Закрыть заказ
											</Button>
										</div>
									)}

									{activeComponent === order.id && (
										<div className="mt-4">
											<ShippingPanel
												orderId={order.id}
												address={order.shippingInfo?.address || group.user?.userData?.address || ""}
												orderItems={order.orderItems}
												onSuccess={() => {
													message.success("Заказ обновлён");
													setActiveComponent(null);
													fetchOrders();
												}}
												onCancel={() => setActiveComponent(null)}
											/>
										</div>
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
