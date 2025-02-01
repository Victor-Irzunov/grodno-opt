"use client"
import { sendOrderTelegram } from '@/http/telegramAPI';
import { useState } from 'react';
import InputMask from 'react-input-mask';

const FormZahvata = ({ title, btn }) => {
	const [tel, setTel] = useState('');
	const [alertActive, setAlertActive] = useState(false);
	const [alertText, setAlertText] = useState('');
	const [message, setMessage] = useState('');
	const [name, setName] = useState('');
	const [selectedOption, setSelectedOption] = useState(''); 
	const [isModalOpen, setIsModalOpen] = useState(false); 

	const handlePhoneChange = (e) => {
		const newValue = e.target.value;
		setTel(newValue);
	};

	const beforeMaskedValueChange = (newState, oldState, userInput) => {
		let { value } = newState;
		const a = value.replace(/\D/g, '').slice(3, 5);
		let selection = newState.selection;
		if (a.length === 2) {
			const b = ["29", "33", "44", "25"].includes(a);
			if (!b) {
				value = '+375';
				selection = { start: 5, end: 5 };
				setAlertText('Введите код оператора 29,44,33,25');
				setAlertActive(true);
				setTimeout(() => {
					setAlertActive(false);
				}, 3000);
			}
		}
		const cursorPosition = selection ? selection.start : null;
		if (value.endsWith('-') && userInput !== '-' && !tel.endsWith('-')) {
			if (cursorPosition === value.length) {
				selection = { start: cursorPosition - 1, end: cursorPosition - 1 };
			}
			value = value.slice(0, -1);
		}
		return {
			value,
			selection
		};
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!tel ) {
			alert('Заполните обязательные поля!');
			return;
		}
		let messageForm = `<b>Заказ с сайта evakuator555.by:</b>\n`;
		messageForm += `<b>--------------- </b>\n`
		messageForm += `<b>Имя: ${name || 'пусто'} </b>\n`
		messageForm += `<b>--------------- </b>\n`
		messageForm += `<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n`
		messageForm += `<b>--------------- </b>\n`

		const telDigitsOnly = tel.replace(/\D/g, '');
		if (telDigitsOnly.length !== 12) {
			setAlertText('Введите весь номер телефона в правильном формате: +375 XX XXX-XX-XX');
			setAlertActive(true);
			setTimeout(() => {
				setAlertActive(false);
			}, 4000);
			return;
		}

		sendOrderTelegram(messageForm)
			.then(data => {
				if (data.ok) {
					window.location.href = '/thank-you';
					setIsModalOpen(true);
				}
			});
	};

	const handleOptionChange = (e) => {
		setSelectedOption(e.target.value);
	};

	const handleChange = (e) => {
		setMessage(e.target.value);
	};
	const handleChangeName = (e) => {
		setName(e.target.value);
	};

	const closeModal = () => {
		setIsModalOpen(false); // Закрываем модальное окно
	};

	return (
		<div className={``}>
			<form className="mx-auto" onSubmit={handleSubmit}>
				<div className='flex sd:flex-row xz:flex-col sd:space-x-10 xz:space-x-0'>
					<div className="relative z-0 w-full mb-5 group">
						<input
							type="text"
							name="floating_email"
							id="floating_email"
							onChange={handleChangeName}
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=""
						/>
						<label
							htmlFor="floating_email"
							className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Имя
						</label>
					</div>
					<div className="relative z-0 w-full group">
						<InputMask
							name="floating_phone"
							placeholder=""
							mask="+3\7\5 99 999 99 99"
							maskChar="-"
							className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${alertActive ? 'input-error' : ''}`}
							beforeMaskedValueChange={beforeMaskedValueChange}
							value={tel}
							onChange={handlePhoneChange}
						/>
						<label
							htmlFor="floating_phone"
							className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Телефон (+375 29 123-45-67)<span className='text-red-700'>*</span>
						</label>
						<div className="label">
							<span className="label-text-alt text-red-600">
								{alertActive ? alertText : ''}
							</span>
						</div>
					</div>
				</div>

				<div className="form-control mt-10">
					<button
						type="submit"
						className="py-2.5 px-5 me-2 mb-2 sd:text-sm xz:text-xs uppercase text-white bg-primary rounded-full hover:bg-slate-600"
					>
						Отправить
					</button>
				</div>

				<div className='my-8'>
					<p className='text-gray-500 text-xs'>
					Нажимая «Отправить» вы соглашаетесь <span className=''>с обработкой персональных данных</span>
					</p>
					
				</div>
			</form>

			{/* Модальное окно */}
			{isModalOpen && (
				<div className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-bold text-lg text-green-600">Сообщение успешно отправлено!</h3>
						<p className="py-4">Ваше сообщение было отправлено. Мы свяжемся с вами в ближайшее время.</p>
						<div className="modal-action">
							<button onClick={closeModal} className="btn">Закрыть</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FormZahvata;
