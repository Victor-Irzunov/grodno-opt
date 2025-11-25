// /components/CompAdmin/OrdersOneClient.jsx — ПОЛНОСТЬЮ
"use client";

import { useEffect, useState } from "react";
import { Input, Button, message, Tag, Tooltip, Space } from "antd";
import { getOrdersOneClient } from "@/http/userAPI";

const OrdersOneClient = () => {
  const [search, setSearch] = useState(""); // строка поиска клиента
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState([]); // найденные клиенты (wholesaleBuyer)
  const [selectedBuyer, setSelectedBuyer] = useState(null); // выбранный клиент

  const [userData, setUserData] = useState(null); // полные данные (для заказов)
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [sortOrder, setSortOrder] = useState("new"); // "new" | "old"

  // message через хук
  const [messageApi, contextHolder] = message.useMessage();

  // перевод статусов
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

      case "Завершён":
      case "В ожидании":
      case "В обработке":
      case "Отправлен":
        return status;

      default:
        return status || "";
    }
  };

  const getBgColor = (deliveryStatus, status) => {
    const ds = getStatusTranslate(deliveryStatus);
    const st = getStatusTranslate(status);

    if (ds === "Отправлен" && st === "В ожидании") {
      return "bg-red-800/30 border-red-400";
    }

    switch (ds) {
      case "Завершён":
      case "Отправлен":
        return "bg-green-800/30 border-green-400";
      case "В обработке":
        return "bg-orange-800/30 border-orange-400";
      case "В ожидании":
      default:
        return "bg-gray-800/30 border-gray-400";
    }
  };

  // Поиск клиентов по ID / имени / фамилии / телефону / адресу (через /api/admin/search-buyers)
  useEffect(() => {
    const q = search.trim();
    if (!q) {
      setResults([]);
      setSelectedBuyer(null);
      setUserData(null);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(
          `/api/admin/search-buyers?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        const data = await res.json();

        if (res.ok && data.ok) {
          setResults(data.buyers || []);
        } else {
          setResults([]);
          if (data?.message) {
            messageApi.error(data.message);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Ошибка поиска клиентов:", err);
          messageApi.error("Ошибка при поиске клиентов");
        }
      } finally {
        setSearchLoading(false);
      }
    }, 500); // debounce 500 мс

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, messageApi]);

  // загрузка заказов выбранного клиента
  const loadOrdersForBuyer = async (buyer) => {
    if (!buyer?.userId) {
      messageApi.error("Не найден User ID клиента");
      return;
    }

    try {
      setLoadingOrders(true);
      const data = await getOrdersOneClient(buyer.userId);
      setUserData(data);
    } catch (err) {
      console.error("Ошибка получения заказов клиента:", err);
      messageApi.error("Ошибка при получении данных заказов");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSelectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setUserData(null);
    loadOrdersForBuyer(buyer);
  };

  // подготовка отсортированного списка заказов
  const getSortedOrders = () => {
    const orders = userData?.wholesaleBuyer?.orders || [];
    const copy = [...orders];

    copy.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      if (sortOrder === "new") {
        // новые сверху
        return bTime - aTime;
      }
      // старые сверху
      return aTime - bTime;
    });

    return copy;
  };

  return (
    <>
      {contextHolder}

      <div className="pt-10 px-12 text-white pb-28">
        <p className="text-3xl mb-8 text-primary">Все заказы клиента</p>

        {/* Поиск клиента */}
        <div className="max-w-xl mb-6">
          <Input
            className="white-placeholder"
            style={{ backgroundColor: "#191919", color: "white" }}
            placeholder="Поиск по ID, имени, фамилии, телефону или адресу"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            Введите любые символы: ID, фамилию, имя, телефон, email или адрес.
          </p>
        </div>

        {/* Результаты поиска по клиентам */}
        {search && (
          <div className="mb-8">
            <div className="text-xs text-gray-300 mb-2">
              {searchLoading
                ? "Поиск клиентов..."
                : results.length === 0
                ? "Клиенты не найдены"
                : `Найдено клиентов: ${results.length}`}
            </div>

            {results.length > 0 && (
              <div className="border border-gray-700 rounded-md max-h-80 overflow-y-auto">
                {results.map((buyer) => {
                  const user = buyer.user || {};
                  const userDataRow = user.userData || {};
                  const isActive =
                    selectedBuyer && selectedBuyer.id === buyer.id;

                  return (
                    <button
                      key={buyer.id}
                      type="button"
                      onClick={() => handleSelectBuyer(buyer)}
                      className={`w-full text-left px-3 py-2 border-b border-gray-800 hover:bg-[#222] transition-colors ${
                        isActive
                          ? "bg-[#317bff1a] border-l-4 border-primary"
                          : ""
                      }`}
                    >
                      <div className="text-sm font-semibold text-white">
                        {userDataRow.fullName || "Без имени"}{" "}
                        <span className="text-xs text-gray-400">
                          (User ID: {user.id}, Buyer ID: {buyer.id})
                        </span>
                      </div>
                      <div className="text-xs text-gray-300">
                        Email: {user.email}
                      </div>
                      <div className="text-xs text-gray-300">
                        Телефон: {userDataRow.phone || "—"}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        Адрес: {userDataRow.address || "—"}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        Баланс:{" "}
                        <span className="text-green-400">
                          {Number(buyer.balance).toFixed(2)} $
                        </span>{" "}
                        / Долг:{" "}
                        <span className="text-red-400">
                          {Number(buyer.debt).toFixed(2)} $
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Блок с заказами выбранного клиента */}
        {selectedBuyer && (
          <div className="mt-8">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
              <h2 className="text-xl">
                Клиент:{" "}
                {userData?.userData?.fullName ||
                  selectedBuyer.user?.userData?.fullName ||
                  "Неизвестно"}{" "}
                —{" "}
                {userData?.userData?.phone ||
                  selectedBuyer.user?.userData?.phone ||
                  "-"}
              </h2>

              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-300 flex items-center gap-1">
                  <span>Сортировка:</span>
                  <Space.Compact size="small">
                    <Button
                      type={sortOrder === "new" ? "primary" : "default"}
                      onClick={() => setSortOrder("new")}
                    >
                      Новые
                    </Button>
                    <Button
                      type={sortOrder === "old" ? "primary" : "default"}
                      onClick={() => setSortOrder("old")}
                    >
                      Старые
                    </Button>
                  </Space.Compact>
                </div>

                <Button
                  type="default"
                  size="small"
                  loading={loadingOrders}
                  onClick={() => loadOrdersForBuyer(selectedBuyer)}
                >
                  Обновить заказы
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              User ID:{" "}
              <span className="font-semibold">{selectedBuyer.userId}</span> /
              Buyer ID:{" "}
              <span className="font-semibold">{selectedBuyer.id}</span>
            </p>

            {loadingOrders && <p>Загрузка заказов клиента...</p>}

            {!loadingOrders && userData && (
              <>
                {userData.wholesaleBuyer?.orders.length === 0 ? (
                  <p>Заказов нет</p>
                ) : (
                  getSortedOrders().map((order) => {
                    const itemsTotal = order.orderItems.reduce(
                      (sum, item) =>
                        sum +
                        item.quantity * parseFloat(item.price ?? 0),
                      0
                    );

                    const deliveryCost = order.deliveryCost
                      ? parseFloat(order.deliveryCost)
                      : 0;

                    const grandTotal = itemsTotal + deliveryCost;

                    const courierRaw =
                      order.shippingInfo?.courier || "Самовывоз";
                    const isPickup = courierRaw === "Самовывоз";

                    const shippingMethodLabel = isPickup
                      ? "Самовывоз Космонавтов 9, каб 3"
                      : courierRaw;

                    const shippingAddress =
                      order.shippingInfo?.address || "";

                    return (
                      <div
                        key={order.id}
                        className={`mb-6 p-4 rounded border ${getBgColor(
                          order.deliveryStatus,
                          order.status
                        )}`}
                      >
                        <p className="mb-2 text-sm text-gray-300">
                          Номер заказа:{" "}
                          <span className="text-white font-semibold">
                            {order.id}
                          </span>
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Tooltip
                            title={
                              getStatusTranslate(order.deliveryStatus) ===
                                "Отправлен" &&
                              getStatusTranslate(order.status) ===
                                "В ожидании"
                                ? "Ожидает проверки администратора"
                                : ""
                            }
                          >
                            <Tag color="green">
                              Статус доставки:{" "}
                              {getStatusTranslate(order.deliveryStatus)}
                            </Tag>
                          </Tooltip>

                          <Tag color="blue">
                            Статус заказа:{" "}
                            {getStatusTranslate(order.status)}
                          </Tag>
                        </div>

                        {/* Способ доставки и стоимость доставки */}
                        <div className="mb-3 text-xs text-gray-300 space-y-1">
                          <p>
                            Способ доставки:{" "}
                            <span className="text-white font-semibold">
                              {shippingMethodLabel}
                            </span>
                          </p>
                          {!isPickup && (
                            <>
                              <p>
                                Адрес доставки:{" "}
                                <span className="text-white font-semibold">
                                  {shippingAddress || "—"}
                                </span>
                              </p>
                              <p>
                                Стоимость доставки:{" "}
                                <span className="text-white font-semibold">
                                  {deliveryCost.toFixed(2)} $
                                </span>
                              </p>
                            </>
                          )}
                          {isPickup && (
                            <p>
                              Стоимость доставки:{" "}
                              <span className="text-white font-semibold">
                                0.00 $
                              </span>
                            </p>
                          )}
                        </div>

                        <table className="table-auto w-full text-xs text-left border border-white">
                          <thead>
                            <tr className="bg-gray-800">
                              <th className="border border-white px-2 py-1">
                                Товар
                              </th>
                              <th className="border border-white px-2 py-1">
                                Кол-во
                              </th>
                              <th className="border border-white px-2 py-1">
                                Цена
                              </th>
                              <th className="border border-white px-2 py-1">
                                Итого
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.orderItems.map((item) => (
                              <tr key={item.id}>
                                <td className="border border-white px-2 py-1">
                                  {item.product?.title}
                                </td>
                                <td className="border border-white px-2 py-1">
                                  {item.quantity}
                                </td>
                                <td className="border border-white px-2 py-1">
                                  {item.price} $
                                </td>
                                <td className="border border-white px-2 py-1">
                                  {(
                                    item.quantity *
                                    parseFloat(item.price ?? 0)
                                  ).toFixed(2)}{" "}
                                  $
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Итого: товары, доставка и полная стоимость */}
                        <div className="mt-2 text-right text-sm space-y-1">
                          <p>
                            Итого за товары:{" "}
                            <span className="font-semibold">
                              {itemsTotal.toFixed(2)} $
                            </span>
                          </p>
                          <p>
                            Стоимость доставки:{" "}
                            <span className="font-semibold">
                              {deliveryCost.toFixed(2)} $
                            </span>
                          </p>
                          <p>
                            Полная стоимость (товары + доставка):{" "}
                            <span className="font-semibold">
                              {grandTotal.toFixed(2)} $
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersOneClient;
