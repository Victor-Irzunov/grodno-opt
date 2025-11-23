// /components/CompAdmin/TekushchieZakazyAdmin.jsx
import { getAllPendingOrders } from "@/http/adminAPI";
import { useEffect, useState, useRef } from "react";
import { message, Button, Empty, Popconfirm } from "antd";
import ShippingPanel from "./ShippingPanel";
import OrderPrint from "./OrderPrint";

const TekushchieZakazyAdmin = () => {
  const [data, setData] = useState([]);
  const [activeComponent, setActiveComponent] = useState(null); // id заказа, который редактируем (ShippingPanel)
  const [openOrderId, setOpenOrderId] = useState(null); // id заказа, который развернут

  // рефы для блоков с ShippingPanel, чтобы скроллить к ним
  const orderPanelsRef = useRef({});

  const [messageApi, contextHolder] = message.useMessage();

  const fetchOrders = async () => {
    try {
      const response = await getAllPendingOrders();
      if (response) {
        setData(response);
      } else {
        messageApi.error("Не удалось получить заказы");
      }
    } catch (error) {
      console.error("Ошибка при получении всех заказов:", error);
      messageApi.error("Ошибка при получении всех заказов");
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
        messageApi.success(result.message || "Заказ удалён");
        fetchOrders();
      } else {
        messageApi.error(result.message || "Ошибка при удалении заказа");
      }
    } catch (err) {
      console.error("Ошибка удаления заказа:", err);
      messageApi.error("Ошибка при удалении заказа");
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
        messageApi.success("Заказ успешно закрыт");
        fetchOrders();
      } else {
        messageApi.error(result.message || "Ошибка при закрытии");
      }
    } catch (err) {
      console.error("Ошибка закрытия заказа:", err);
      messageApi.error("Ошибка при закрытии заказа");
    }
  };

  const groupedByUser = data.reduce((acc, order) => {
    const userId = order.buyer?.user?.id;
    if (!userId) return acc;
    if (!acc[userId])
      acc[userId] = { user: order.buyer.user, buyer: order.buyer, orders: [] };
    acc[userId].orders.push(order);
    return acc;
  }, {});

  const toggleOrder = (orderId) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const scrollToOrderPanel = (orderId) => {
    const el = orderPanelsRef.current[orderId];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {contextHolder}

      <div className="pt-10 px-12 text-white pb-28">
        <p className="text-3xl mb-16 text-primary">Текущие заказы</p>

        {Object.keys(groupedByUser).length === 0 ? (
          <Empty className="invert" description="Нет текущих заказов" />
        ) : (
          Object.values(groupedByUser).map((group, groupIndex) => {
            const totalSum = group.orders.reduce((sum, order) => {
              const itemsTotal = order.orderItems.reduce(
                (orderSum, item) =>
                  orderSum + item.quantity * parseFloat(item.price),
                0
              );
              const delivery = parseFloat(order.deliveryCost || 0);
              return sum + itemsTotal + delivery;
            }, 0);

            return (
              <div key={groupIndex} className="mb-12">
                <h3 className="text-2xl mb-2">
                  {group.user?.userData?.fullName || "Неизвестный покупатель"} —{" "}
                  {group.user?.userData?.phone || "-"}
                </h3>

                {group.orders.map((order) => {
                  const itemsTotal = order.orderItems.reduce(
                    (orderSum, item) =>
                      orderSum + item.quantity * parseFloat(item.price),
                    0
                  );
                  const delivery = parseFloat(order.deliveryCost || 0);
                  const totalWithDelivery = itemsTotal + delivery;
                  const isOpen = openOrderId === order.id;
                  const isClosed = order.status === "Завершён";

                  const shippingMethod = order.shippingInfo
                    ? order.shippingInfo.courier
                    : "Самовывоз";

                  return (
                    <div
                      key={order.id}
                      className="mb-6 border rounded border-gray-600 overflow-hidden"
                    >
                      {/* ШАПКА ЗАКАЗА (свернутый вид) */}
                      <button
                        type="button"
                        onClick={() => toggleOrder(order.id)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-[#141414] hover:bg-[#181818] transition-colors"
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-sm">
                            Заказ №{" "}
                            <span className="font-semibold">{order.id}</span>
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            Статус:{" "}
                            <span className="font-semibold">
                              {order.status}
                            </span>{" "}
                            · Доставка:{" "}
                            <span className="font-semibold">
                              {order.deliveryStatus}
                            </span>{" "}
                            · Способ:{" "}
                            <span className="font-semibold">
                              {shippingMethod}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-col items-end text-xs">
                          <span className="text-gray-300">
                            Товары: {itemsTotal.toFixed(2)} $
                          </span>
                          <span className="text-gray-300">
                            Доставка: {delivery.toFixed(2)} $
                          </span>
                          <span className="text-sm font-semibold text-primary mt-1">
                            Итого: {totalWithDelivery.toFixed(2)} $
                          </span>
                          <span
                            className={`text-gray-400 text-lg transform transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            ▾
                          </span>
                        </div>
                      </button>

                      {/* ДЕТАЛИ ЗАКАЗА */}
                      {isOpen && (
                        <div className="p-4 border-t border-gray-700">
                          <table className="w-full text-left border border-white text-xs mb-4">
                            <thead className="bg-gray-800">
                              <tr className="bg-gray-800 text-xs">
                                <th className="border border-white px-4 py-2">
                                  id
                                </th>
                                <th className="border border-white px-4 py-2">
                                  Товар
                                </th>
                                <th className="border border-white px-4 py-2">
                                  Артикул
                                </th>
                                <th className="border border-white px-4 py-2">
                                  Остаток на складе
                                </th>
                                <th className="border border-white px-4 py-2">
                                  Количество
                                </th>
                                <th className="border border-white px-4 py-2">
                                  Цена за единицу
                                </th>
                                <th className="border border-white px-4 py-2">
                                  Итого
                                </th>
                                <th className="border border-white px-4 py-2">
                                  Доставка
                                </th>
                                <th className="border border-white px-4 py-2">
                                  Комментарий
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.orderItems.map((item) => (
                                <tr
                                  key={item.id}
                                  className="border border-white text-xs"
                                >
                                  <td className="border border-white px-4 py-2">
                                    {item.product?.id}
                                  </td>
                                  <td className="border border-white px-4 py-2">
                                    {item.product?.title}
                                  </td>
                                  <td className="border border-white px-4 py-2">
                                    {item.product?.article}
                                  </td>
                                  <td className="border border-white px-4 py-2">
                                    {item.product?.count ?? 0}
                                  </td>
                                  <td className="border border-white px-4 py-2">
                                    {item.quantity}
                                  </td>
                                  <td className="border border-white px-4 py-2">
                                    {item.price} $
                                  </td>
                                  <td className="border border-white px-4 py-2">
                                    {(
                                      item.quantity * parseFloat(item.price)
                                    ).toFixed(2)}{" "}
                                    $
                                  </td>
                                  <td className="border border-white px-4 py-2">
                                    {order.shippingInfo ? (
                                      <div>
                                        <p className="text-primary">
                                          {order.shippingInfo.courier}
                                        </p>
                                        <p>
                                          Адрес: {order.shippingInfo.address}
                                        </p>
                                        <p className="mt-2">
                                          Трек:{" "}
                                          {order.shippingInfo.trackingNumber ||
                                            "—"}
                                        </p>
                                      </div>
                                    ) : (
                                      <p>Самовывоз</p>
                                    )}
                                  </td>
                                  <td className="border border-white px-4 py-2">
                                    {order.message || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div className="text-xs mb-4">
                            <p>
                              Сумма товаров:{" "}
                              <span className="font-semibold">
                                {itemsTotal.toFixed(2)} $
                              </span>
                            </p>
                            <p>
                              Стоимость доставки:{" "}
                              <span className="font-semibold">
                                {delivery.toFixed(2)} $
                              </span>
                            </p>
                            <p className="mt-1">
                              Итого по заказу:{" "}
                              <span className="font-semibold">
                                {totalWithDelivery.toFixed(2)} $
                              </span>
                            </p>
                          </div>

                          {/* КНОПКИ ПОД ТАБЛИЦЕЙ (кроме "Закрыть заказ") */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            {!isClosed && (
                              <Button
                                type="primary"
                                onClick={() => {
                                  setOpenOrderId(order.id);
                                  setActiveComponent(order.id);
                                  setTimeout(
                                    () => scrollToOrderPanel(order.id),
                                    50
                                  );
                                }}
                              >
                                Оформить заказ
                              </Button>
                            )}

                            {!isClosed && (
                              <Popconfirm
                                title="Удалить заказ?"
                                onConfirm={() => handleDelete(order.id)}
                                okText="Да"
                                cancelText="Нет"
                              >
                                <Button danger>Удалить заказ</Button>
                              </Popconfirm>
                            )}

                            {order.shippingInfo && (
                              <OrderPrint order={order} user={group.user} />
                            )}
                          </div>

                          {/* КНОПКА "ЗАКРЫТЬ ЗАКАЗ" — НИЖЕ ПОД ТАБЛИЦЕЙ */}
                          {!isClosed && (
                            <div className="mt-2 mb-4 flex justify-end">
                              <Button
                                danger
                                onClick={() => handleCloseOrder(order.id)}
                              >
                                Закрыть заказ
                              </Button>
                            </div>
                          )}

                          {/* ПАНЕЛЬ ОФОРМЛЕНИЯ / ИЗМЕНЕНИЯ ДОСТАВКИ */}
                          {activeComponent === order.id && (
                            <div
                              className="mt-4"
                              ref={(el) => {
                                if (el) {
                                  orderPanelsRef.current[order.id] = el;
                                }
                              }}
                            >
                              <ShippingPanel
                                orderId={order.id}
                                address={
                                  order.shippingInfo?.address ||
                                  group.user?.userData?.address ||
                                  ""
                                }
                                orderItems={order.orderItems}
                                onSuccess={() => {
                                  messageApi.success("Заказ обновлён");
                                  setActiveComponent(null);
                                  fetchOrders();
                                }}
                                onCancel={() => setActiveComponent(null)}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <p className="mt-4 text-right text-lg font-semibold">
                  Итого по клиенту: {totalSum.toFixed(2)} $
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default TekushchieZakazyAdmin;
