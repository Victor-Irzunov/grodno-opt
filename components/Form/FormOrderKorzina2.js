// /components/Form/FormOrderKorzina2.js
"use client";

import { sendOrderTelegram } from "@/http/telegramAPI";
import React, { useContext, useEffect, useState } from "react";
import PhoneInput from "./MaskPhone/PhoneInput";
import { makingAnOrder } from "@/http/userAPI";
import { MyContext } from "@/contexts/MyContextProvider";

const FormOrderKorzina2 = ({
  selectedProduct,
  closeModal,
  setIsFormSubmitted,
  title,
  btn,
  no,
  user,
  data,
  setData,
}) => {
  const { dataApp } = useContext(MyContext);
  const [tel, setTel] = useState("+375 ");
  const [message1, setMessage1] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [agree, setAgree] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState(
    "Самовывоз Космонавтов 9, каб 3"
  );
  const [address, setAddress] = useState("");

  const [successActive, setSuccessActive] = useState(false);
  const [errorActive, setErrorActive] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (user?.userData?.userData?.phone) {
      const digits = user.userData.userData.phone.replace(/\D/g, "");
      if (digits.startsWith("375")) {
        const formatted = `+375 ${digits.slice(3, 5)} ${digits.slice(
          5,
          8
        )}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
        setTel(formatted);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?.userData?.userData?.address) {
      setAddress(user.userData.userData.address);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const telDigitsOnly = tel.replace(/\D/g, "");
    if (telDigitsOnly.length !== 12) {
      setAlertText(
        "Введите весь номер телефона в правильном формате: +375 XX XXX-XX-XX"
      );
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 4000);
      return;
    }

    try {
      const orderPayload = {
        phone: tel,
        message: message1 || "",
        deliveryMethod,
        address:
          deliveryMethod !== "Самовывоз Космонавтов 9, каб 3" ? address : "",
        data,
        userData: user?.userData?.userData || null,
      };

      const serverResponse = await makingAnOrder(orderPayload);

      if (serverResponse) {
        // включаем уведомление (инлайновое + тост)
        setSuccessActive(true);

        const productsList = data
          .map(
            (item, index) =>
              `<b>${index + 1}.</b> ${item.title}
Артикул: <code>${item.article}</code>
Цена: <b>${item.price} руб</b> × ${item.quantity}`
          )
          .join("\n\n");

        const messageForm = `
<b>Заказ с сайта Гродно опт:</b>\n
<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n
<b>Способ доставки:</b> ${deliveryMethod}\n
<b>Адрес:</b> ${
          deliveryMethod !== "Самовывоз Космонавтов 9, каб 3"
            ? address
            : "Не указан"
        }\n
<b>Сообщение:</b> ${
          message1 || "Нет дополнительных сообщений"
        }\n\n<b>Товары:</b>\n\n${productsList}
`;

        sendOrderTelegram(messageForm);

        // 1) через 10 секунд очищаем корзину
        // 2) ещё 10 секунд держим уведомление (итого ~20 сек после отправки)
        const CLEAR_DELAY = 10000;
        const HIDE_AFTER_CLEAR_DELAY = 10000;

        setTimeout(() => {
          try {
            localStorage.removeItem("parts");
          } catch (e) {
            console.error("Cannot clear localStorage parts:", e);
          }
          if (dataApp?.setDataKorzina) {
            dataApp.setDataKorzina([]);
          }
          setTel("+375 ");
          setMessage1("");
          setAddress("");
          if (setData) {
            setData(null);
          }

          // держим уведомление ещё 10 секунд после очистки
          setTimeout(() => {
            setSuccessActive(false);
          }, HIDE_AFTER_CLEAR_DELAY);
        }, CLEAR_DELAY);
      } else {
        setErrorText("Ошибка отправки формы");
        setErrorActive(true);
        setTimeout(() => setErrorActive(false), 4000);
      }
    } catch (err) {
      console.error("Ошибка отправки формы:", err);
      setErrorText("Ошибка отправки формы");
      setErrorActive(true);
      setTimeout(() => setErrorActive(false), 4000);
    }
  };

  return (
    <div className="w-full sd:px-12 sd:py-2 xz:px-0 xz:py-0 relative">
      {/* Центровый toast по DaisyUI */}
      {successActive && (
        <div className="toast toast-center toast-middle z-50">
          <div className="alert alert-success">
            <span>
              Заказ успешно отправлен. Корзина будет очищена через несколько секунд.
            </span>
          </div>
        </div>
      )}

      {errorActive && (
        <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-800">
          {errorText}
        </div>
      )}

      {/* Инлайновое уведомление сверху формы (как было) */}
      {successActive && (
        <div className="mb-4 rounded-md bg-green-100 border border-green-300 px-3 py-2 text-sm text-green-800">
          Ваш заказ успешно отправлен! В ближайшее время с вами свяжется
          менеджер. Корзина будет очищена через несколько секунд, уведомление
          останется видимым ещё немного.
        </div>
      )}

      <form className="text-black" onSubmit={handleSubmit}>
        <div className="form-control mt-4">
          <label className="label mb-1.5">
            <span className="label-text font-semibold">
              Телефон (xx xxx-xx-xx)
            </span>
            <span className="label-text-alt text-[10px]">
              Обязательное поле
            </span>
          </label>
          <PhoneInput
            value={tel}
            onChange={setTel}
            setAlertText={setAlertText}
            setAlertActive={setAlertActive}
          />
          {alertActive && (
            <div className="text-red-600 text-xs mt-1">{alertText}</div>
          )}
        </div>

        <div className="form-control mt-6">
          <label className="label">
            <span className="label-text font-semibold">Способ доставки</span>
          </label>
          <div className="space-y-2 text-sm mt-4">
            {[
              "Самовывоз Космонавтов 9, каб 3",
              "Отправить курьером",
              "Отправить такси",
              "Отправить почтой",
              "Отправить автолайт",
              "Отправить ближайшей маршруткой",
            ].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  value={option}
                  checked={deliveryMethod === option}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {deliveryMethod !== "Самовывоз Космонавтов 9, каб 3" && (
          <div className="form-control mt-4 flex flex-col">
            <label className="label">
              <span className="label-text font-semibold">Адрес доставки</span>
            </label>
            <input
              type="text"
              placeholder="Город, улица, дом, квартира"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input input-bordered"
            />
          </div>
        )}

        <div className="form-control mt-4 flex flex-col">
          <label className="label flex space-x-3">
            <span className="label-text">Сообщение</span>
            <span className="label-text-alt text-[10px]">
              Необязательное поле
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Ваше сообщение..."
            value={message1}
            onChange={(e) => setMessage1(e.target.value)}
          />
        </div>

        <div className="form-control mt-6">
          <button
            className="btn btn-secondary font-bold text-white uppercase"
            type="submit"
            disabled={successActive}
          >
            Заказать
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormOrderKorzina2;
