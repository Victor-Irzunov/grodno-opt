// /app/kontakty/page.jsx
"use client";
import React, { useState } from "react";
import phoneNumbers from "@/config/config";

export default function Page() {
  const [form, setForm] = useState({ name: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setErr(null);
    try {
      const res = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setOk("Заявка отправлена. Мы свяжемся с вами.");
      setForm({ name: "", phone: "", company: "", message: "" });
    } catch {
      setErr("Ошибка отправки. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20">
      <section>
        <div className="container mx-auto">
          <h1 className="sd:text-3xl xz:text-xl font-semibold">Контакты</h1>

          <div className="mt-8 grid sd:grid-cols-2 xz:grid-cols-1 gap-8">
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Телефон:</p>
              <a
                href={`tel:${phoneNumbers.mainPhoneLink}`}
                className="btn sd:bg-black xz:bg-black sd:text-white xz:text-white border-none rounded-sm font-light w-fit"
              >
                {phoneNumbers.mainPhone}
              </a>

              <div className="divider"></div>

              <h2 className="text-xl font-semibold">Заявка на сотрудничество</h2>

              <form onSubmit={submit} className="space-y-3 max-w-lg">
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Ваше имя*"
                  className="input input-bordered w-full rounded-sm"
                  required
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Телефон*"
                  className="input input-bordered w-full rounded-sm"
                  required
                />
                <input
                  name="company"
                  value={form.company}
                  onChange={onChange}
                  placeholder="Компания"
                  className="input input-bordered w-full rounded-sm"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Сообщение"
                  className="textarea textarea-bordered w-full rounded-sm"
                  rows={4}
                />
                <button type="submit" className="btn btn-primary rounded-sm text-white" disabled={loading}>
                  {loading ? "Отправка..." : "Отправить заявку"}
                </button>

                {ok && <p className="text-green-600 text-sm">{ok}</p>}
                {err && <p className="text-red-600 text-sm">{err}</p>}
              </form>
            </div>

            <div className="text-sm text-gray-500">
              <p>Мы работаем с оптовыми клиентами. Оставьте заявку — менеджер свяжется с вами.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
