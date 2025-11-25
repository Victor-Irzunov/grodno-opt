// /components/ComponentsMojKabinet/LichnyjSchet.jsx
import React, { useState, useEffect } from "react";
import { Table, Select } from "antd";
import FormSchet from "../Form/FormSchet";
import dayjs from "dayjs";
import "dayjs/locale/ru";

const { Option } = Select;

const LichnyjSchet = ({ data, setActiveComponent }) => {
  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const balance = Number(data?.wholesaleBuyer?.balance ?? 0);
  const debt = Number(data?.wholesaleBuyer?.debt ?? 0);
  const limit = Number(data?.wholesaleBuyer?.limit ?? 0);
  const transactions = data?.wholesaleBuyer?.transactions || [];

  // доступный минус (сколько ещё можно уйти в долг)
  const availableCredit = Math.max(limit - debt, 0);

  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [filteredData, setFilteredData] = useState(transactions);

  const typeNames = {
    deposit: "Пополнение счёта",
    order: "Оплата заказов",
    debt: "Списание долгов",
    RETURN_REFUND: "Возврат товара",
  };

  useEffect(() => {
    let result = transactions;

    if (filterType !== "all") {
      result = result.filter((tr) => tr.type === filterType);
    }

    if (dateRange) {
      const [start, end] = dateRange;
      result = result.filter(
        (tr) =>
          dayjs(tr.createdAt).isAfter(
            dayjs(start).startOf("day").subtract(1, "ms")
          ) &&
          dayjs(tr.createdAt).isBefore(
            dayjs(end).endOf("day").add(1, "ms")
          )
      );
    }

    setFilteredData(result);
  }, [transactions, filterType, dateRange]);

  const handleReset = (e) => {
    e.preventDefault();
    setFilterType("all");
    setDateRange(null);
    setFilteredData(transactions);
  };

  const displayData = filteredData.map((tr, index) => ({
    key: index,
    date: dayjs(tr.createdAt).format("DD.MM.YYYY"),
    amount: tr.amount,
    type: typeNames[tr.type] || "Транзакция",
    description: typeNames[tr.type]
      ? tr.type === "deposit"
        ? "Пополнение баланса"
        : tr.type === "RETURN_REFUND"
        ? "Зачисление за возврат товара"
        : "Покупка товара / списание"
      : "-",
    color:
      tr.type === "deposit" || tr.type === "RETURN_REFUND"
        ? "green"
        : "red",
  }));

  const columns = [
    { title: "Дата транзакции", dataIndex: "date", key: "date" },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => (
        <span style={{ color: record.color }}>{record.amount} $</span>
      ),
    },
    { title: "Тип", dataIndex: "type", key: "type" },
    { title: "Описание", dataIndex: "description", key: "description" },
  ];

  return (
    <div className="mt-2 border">
      <div className="border-b sd:p-6 xz:p-4">
        <p className="font-light text-gray-500 text-sm">
          Состояние счёта на {currentDate}
        </p>

        <div className="flex sd:flex-row xz:flex-col items-start sd:space-x-10 xz:space-x-0 mt-4">
          <div>
            <p className="text-xl font-semibold">{balance.toFixed(2)} $</p>
            <p className="text-xs text-gray-500">Баланс</p>
          </div>

          <div className="sd:mt-0 xz:mt-3">
            <p className="text-xl font-semibold text-red-600">
              {debt.toFixed(2)} $
            </p>
            <p className="text-xs text-gray-500">Долг</p>
          </div>

          <div className="sd:mt-0 xz:mt-3">
            <p className="text-xl font-semibold text-blue-600">
              {limit.toFixed(2)} $
            </p>
            <p className="text-xs text-gray-500">
              Кредитный лимит (макс. минус)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Доступно ещё в минус:{" "}
              <span className="font-semibold">
                {availableCredit.toFixed(2)} $
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="sd:p-6 xz:p-4 flex xz:justify-center sd:justify-start">
        <FormSchet
          onReset={handleReset}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>

      <div className="sd:px-6 xz:px-4 mb-4">
        <Select
          value={filterType}
          onChange={setFilterType}
          style={{ width: 220 }}
        >
          <Option value="all">Все транзакции</Option>
          <Option value="deposit">Пополнение счёта</Option>
          <Option value="order">Оплата заказов</Option>
          <Option value="debt">Списание долгов</Option>
          <Option value="RETURN_REFUND">Возврат товара</Option>
        </Select>
      </div>

      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={displayData}
          pagination={false}
          className="overflow-x-auto"
        />
      </div>
    </div>
  );
};

export default LichnyjSchet;
