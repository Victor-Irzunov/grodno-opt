import { useState } from "react";
import { Modal, Input, InputNumber, message } from "antd";
import Link from "next/link";
import { returnUserProduct } from "@/http/userAPI";

const IstoriyaZakazov = ({ data, setActiveComponent }) => {
	const orders = data?.wholesaleBuyer?.orders || [];

	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [reason, setReason] = useState("");
	const [comment, setComment] = useState("");
	const [quantity, setQuantity] = useState(1);

	const handleOpenModal = (item) => {
		setSelectedItem(item);
		setQuantity(1);
		setReason("");
		setComment("");
		setOpenModal(true);
	};

	const handleReturnSubmit = async () => {
		if (!reason) {
			message.error("Заполните причину возврата!");
			return;
		}

		if (quantity < 1 || quantity > selectedItem.quantity) {
			message.error("Некорректное количество товара для возврата!");
			return;
		}

		try {
			const response = await returnUserProduct({
				buyerId: data?.wholesaleBuyer?.id,
				orderId: selectedItem?.orderId,
				productId: selectedItem?.product.id,
				orderItemId: selectedItem?.id, // ← это id из orderItems
				quantity,
				reason,
				comment,
			});
			


			if (response?.error) {
				message.error(response.error || "Ошибка при отправке возврата");
				return;
			}

			message.success("Запрос на возврат успешно отправлен");
			setOpenModal(false);
			setSelectedItem(null);
			setReason("");
			setComment("");
			setQuantity(1);
		} catch (error) {
			console.error("Ошибка отправки возврата:", error);
			message.error("Ошибка при отправке запроса");
		}
	};

	return (
		<div className="pt-10">
			<h3 className="sd:text-2xl xz:text-xl font-semibold mb-6">
				{orders.length > 0 ? "История заказов" : "История заказов отсутствует"}
			</h3>

			{orders.length > 0 ? (
				<div className="flex flex-col gap-4">
					{orders.map((order) => (
						<div key={order.id} className="border p-4 rounded-sm">
							<div className="flex justify-between items-center mb-2">
								<h4 className="font-semibold text-lg">Заказ №{order.id}</h4>
							</div>

							<p className="text-sm text-gray-500 mb-2">
								Дата заказа: {new Date(order.createdAt).toLocaleDateString()}
							</p>

							<p className="text-sm mb-1">
								Статус: <span className="font-semibold">{order.status}</span>
							</p>
							<p className="text-sm mb-1">
								Доставка: <span className="font-semibold">{order.deliveryStatus}</span>
							</p>
							<p className="text-sm mb-1">
								Сумма: <span className="font-semibold">{order.totalAmount} $</span>
							</p>

							{order.shippingInfo && (
								<p className="text-sm mb-1">
									Трек-номер:{" "}
									<span className="font-semibold">
										{order.shippingInfo.trackingNumber || "Нет"}
									</span>
								</p>
							)}

							<div className="mt-2">
								<p className="text-sm font-semibold mb-1">Товары:</p>
								<ul className="list-disc pl-5 text-sm">
									{order.orderItems.map((item) => {
										// Проверяем есть ли возврат по этому товару
										const isReturned = data?.wholesaleBuyer?.returns?.some(ret =>
											ret.returnItems.some(retItem => retItem.orderItemId === item.id)
										);

										return (
											<li key={item.id} className="flex justify-between items-center mb-2">
												<span>
													{item.product.title} — {item.quantity} шт.
												</span>

												{order.status === "completed" && (
													isReturned ? (
														<span className="text-gray-400 text-xs ml-4">Оформлен возврат</span>
													) : (
														<button
															onClick={() => handleOpenModal(item)}
															className="text-red-500 underline text-xs ml-4"
														>
															Возврат
														</button>
													)
												)}
											</li>
										);
									})}

								</ul>
							</div>
						</div>
					))}
				</div>
			) : (
				<>
					<div className="border sd:p-6 xz:p-4 rounded-sm mt-8">
						<p
							onClick={() => setActiveComponent("TekushchieZakazy")}
							className="font-bold text-primary text-sm cursor-pointer"
						>
							Посмотреть текущие заказы
						</p>
					</div>
					<div className="border sd:p-6 xz:p-4 rounded-sm mt-4">
						<Link
							href={`${process.env.NEXT_PUBLIC_BASE_URL}/catalog`}
							className="font-semibold text-primary text-sm"
						>
							Перейти в каталог
						</Link>
					</div>
				</>
			)}

			<Modal
				title="ОФОРМИТЬ ВОЗВРАТ"
				open={openModal}
				onCancel={() => setOpenModal(false)}
				onOk={handleReturnSubmit}
				okText="Отправить"
				cancelText="Отмена"
			>
				{selectedItem && (
					<div className="mb-4">
						<p className="font-semibold mb-2">{selectedItem.product.title}</p>
						<p className="mb-2">Цена: {selectedItem.price} $</p>

						<label className="block text-sm font-medium mb-1">Количество (шт.)</label>
						<InputNumber
							min={1}
							max={selectedItem.quantity}
							value={quantity}
							onChange={setQuantity}
							className="mb-3 w-full"
						/>

						<label className="block text-sm font-medium mb-1">Причина возврата</label>
						<Input.TextArea
							placeholder="Причина возврата"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							rows={3}
							className="mb-3"
						/>

						<label className="block text-sm font-medium mb-1">Комментарий</label>
						<Input.TextArea
							placeholder="Комментарий для администратора"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							rows={2}
						/>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default IstoriyaZakazov;
