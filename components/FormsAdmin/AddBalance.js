"use client";

import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, message } from "antd";

const AddBalance = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  // Поиск клиентов по символам
  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setResults([]);
      setSelectedBuyer(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(
          `/api/admin/search-buyers?q=${encodeURIComponent(query)}`,
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

  const handleSelectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    form.setFieldsValue({
      userId: buyer.userId,
    });
  };

  const handleFinish = async (values) => {
    if (!selectedBuyer) {
      messageApi.error("Сначала выберите клиента");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/user/add-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        messageApi.success("Баланс успешно пополнен");
        form.resetFields();
        setSelectedBuyer(null);
        setSearch("");
        setResults([]);
      } else {
        messageApi.error(data.message || "Ошибка при пополнении баланса");
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <div className="max-w-xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          {/* Поиск клиента */}
          <Form.Item
            label={<span style={{ color: "white" }}>Поиск клиента</span>}
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ID, имя, фамилия, email, телефон или адрес"
              style={{
                backgroundColor: "#191919",
                color: "white",
                borderColor: "#444",
              }}
            />
            <p className="text-xs text-gray-400 mt-1">
              Вводите любые символы: ID, имя, фамилию, телефон, email или адрес.
            </p>
          </Form.Item>

          {/* Скрытое поле userId для формы */}
          <Form.Item
            name="userId"
            rules={[{ required: true, message: "Выберите клиента" }]}
            style={{ display: "none" }}
          >
            <InputNumber />
          </Form.Item>

          {/* Результаты поиска */}
          {search && (
            <div className="mb-6">
              <div className="text-xs text-gray-300 mb-2">
                {searchLoading
                  ? "Поиск клиентов..."
                  : results.length === 0
                  ? "Ничего не найдено"
                  : `Найдено клиентов: ${results.length}`}
              </div>

              <div className="border border-gray-700 rounded-md max-h-80 overflow-y-auto">
                {results.map((buyer) => {
                  const user = buyer.user || {};
                  const userData = user.userData || {};
                  const isActive =
                    selectedBuyer && selectedBuyer.id === buyer.id;

                  return (
                    <button
                      key={buyer.id}
                      type="button"
                      onClick={() => handleSelectBuyer(buyer)}
                      className={`w-full text-left px-3 py-2 border-b border-gray-800 hover:bg-[#222] transition-colors ${
                        isActive ? "bg-[#317bff1a] border-l-4 border-primary" : ""
                      }`}
                    >
                      <div className="text-sm font-semibold text-white">
                        {userData.fullName || "Без имени"}{" "}
                        <span className="text-xs text-gray-400">
                          (User ID: {user.id}, Buyer ID: {buyer.id})
                        </span>
                      </div>
                      <div className="text-xs text-gray-300">
                        Email: {user.email}
                      </div>
                      <div className="text-xs text-gray-300">
                        Телефон: {userData.phone || "—"}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        Адрес: {userData.address || "—"}
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
            </div>
          )}

          {/* Выбранный клиент */}
          {selectedBuyer && (
            <div className="mb-6 text-sm text-gray-100 border border-gray-700 rounded-md p-3 bg-[#202020]">
              <p className="font-semibold mb-1">Выбранный клиент:</p>
              <p>
                ФИО:{" "}
                <span className="font-semibold">
                  {selectedBuyer.user?.userData?.fullName || "Без имени"}
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="font-semibold">
                  {selectedBuyer.user?.email}
                </span>
              </p>
              <p>
                Телефон:{" "}
                <span className="font-semibold">
                  {selectedBuyer.user?.userData?.phone || "—"}
                </span>
              </p>
              <p>
                Адрес:{" "}
                <span className="font-semibold">
                  {selectedBuyer.user?.userData?.address || "—"}
                </span>
              </p>
              <p className="mt-1">
                User ID:{" "}
                <span className="font-semibold">{selectedBuyer.userId}</span>{" "}
                / Buyer ID:{" "}
                <span className="font-semibold">{selectedBuyer.id}</span>
              </p>
              <p className="mt-1">
                Баланс:{" "}
                <span className="text-green-400 font-semibold">
                  {Number(selectedBuyer.balance).toFixed(2)} $
                </span>{" "}
                / Долг:{" "}
                <span className="text-red-400 font-semibold">
                  {Number(selectedBuyer.debt).toFixed(2)} $
                </span>
              </p>
            </div>
          )}

          {/* Поле суммы и кнопка — только если клиент выбран */}
          {selectedBuyer && (
            <>
              <Form.Item
                label={
                  <span style={{ color: "white" }}>Сумма пополнения $</span>
                }
                name="amount"
                rules={[{ required: true, message: "Введите сумму" }]}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  placeholder="Введите сумму"
                  style={{
                    backgroundColor: "#191919",
                    color: "white",
                    width: "50%",
                  }}
                  className="white-placeholder"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Пополнить баланс
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </div>
    </>
  );
};

export default AddBalance;
