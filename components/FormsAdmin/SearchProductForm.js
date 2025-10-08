// /components/FormsAdmin/SearchProductForm.js
"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { Form, Input, List, Empty, Spin, message, Typography, Tag } from "antd";
import { getOneProduct } from "@/http/adminAPI";

const { Text } = Typography;

export default function SearchProductForm({ onPick }) {
  const [form] = Form.useForm();

  // ✅ Локальный инстанс сообщений (совместимо с React 19)
  const [messageApi, contextHolder] = message.useMessage();

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const controllerRef = useRef(null);
  const inputRef = useRef(null);

  const fetchSearch = async (query) => {
    try {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      setLoading(true);

      const res = await fetch(
        `/api/admin/product/search?q=${encodeURIComponent(query)}`,
        { signal: controllerRef.current.signal }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Bad response (${res.status}): ${text}`);
      }

      const data = await res.json();
      const list = Array.isArray(data.items) ? data.items : [];
      setItems(list);
      setIsListVisible(true);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        messageApi.error("Не удалось выполнить поиск");
      }
    } finally {
      setLoading(false);
    }
  };

  const debouncedQ = useDebounce(q, 350);

  useEffect(() => {
    if (!debouncedQ.trim()) {
      setItems([]);
      setIsListVisible(false);
      return;
    }
    fetchSearch(debouncedQ.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const onSelectItem = async (item) => {
    try {
      const data = await getOneProduct(item.id);
      if (!data?.oneProduct) {
        messageApi.warning("Товар не найден");
        return;
      }
      onPick(data.oneProduct);
      messageApi.success(`Выбран товар #${data.oneProduct.id}`);

      // Закрываем список и очищаем ввод
      setIsListVisible(false);
      setItems([]);
      setQ("");
      if (inputRef.current) inputRef.current.blur();
    } catch (e) {
      console.error(e);
      messageApi.error("Ошибка получения товара");
    }
  };

  return (
    <div className="pl-10">
      {/* Контекст Antd сообщений */}
      {contextHolder}

      <Form form={form} layout="vertical">
        <Form.Item
          label={<span style={{ color: "white" }}>Поиск товара</span>}
          extra={
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              ID, артикул или начало названия — список обновляется сразу
            </span>
          }
        >
          <Input
            ref={inputRef}
            allowClear
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Например: 125  |  A12-34  |  Дисплей iPhone"
            style={{ backgroundColor: "#191919", color: "white", width: 420 }}
          />
        </Form.Item>
      </Form>

      {isListVisible && (
        <div
          className="mt-3"
          style={{
            background: "#141414",
            border: "1px solid #2B2B2B",
            borderRadius: 8,
            maxWidth: 760,
          }}
        >
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <Spin />
            </div>
          ) : items.length === 0 ? (
            <div className="py-8">
              <Empty
                description={<p className="text-white/70">Ничего не найдено</p>}
              />
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={items}
              renderItem={(item) => (
                <List.Item
                  className="hover:bg-[#1f1f1f] transition-colors"
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #2B2B2B",
                  }}
                  onClick={() => onSelectItem(item)}
                  actions={[
                    <Tag key="id" color="blue">
                      ID: {item.id}
                    </Tag>,
                    <Tag key="art" color="geekblue">
                      {item.article || "—"}
                    </Tag>,
                    <Tag
                      key="status"
                      color={item.status === "В наличии" ? "green" : "gold"}
                    >
                      {item.status}
                    </Tag>,
                    <Tag key="price" color="purple">
                      {Number(item.price)} $
                    </Tag>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Text style={{ color: "white" }} ellipsis>
                        {item.title}
                      </Text>
                    }
                    description={
                      <span style={{ color: "rgba(255,255,255,0.65)" }}>
                        Категория: {item.categoryId} · Группа: {item.groupId} ·
                        Остаток: {item.count}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}

function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
