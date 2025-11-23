// /components/Form/FormOrder.jsx
"use client";

import { sendOrderTelegram } from "@/http/telegramAPI";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/components/Form/MaskPhone/PhoneInput";

const FormOrder = ({
  selectedProduct,
  closeModal,
  setIsFormSubmitted,
  title,
  btn,
  no,
  user,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
  });

  const [tel, setTel] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [alertActive3, setAlertActive3] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertText3, setAlertText3] = useState("");

  const [successActive, setSuccessActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // email обязателен и валиден
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      setAlertText3("Введите корректный email");
      setAlertActive3(true);
      setTimeout(() => setAlertActive3(false), 4000);
      return;
    }

    // телефон обязателен
    const telDigitsOnly = tel.replace(/\D/g, "");
    if (telDigitsOnly.length !== 12) {
      setAlertText(
        "Введите весь номер телефона в правильном формате: +375 XX XXX-XX-XX"
      );
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 4000);
      return;
    }

    // собираем сообщение для Телеграм
    let messageForm = `<b>Заявка с сайта Опт Гродно:</b>\n`;
    messageForm += `<b>${
      selectedProduct || "Заявка на партнёрство"
    }</b>\n`;
    messageForm += `<b>---------------</b>\n`;
    messageForm += `<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n`;
    messageForm += `<b>Email:</b> ${formData.email}\n`;

    // имя для ContactRequest
    const name =
      (user?.userData?.fullName &&
        String(user.userData.fullName).trim()) ||
      (user?.fullName && String(user.fullName).trim()) ||
      "Посетитель сайта";

    // payload для /api/contact-request
    const payloadForDB = {
      name,
      phone: tel,
      company: null,
      message: `Заявка на партнёрство.\nEmail: ${formData.email.trim()}`,
    };

    // отправляем параллельно: БД (важно) и Телеграм (вторично)
    const dbPromise = fetch("/api/contact-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadForDB),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false }));

    const tgPromise = sendOrderTelegram(messageForm).catch(() => ({
      ok: false,
    }));

    const [dbRes, tgRes] = await Promise.all([dbPromise, tgResPromise(tgPromise)]);

    if (dbRes?.ok) {
      // успех: сохранили в БД (главное)
      // очищаем поля
      setTel("");
      setFormData({ email: "" });

      // включаем уведомление
      setSuccessActive(true);

      if (!no) setIsFormSubmitted?.(true);

      // даём пользователю прочитать уведомление и только потом редиректим
      setTimeout(() => {
        router.push("/");
        if (closeModal) closeModal();
      }, 10000);
    } else {
      console.error(
        "Ошибка сохранения заявки в БД /api/contact-request",
        dbRes
      );
    }

    if (!tgRes?.ok) {
      console.warn("Не удалось отправить в Телеграм");
    }
  };

  // обёртка, чтобы не падать, если sendOrderTelegram что-то вернёт не в формате {ok:...}
  const tgResPromise = async (p) => {
    try {
      const r = await p;
      return r || { ok: true };
    } catch {
      return { ok: false };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className={`w-full sd:px-0 ${
        title ? "xz:px-5" : "xz:px-2"
      } sd:py-2 xz:py-0`}
    >
      {title && (
        <p className="text-black uppercase font-bold text-center mb-5 text-xl">
          {title}
        </p>
      )}

      <form
        className={`text-black ${
          no ? "flex items-center sd:flex-row xz:flex-col" : ""
        }`}
        onSubmit={handleSubmit}
      >
        {/* Телефон */}
        <div className="form-control xz:w-full sd:w-auto">
          <label className={`label ${no ? "hidden" : "flex justify-between"}`}>
            <span className="label-text text-[11px]">Телефон</span>
            <span className="label-text-alt text-[9px]">
              Обязательное поле
            </span>
          </label>

          <PhoneInput
            value={tel}
            onChange={setTel}
            setAlertText={setAlertText}
            setAlertActive={setAlertActive}
            bg={false}
          />

          <div className={`label ${no ? "pb-0 pt-0" : ""}`}>
            <span className="label-text-alt text-red-300">
              {alertActive ? alertText : ""}
            </span>
          </div>
        </div>

        {/* Email (обязателен) */}
        <div className="flex flex-col mt-3 xz:w-full sd:w-auto">
          <label className="label flex justify-between">
            <span className="label-text text-[11px]">Email</span>
            <span className="label-text-alt text-[9px]">
              Обязательное поле
            </span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input input-bordered w-full bg-white ${
              alertActive3 ? "input-error" : ""
            } placeholder:text-[12px]`}
            placeholder="Введите ваш email"
          />
          {alertActive3 && (
            <div className="label-text-alt text-red-300 mt-2">
              {alertText3}
            </div>
          )}
        </div>

        <div
          className={`form-control ${
            no ? "sd:ml-3 xz:ml-0 xz:mt-4 sd:mt-0" : "mt-6"
          } xz:w-full sd:w-auto`}
        >
          <button
            className="btn btn-primary font-bold text-white btn-lg"
            type="submit"
          >
            {btn}
          </button>
        </div>
      </form>

      {successActive && (
        <div className="mt-4 p-3 rounded-md bg-green-100 border border-green-300 text-sm text-green-800">
          Ваша заявка на регистрацию принята, с вами свяжется администратор для
          подтверждения учетной записи. В течение нескольких секунд вы будете
          перенаправлены на главную страницу.
        </div>
      )}
    </div>
  );
};

export default FormOrder;
