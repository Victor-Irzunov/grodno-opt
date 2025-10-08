// /components/CompAdmin/ContactRequestsAdmin.jsx
"use client";
import { useEffect, useState } from "react";

export default function ContactRequestsAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/contact-request");
    const data = await res.json();
    setList(data);
    setLoading(false);
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

  if (loading) return <div className="p-6 text-sm text-gray-400">Загрузка…</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Заявки на сотрудничество</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-sm">
              <th>ID</th>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Компания</th>
              <th>Сообщение</th>
              <th>Дата</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {list.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>
                  <a className="link" href={`tel:${i.phone}`}>{i.phone}</a>
                </td>
                <td>{i.company || "-"}</td>
                <td className="max-w-[360px] whitespace-pre-wrap">{i.message || "-"}</td>
                <td>{new Date(i.createdAt).toLocaleString("ru-RU")}</td>
                <td>
                  {i.isViewed ? (
                    <button className="btn btn-xs rounded-sm" onClick={() => markViewed(i.id, false)}>
                      Прочитано
                    </button>
                  ) : (
                    <button className="btn btn-xs btn-primary text-white rounded-sm" onClick={() => markViewed(i.id, true)}>
                      Отметить прочитанным
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400">Заявок пока нет</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
