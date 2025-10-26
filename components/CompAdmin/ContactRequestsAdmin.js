"use client";
import { useEffect, useMemo, useState } from "react";
import { Modal, Tag, Button, Space } from "antd";
import { PlusOutlined, StopOutlined, CloseOutlined } from "@ant-design/icons";
import RegistrationAdminForm from "../FormsAdmin/RegistrationAdminForm";

const statusColor = (s) => (s === "Заявка" ? "orange" : s === "Добавлен" ? "green" : "red");

export default function ContactRequestsAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // модал регистрации
  const [regOpen, setRegOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const [currentReqId, setCurrentReqId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact-request", { cache: "no-store" });
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markViewed = async (id, isViewed) => {
    await fetch("/api/admin/contact-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isViewed }),
    });
    await load();
  };

  const setStatus = async (id, status) => {
    await fetch("/api/admin/contact-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  };

  const openRegister = (req) => {
    setPrefill({
      fullName: req.name || "",
      phone: req.phone || "",
      address: req.company || "",
    });
    setCurrentReqId(req.id);
    setRegOpen(true);
  };

  const onRegistered = async () => {
    setRegOpen(false);
    if (currentReqId) {
      await setStatus(currentReqId, "Добавлен");
      setCurrentReqId(null);
    }
    await load();
  };

  // сортировка: сверху «Заявка», затем «Добавлен», затем «Отказано»
  const sorted = useMemo(() => {
    const rank = (s) => (s === "Заявка" ? 0 : s === "Добавлен" ? 1 : 2);
    return [...list].sort(
      (a, b) => rank(a.status) - rank(b.status) || new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [list]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-400">Загрузка…</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Заявки на сотрудничество</h2>

      <div className="overflow-x-auto border border-[#2B2B2B] rounded-lg">
        <table className="table table-zebra w-full">
          <thead className="bg-[#202020]">
            <tr className="text-xs uppercase text-gray-200">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Имя</th>
              <th className="px-3 py-2">Телефон</th>
              <th className="px-3 py-2">Компания</th>
              <th className="px-3 py-2">Сообщение</th>
              <th className="px-3 py-2">Дата</th>
              <th className="px-3 py-2">Статус</th>
              <th className="px-3 py-2 text-right">Действия</th>
            </tr>
          </thead>

          <tbody className="text-xs text-gray-100">
            {sorted.map((i) => (
              <tr key={i.id} className="hover:bg-[#1c1c1c]">
                <td className="px-3 py-2 align-top">{i.id}</td>
                <td className="px-3 py-2 align-top">{i.name}</td>
                <td className="px-3 py-2 align-top">
                  <a className="link text-blue-300" href={`tel:${i.phone}`}>{i.phone}</a>
                </td>
                <td className="px-3 py-2 align-top">{i.company || "-"}</td>
                <td className="px-3 py-2 align-top max-w-[480px] whitespace-pre-wrap">{i.message || "-"}</td>
                <td className="px-3 py-2 align-top">{new Date(i.createdAt).toLocaleString("ru-RU")}</td>
                <td className="px-3 py-2 align-top">
                  <Tag color={statusColor(i.status)}>{i.status}</Tag>
                </td>
                <td className="px-3 py-2 align-top text-right">
                  <Space>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      disabled={i.status !== "Заявка"}
                      onClick={() => openRegister(i)}
                      style={{ fontSize: '10px' }}
                    >
                      Зарегистрировать
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<StopOutlined />}
                      disabled={i.status !== "Заявка"}
                      onClick={() => setStatus(i.id, "Отказано")}
                      style={{ fontSize: '10px' }}
                    >
                      Отказать
                    </Button>
                    {i.isViewed ? (
                      <button
                        className="btn btn-xs rounded-sm"
                        onClick={() => markViewed(i.id, false)}
                        style={{ fontSize: '10px', color:'green' }}
                      >
                        Прочитано
                      </button>
                    ) : (
                      <button
                        className="btn btn-xs btn-primary text-white rounded-sm text-[9px]"
                        onClick={() => markViewed(i.id, true)}
                        style={{ fontSize: '10px' }}
                      >
                        Отметить прочитанным
                      </button>
                    )}
                  </Space>
                </td>
              </tr>
            ))}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 px-3 py-6">
                  Заявок пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title={<span style={{ color: "#fff" }}>Регистрация клиента</span>}
        open={regOpen}
        footer={null}
        onCancel={() => { setRegOpen(false); setCurrentReqId(null); }}
        destroyOnHidden
        closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
        styles={{
          content: { background: "#191919" },
          header: { background: "#191919" },
          body: { background: "#191919" },
          footer: { background: "#191919" },
        }}
      >
        <RegistrationAdminForm
          initialValues={prefill || {}}
          onSuccess={onRegistered}
          white
        />
      </Modal>
    </div>
  );
}
