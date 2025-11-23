// /components/CompAdmin/ReturnsAdmin.jsx
"use client";

import { useEffect, useState } from "react";
import { getAllReturns, updateReturnStatus } from "@/http/adminAPI";
import { Button, Empty, message, Select, Tag, Tooltip } from "antd";
import ReturnPrint from "./ReturnPrint";

const { Option } = Select;

const getStatusColor = (status) => {
  switch (status) {
    case "В ожидании":
      return "orange";
    case "Одобрен":
      return "blue";
    case "Принят":
      return "green";
    case "Отклонён":
      return "red";
    default:
      return "default";
  }
};

const ReturnsAdmin = () => {
  const [list, setList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async (status = statusFilter) => {
    try {
      setLoading(true);
      const res = await getAllReturns(status);
      if (res?.ok) {
        setList(res.returns || []);
      } else {
        setList([]);
        messageApi.error(res?.message || "Не удалось получить возвраты");
      }
    } catch (err) {
      console.error("Ошибка получения возвратов:", err);
      messageApi.error("Ошибка при получении возвратов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("pending");
  }, []);

  const handleChangeFilter = (value) => {
    setStatusFilter(value);
    fetchData(value);
  };

  const handleAction = async (returnId, action) => {
    try {
      setActionLoadingId(returnId);
      const res = await updateReturnStatus({ returnId, action });
      if (res?.ok) {
        if (action === "approve") {
          messageApi.success("Возврат одобрен, ожидает передачи от клиента");
        } else if (action === "accept") {
          messageApi.success("Возврат принят, суммы пересчитаны");
        } else {
          messageApi.info("Возврат отклонён");
        }
        fetchData(statusFilter);
      } else {
        messageApi.error(res?.message || "Ошибка при обработке возврата");
      }
    } catch (err) {
      console.error("Ошибка обработки возврата:", err);
      messageApi.error("Ошибка при обработке возврата");
    } finally {
      setActionLoadingId(null);
    }
  };

  const groupedByBuyer = list.reduce((acc, ret) => {
    const buyerId = ret.buyerId;
    if (!buyerId) return acc;
    if (!acc[buyerId]) {
      acc[buyerId] = {
        buyer: ret.buyer,
        returns: [],
      };
    }
    acc[buyerId].returns.push(ret);
    return acc;
  }, {});

  const buyerGroups = Object.values(groupedByBuyer);

  return (
    <>
      {contextHolder}

      <div className="pt-10 px-12 text-white pb-28">
        <p className="text-3xl mb-8 text-primary">Возвраты клиентов</p>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm text-gray-200">Фильтр по статусу:</span>
          <Select
            value={statusFilter}
            onChange={handleChangeFilter}
            style={{ width: 260 }}
          >
            <Option value="pending">В ожидании</Option>
            <Option value="approved">Одобренные</Option>
            <Option value="accepted">Принятые</Option>
            <Option value="rejected">Отклонённые</Option>
            <Option value="all">Все</Option>
          </Select>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : buyerGroups.length === 0 ? (
          <Empty
            className="invert"
            description="Возвратов по выбранному статусу нет"
          />
        ) : (
          <div className="space-y-10">
            {buyerGroups.map((group) => {
              const buyer = group.buyer;
              const user = buyer?.user;
              const userData = user?.userData;

              const fullName =
                userData?.fullName?.trim() ||
                user?.email?.trim() ||
                "Неизвестный клиент";

              const phone = userData?.phone || "-";
              const address = userData?.address || "-";
              const email = user?.email || "-";

              const currentBalance = Number(buyer?.balance || 0).toFixed(2);
              const currentDebt = Number(buyer?.debt || 0).toFixed(2);

              const totalRefundByClient = group.returns.reduce(
                (sum, ret) => sum + Number(ret.totalRefund),
                0
              );

              return (
                <div
                  key={buyer.id}
                  className="border border-gray-700 rounded-lg p-5 bg-[#1a1a1a]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-semibold mb-1">
                        Клиент: {fullName}
                      </p>
                      <p className="text-sm mb-1">
                        Email: <span className="font-semibold">{email}</span>
                      </p>
                      <p className="text-sm mb-1">
                        Телефон:{" "}
                        <span className="font-semibold">{phone}</span>
                      </p>
                      <p className="text-sm mb-1">
                        Адрес:{" "}
                        <span className="font-semibold">{address}</span>
                      </p>
                      <p className="text-sm mb-1">
                        Покупатель ID:{" "}
                        <span className="font-semibold">{buyer?.id}</span>
                      </p>
                      <p className="text-sm mb-1">
                        Баланс:{" "}
                        <span className="font-semibold">
                          {currentBalance} $
                        </span>{" "}
                        / Долг:{" "}
                        <span className="font-semibold">{currentDebt} $</span>
                      </p>
                    </div>

                    <div className="text-right text-sm">
                      <p className="mb-1">
                        Количество возвратов:{" "}
                        <span className="font-semibold">
                          {group.returns.length}
                        </span>
                      </p>
                      <p>
                        Общая сумма по возвратам:{" "}
                        <span className="font-semibold">
                          {totalRefundByClient.toFixed(2)} $
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {group.returns.map((ret) => {
                      const createdAt = new Date(
                        ret.createdAt
                      ).toLocaleString();
                      const status = ret.status;
                      const totalRefund = Number(
                        ret.totalRefund
                      ).toFixed(2);

                      return (
                        <div
                          key={ret.id}
                          className="border border-gray-600 rounded-md p-4 bg-[#111]"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm text-gray-300 mb-1">
                                Возврат №{" "}
                                <span className="font-semibold text-white">
                                  {ret.id}
                                </span>{" "}
                                по заказу{" "}
                                <span className="font-semibold text-white">
                                  #{ret.orderId}
                                </span>
                              </p>
                              <p className="text-xs text-gray-400">
                                Дата создания: {createdAt}
                              </p>
                            </div>

                            <Tag color={getStatusColor(status)}>{status}</Tag>
                          </div>

                          <div className="mb-3 text-sm">
                            <p className="font-semibold mb-1">
                              Товары в возврате:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              {ret.returnItems.map((ri) => (
                                <li key={ri.id}>
                                  {ri.product?.title || "Товар"} —{" "}
                                  {ri.quantity} шт., сумма возврата:{" "}
                                  {Number(ri.refundAmount).toFixed(2)} $
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-3 text-sm">
                            <p className="mb-1">
                              Причина клиента:{" "}
                              <span className="font-semibold">
                                {ret.reason}
                              </span>
                            </p>
                            {ret.comment && (
                              <p className="mb-1">
                                Комментарий клиента:{" "}
                                <span className="font-semibold">
                                  {ret.comment}
                                </span>
                              </p>
                            )}
                            <p className="mt-2 font-semibold">
                              Сумма по возврату: {totalRefund} $
                            </p>
                          </div>

                          <div className="flex gap-3 mt-4">
                            {status === "В ожидании" && (
                              <>
                                <Tooltip title="Клиент ещё не передал товар. После одобрения сформируйте список для курьера.">
                                  <Button
                                    type="primary"
                                    loading={actionLoadingId === ret.id}
                                    onClick={() =>
                                      handleAction(ret.id, "approve")
                                    }
                                  >
                                    Одобрить возврат
                                  </Button>
                                </Tooltip>
                                <Button
                                  danger
                                  loading={actionLoadingId === ret.id}
                                  onClick={() =>
                                    handleAction(ret.id, "reject")
                                  }
                                >
                                  Отклонить
                                </Button>
                              </>
                            )}

                            {status === "Одобрен" && (
                              <>
                                <Tooltip title="Клиент передал товар, всё в порядке — зачислить сумму (сначала гасится долг)">
                                  <Button
                                    type="primary"
                                    loading={actionLoadingId === ret.id}
                                    onClick={() =>
                                      handleAction(ret.id, "accept")
                                    }
                                  >
                                    Принять возврат
                                  </Button>
                                </Tooltip>
                                <Button
                                  danger
                                  loading={actionLoadingId === ret.id}
                                  onClick={() =>
                                    handleAction(ret.id, "reject")
                                  }
                                >
                                  Отклонить
                                </Button>
                              </>
                            )}

                            {(status === "Принят" ||
                              status === "Отклонён") && (
                              <p className="text-xs text-gray-400">
                                Возврат уже обработан.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <ReturnPrint buyer={buyer} returns={group.returns} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ReturnsAdmin;
