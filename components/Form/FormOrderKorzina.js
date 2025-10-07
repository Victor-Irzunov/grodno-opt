"use client";

import { sendOrderTelegram } from '@/http/telegramAPI';
import { useContext, useState } from 'react';
import {
  MyContext
} from '@/contexts/MyContextProvider';
import PhoneInput from '@/components/Form/MaskPhone/PhoneInput';

const FormOrderKorzina = ({ closeModalOrder, setIsFormSubmitted, data, setIsActive, setData }) => {
  const [isActive2, setIsActive2] = useState(false); // алерт по телефону
  const [alertText, setAlertText] = useState('Введите пожалуйста корректный номер телефона!');
  const [tel, setTel] = useState('');
  const [isBool, setIsBool] = useState(false);
  const { setCount } = useContext(MyContext);
  const [formDataForm, setFormDataForm] = useState({
    name: '',
    surname: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация телефона: +375 XX XXX-XX-XX => ровно 12 цифр
    const digits = tel.replace(/\D/g, '');
    if (digits.length !== 12) {
      setAlertText('Введите номер в формате: +375 XX XXX-XX-XX');
      setIsActive2(true);
      setTimeout(() => setIsActive2(false), 4000);
      return;
    }

    let messageForm = `<b>Заказ с сайта Гродно опт:</b>\n`;
    messageForm += `<b> </b>\n`;

    (data || []).forEach((item, index) => {
      messageForm += `<b>Товар ${index + 1}:</b> ${item.title}\n`;
      messageForm += `<b>Количество:</b> ${item.quantity}\n`;
      messageForm += `<b>Цена:</b> ${item.price} руб.\n`;
      messageForm += `<b> </b>\n`;
    });

    messageForm += `<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n`;
    messageForm += `<b> </b>\n`;
    messageForm += `<b>Имя:</b> ${formDataForm.name}\n`;
    messageForm += `<b> </b>\n`;
    messageForm += `<b>Фамилия:</b> ${formDataForm.surname}\n`;
    messageForm += `<b> </b>\n`;
    messageForm += `<b>Сообщение: ${formDataForm.message || '-'} </b>\n`;

    sendOrderTelegram(messageForm).then((res) => {
      if (res?.ok) {
        // Очистка корзины и формы
        try { localStorage.removeItem('cart'); } catch {}
        setFormDataForm({
          name: '',
          surname: '',
          phone: '',
          message: '',
        });
        setTel('');
        setIsActive?.(false);
        setIsBool((i) => !i);
        setCount?.(0);
        setData?.(null);
        setIsFormSubmitted?.(true);
        closeModalOrder?.();
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {isActive2 ? (
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{alertText}</span>
        </div>
      ) : null}

      <div className="w-full bg-base-100">
        <form onSubmit={handleSubmit}>
          {/* Телефон */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Телефон</span>
              <span className="label-text-alt">Обязательное поле</span>
            </label>

            <PhoneInput
              value={tel}
              onChange={setTel}
              setAlertText={setAlertText}
              setAlertActive={setIsActive2}
              bg={false}
            />
          </div>

          {/* Имя */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text">Имя</span>
              <span className="label-text-alt">Обязательное поле</span>
            </label>
            <input
              type="text"
              name="name"
              value={formDataForm.name}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="Введите ваше имя"
              required
            />
          </div>

          {/* Фамилия */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text">Фамилия</span>
              <span className="label-text-alt">Обязательное поле</span>
            </label>
            <input
              type="text"
              name="surname"
              value={formDataForm.surname}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="Введите вашу фамилию"
              required
            />
          </div>

          {/* Комментарий */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text">Коментарий</span>
              <span className="label-text-alt">Необязательное поле</span>
            </label>
            <textarea
              name="message"
              value={formDataForm.message}
              onChange={handleChange}
              className="textarea textarea-bordered xz:textarea-sm sd:textarea-lg"
              placeholder=""
            />
          </div>

          <div className="form-control mt-6">
            <button
              className="btn btn-primary bg-green-600 border-green-600 text-white uppercase tracking-widest"
              type="submit"
            >
              Заказать
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormOrderKorzina;
