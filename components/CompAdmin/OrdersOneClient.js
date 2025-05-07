"use client";

import { useState } from "react";
import { Input, Button, message, Tag, Tooltip } from "antd";
import { getOrdersOneClient } from "@/http/userAPI";

const OrdersOneClient = () => {
	const [userId, setUserId] = useState("");
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchData = async () => {
		if (!userId) {
			message.error("Введите ID клиента");
			return;
		}

		setLoading(true);
		try {
			const data = await getOrdersOneClient(userId);
			console.log("🚀 _ fetchData _ data:", data);
			setUserData(data);
		} catch (err) {
			console.error(err);
			message.error("Ошибка при получении данных");
		} finally {
			setLoading(false);
		}
	};

	const getStatusTranslate = (status) => {
		switch (status) {
			case "completed":
				return "Завершён";
			case "pending":
				return "В ожидании";
			case "processing":
				return "В обработке";
			case "shipped":
				return "Отправлен";
			default:
				return status;
		}
	};

	const getBgColor = (deliveryStatus, status) => {
		if (deliveryStatus === "shipped" && status === "pending") {
			return "bg-red-800/30 border-red-400"; // особая подсветка
		}

		switch (deliveryStatus) {
			case "completed":
			case "shipped":
				return "bg-green-800/30 border-green-400";
			case "processing":
				return "bg-orange-800/30 border-orange-400";
			case "pending":
			default:
				return "bg-gray-800/30 border-gray-400";
		}
	};

	return (
		<div className="pt-10 px-12 text-white pb-28">
			<p className="text-3xl mb-8 text-primary">Все заказы клиента</p>

			<div className="flex gap-4 mb-8">
				<Input
					className="max-w-xs placeholder-white/45"
					style={{ backgroundColor: '#191919', color: 'white' }}
					placeholder="Введите ID клиента"
					value={userId}
					onChange={(e) => setUserId(e.target.value)}
				/>
				<Button loading={loading} type="primary" onClick={fetchData}>
					Получить заказы
				</Button>
			</div>

			{userData && (
				<div>
					<h2 className="text-xl mb-6">
						Клиент: {userData.userData?.fullName || "Неизвестно"} — {userData.userData?.phone || "-"}
					</h2>

					{userData.wholesaleBuyer?.orders.length === 0 ? (
						<p>Заказов нет</p>
					) : userData.wholesaleBuyer.orders.map((order) => (
						<div
							key={order.id}
							className={`mb-6 p-4 rounded border ${getBgColor(order.deliveryStatus, order.status)}`}
						>
							<p className="mb-2 text-sm text-gray-300">
								Номер заказа: <span className="text-white font-semibold">{order.id}</span>
							</p>

							<div className="flex gap-2 mb-4">
								<Tooltip
									title={order.deliveryStatus === "completed" && order.status === "pending" 
										? "Ожидает проверки администратора" 
										: ""}
								>
									<Tag color="green">Статус доставки: {getStatusTranslate(order.deliveryStatus)}</Tag>
								</Tooltip>

								<Tag color="blue">Статус заказа: {getStatusTranslate(order.status)}</Tag>
							</div>

							<table className="table-auto w-full text-xs text-left border border-white">
								<thead>
									<tr className="bg-gray-800">
										<th className="border border-white px-2 py-1">Товар</th>
										<th className="border border-white px-2 py-1">Кол-во</th>
										<th className="border border-white px-2 py-1">Цена</th>
										<th className="border border-white px-2 py-1">Итого</th>
									</tr>
								</thead>
								<tbody>
									{order.orderItems.map(item => (
										<tr key={item.id}>
											<td className="border border-white px-2 py-1">{item.product?.title}</td>
											<td className="border border-white px-2 py-1">{item.quantity}</td>
											<td className="border border-white px-2 py-1">{item.price} $</td>
											<td className="border border-white px-2 py-1">{(item.quantity * parseFloat(item.price)).toFixed(2)} $</td>
										</tr>
									))}
								</tbody>
							</table>

							<p className="mt-2 text-right text-sm font-semibold">
								Итого по заказу: {parseFloat(order.totalAmount).toFixed(2)} $
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default OrdersOneClient;
