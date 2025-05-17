"use client";
import { sendOrderTelegram } from '@/http/telegramAPI';
import React, { useContext, useEffect, useState } from 'react';
import PhoneInput from './MaskPhone/PhoneInput';
import { makingAnOrder } from '@/http/userAPI';
import { message } from 'antd';
import { MyContext } from '@/contexts/MyContextProvider';

const FormOrderKorzina2 = ({ selectedProduct, closeModal, setIsFormSubmitted, title, btn, no, user, data, setData }) => {
  console.log("🚀 🚀 🚀  _ FormOrderKorzina2 _ data:", data);
  const { dataApp } = useContext(MyContext);
  const [tel, setTel] = useState('+375 ');
  const [message1, setMessage1] = useState('');
  const [alertActive, setAlertActive] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [agree, setAgree] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('Самовывоз Космонавтов 9, каб 3');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user?.userData?.userData?.phone) {
      const digits = user.userData.userData.phone.replace(/\D/g, '');
      if (digits.startsWith('375')) {
        const formatted = `+375 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
        setTel(formatted);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?.userData?.userData?.address) {
      setAddress(user?.userData?.userData?.address);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const telDigitsOnly = tel.replace(/\D/g, '');
    if (telDigitsOnly.length !== 12) {
      setAlertText('Введите весь номер телефона в правильном формате: +375 XX XXX-XX-XX');
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 4000);
      return;
    }

    const orderPayload = {
      phone: tel,
      message: message1 || '',
      deliveryMethod,
      address: deliveryMethod !== 'Самовывоз Космонавтов 9, каб 3' ? address : '',
      data,
      userData: user?.userData?.userData || null,
    };

    const serverResponse = await makingAnOrder(orderPayload);

    if (serverResponse) {
      message.success('Заказ отправлен!');

      const productsList = data.map((item, index) =>
        `<b>${index + 1}.</b> ${item.title}
		 Артикул: <code>${item.article}</code>
		 Цена: <b>${item.price} руб</b> × ${item.quantity}`
      ).join('\n\n');


      const messageForm = `
		 <b>Заказ с сайта Гродно опт:</b>\n
		 <b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n
		 <b>Способ доставки:</b> ${deliveryMethod}\n
		 <b>Адрес:</b> ${deliveryMethod !== 'Самовывоз Космонавтов 9, каб 3' ? address : 'Не указан'}\n
		 <b>Сообщение:</b> ${message1 || 'Нет дополнительных сообщений'}\n
		 <b>Товары:</b>\n\n${productsList}
		 `;


      sendOrderTelegram(messageForm);

      localStorage.removeItem('parts');
      dataApp.setDataKorzina([]);
      setTel('+375 ');
      setMessage1('');
      setAddress('');
      setData(null)
    } else {
      message.error('Ошибка отправки формы');
    }
  };

  return (
    <div className="w-full sd:px-12 sd:py-2 xz:px-0 xz:py-0">
      <form className="text-black" onSubmit={handleSubmit}>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text font-semibold">Телефон (xx xxx-xx-xx)</span>
            <span className="label-text-alt text-[10px]">Обязательное поле</span>
          </label>
          <PhoneInput value={tel} onChange={setTel} setAlertText={setAlertText} setAlertActive={setAlertActive} />
          {alertActive && <div className="text-red-600 text-xs mt-1">{alertText}</div>}
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text font-semibold">Способ доставки</span>
          </label>
          <div className="space-y-2 text-sm">
            {['Самовывоз Космонавтов 9, каб 3', 'Отправить курьером', 'Отправить такси', 'Отправить почтой', 'Отправить автолайт', 'Отправить ближайшей маршруткой'].map(option => (
              <label key={option} className="flex items-center gap-2">
                <input type="radio" name="delivery" value={option} checked={deliveryMethod === option} onChange={(e) => setDeliveryMethod(e.target.value)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {deliveryMethod !== 'Самовывоз Космонавтов 9, каб 3' && (
          <div className="form-control mt-4">
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

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Сообщение</span>
            <span className="label-text-alt text-[10px]">Необязательное поле</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Ваше сообщение..."
            value={message1}
            onChange={(e) => setMessage1(e.target.value)}
          />
        </div>

        <div className="form-control mt-6">
          <button className="btn btn-secondary font-bold text-white uppercase" type="submit">
            Заказать
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormOrderKorzina2;
