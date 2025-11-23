// /components/ComponentsMojKabinet/IstoriyaZakazov.jsx
"use client";

import { useState } from "react";
import { Modal, Input, InputNumber, message } from "antd";
import Link from "next/link";
import { returnUserProduct } from "@/http/userAPI";

const isOrderCompleted = (status) => {
  if (!status) return false;
  const s = String(status).toLowerCase().trim();
  return s === "completed" || s === "завершён" || s === "завершен";
};

const IstoriyaZakazov = ({ data, setActiveComponent }) => {
  const orders = data?.wholesaleBuyer?.orders || [];

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [openOrderId, setOpenOrderId] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setReason("");
    setComment("");
    setOpenModal(true);
  };

  const handleReturnSubmit = async () => {
    if (!reason) {
      messageApi.error("Заполните причину возврата!");
      return;
    }

    if (!selectedItem) {
      messageApi.error("Товар не выбран");
      return;
    }

    if (quantity < 1 || quantity > selectedItem.quantity) {
      messageApi.error("Некорректное количество товара для возврата!");
      return;
    }

    try {
      const response = await returnUserProduct({
        buyerId: data?.wholesaleBuyer?.id,
        orderId: selectedItem?.orderId,
        productId: selectedItem?.product.id,
        orderItemId: selectedItem?.id,
        quantity,
        reason,
        comment,
      });

      if (response?.error) {
        messageApi.error(response.error || "Ошибка при отправке возврата");
        return;
      }

      messageApi.success("Запрос на возврат успешно отправлен");
      setOpenModal(false);
      setSelectedItem(null);
      setReason("");
      setComment("");
      setQuantity(1);
    } catch (error) {
      console.error("Ошибка отправки возврата:", error);
      messageApi.error("Ошибка при отправке запроса");
    }
  };

  const findReturnForItem = (itemId) => {
    return (
      data?.wholesaleBuyer?.returns?.find((ret) =>
        ret.returnItems.some((retItem) => retItem.orderItemId === itemId)
      ) || null
    );
  };

  const toggleOrder = (orderId) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <>
      {contextHolder}

      <div className="pt-10">
        <h3 className="sd:text-2xl xz:text-xl font-semibold mb-6">
          {orders.length > 0 ? "История заказов" : "История заказов отсутствует"}
        </h3>

        {orders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const itemsTotal = Number(order.totalAmount || 0);
              const delivery = Number(order.deliveryCost || 0);
              const fullTotal = itemsTotal + delivery;

              const formattedDate = new Date(
                order.createdAt
              ).toLocaleDateString();
              const formattedFullTotal = fullTotal.toFixed(2);
              const isOpen = openOrderId === order.id;
              const deliveryMethod =
                order.shippingInfo?.courier || "Самовывоз";

              return (
                <div key={order.id} className="border rounded-sm">
                  {/* Шапка: номер + дата + сумма (с доставкой) */}
                  <button
                    type="button"
                    onClick={() => toggleOrder(order.id)}
                    className="w-full flex items-center justify-between sd:px-4 sd:py-3 xz:px-3 xz:py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold">
                        Заказ №{order.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end text-xs">
                        <span className="text-gray-500">
                          Товары: {itemsTotal.toFixed(2)} $
                        </span>
                        <span className="text-gray-500">
                          Доставка: {delivery.toFixed(2)} $
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Итого: {formattedFullTotal} $
                        </span>
                      </div>
                      <span
                        className={`text-gray-500 text-lg transform transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </div>
                  </button>

                  {/* Детали заказа */}
                  {isOpen && (
                    <div className="sd:p-4 xz:p-3 border-t">
                      <p className="text-sm text-gray-500 mb-2">
                        Дата заказа: {formattedDate}
                      </p>

                      <p className="text-sm mb-1">
                        Статус:{" "}
                        <span className="font-semibold">{order.status}</span>
                      </p>
                      <p className="text-sm mb-1">
                        Статус доставки:{" "}
                        <span className="font-semibold">
                          {order.deliveryStatus}
                        </span>
                      </p>
                      <p className="text-sm mb-1">
                        Способ доставки:{" "}
                        <span className="font-semibold">
                          {deliveryMethod}
                        </span>
                      </p>

                      <p className="text-sm mb-1">
                        Сумма товаров:{" "}
                        <span className="font-semibold">
                          {itemsTotal.toFixed(2)} $
                        </span>
                      </p>
                      <p className="text-sm mb-1">
                        Стоимость доставки:{" "}
                        <span className="font-semibold">
                          {delivery.toFixed(2)} $
                        </span>
                      </p>
                      <p className="text-sm mb-2">
                        Итого к оплате:{" "}
                        <span className="font-semibold">
                          {formattedFullTotal} $
                        </span>
                      </p>

                      {order.shippingInfo && (
                        <p className="text-sm mb-1">
                          Трек-номер:{" "}
                          <span className="font-semibold">
                            {order.shippingInfo.trackingNumber || "Нет"}
                          </span>
                        </p>
                      )}

                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-1">Товары:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {order.orderItems.map((item) => {
                            const relatedReturn = findReturnForItem(item.id);
                            const returnStatus = relatedReturn?.status || null;

                            let statusClass = "text-gray-400";
                            if (returnStatus === "В ожидании")
                              statusClass = "text-orange-500";
                            if (returnStatus === "Одобрен")
                              statusClass = "text-blue-500";
                            if (returnStatus === "Принят")
                              statusClass = "text-green-600";
                            if (returnStatus === "Отклонён")
                              statusClass = "text-red-500";

                            return (
                              <li
                                key={item.id}
                                className="flex justify-between items-center mb-2"
                              >
                                <span>
                                  {item.product.title} — {item.quantity} шт.
                                </span>

                                {isOrderCompleted(order.status) && (
                                  relatedReturn ? (
                                    <span
                                      className={`text-xs ml-4 ${statusClass}`}
                                    >
                                      Возврат: {returnStatus}
                                    </span>
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
                  )}
                </div>
              );
            })}
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
              <p className="font-semibold mb-2">
                {selectedItem.product.title}
              </p>
              <p className="mb-2">Цена: {selectedItem.price} $</p>

              <label className="block text-sm font-medium mb-1">
                Количество (шт.)
              </label>
              <InputNumber
                min={1}
                max={selectedItem.quantity}
                value={quantity}
                onChange={setQuantity}
                className="mb-3 w-full"
              />

              <label className="block text-sm font-medium mb-1">
                Причина возврата
              </label>
              <Input.TextArea
                placeholder="Причина возврата"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="mb-3"
              />

              <label className="block text-sm font-medium mb-1">
                Комментарий
              </label>
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
    </>
  );
};

export default IstoriyaZakazov;
