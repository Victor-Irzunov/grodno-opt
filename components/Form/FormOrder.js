"use client"
import { sendOrderTelegram } from '@/http/telegramAPI';
import { useState } from 'react';
import InputMask from 'react-input-mask';

const FormOrder = ({ selectedProduct, closeModal, setIsFormSubmitted, title, btn, no }) => {
	const [formData, setFormData] = useState({ phone: '', message: '', question: '', serviceType: '' });
	const [tel, setTel] = useState('')
	const [alertActive, setAlertActive] = useState(false)
	const [alertText, setAlertText] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		let messageForm = `<b>Заказ с сайта Автосалона:</b>\n`;
		messageForm += `<b>${selectedProduct || 'Узнать стоимость'} </b>\n`;
		messageForm += `<b>--------------- </b>\n`;
		messageForm += `<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n`;
		messageForm += `<b>--------------- </b>\n`;
		// messageForm += `<b>Услуга: ${formData.serviceType || '-'} </b>\n`;
		messageForm += `<b>--------------- </b>\n`;
		messageForm += `<b>Сообщение: ${formData.message || '-'} </b>\n`;

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
					if (!no) {
						setIsFormSubmitted(true);
					}
					setTimeout(() => {
						closeModal()
					}, 3000)
				} else {
					console.error('Ошибка отправки формы');
				}
			})
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

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
				selection = { start: 5, end: 5 }
				setAlertText('Введите код оператора 29,44,33,25')
				setAlertActive(true);
				setTimeout(() => {
					setAlertActive(false)
				}, 3000)
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

	return (
		<div className={`w-full sd:px-0 ${title ? 'xz:px-5' : 'xz:px-2'} sd:py-2 xz:py-0`}>
			<p className='text-black uppercase font-bold text-center mb-5 text-xl'>
				{title ? 'Напишите нам' : null}
			</p>
			<form className={`text-black ${no ? 'flex items-center sd:flex-row xz:flex-col' : ''}`} onSubmit={handleSubmit}>

				<div className="form-control xz:w-full sd:w-auto">
					<label className={`label ${no ? 'hidden' : 'flex'}`}>
						<span className="label-text">Телефон</span>
						<span className="label-text-alt">Обязательное поле</span>
					</label>
					<InputMask
						placeholder="+375 29 123-45-67"
						mask="+3\7\5 99 999 99 99"
						maskChar={'-'}
						className={`input input-bordered ${alertActive ? 'input-error' : ''} input-lg bg-white`}
						beforeMaskedValueChange={beforeMaskedValueChange}
						value={tel}
						onChange={handlePhoneChange}
					/>
					<div className={`label ${no ? 'pb-0 pt-0' : ''}`}>
						<span className="label-text-alt text-red-300">
							{alertActive ? alertText : ''}
						</span>
					</div>
				</div>
				{/* {
					!no ?
						<div className="form-control mt-3">
							<label className="label">
								<span className="label-text">Выберите услугу</span>
								<span className="label-text-alt">Необязательное поле</span>
							</label>
							<select
								name="serviceType"
								value={formData.serviceType}
								onChange={handleChange}
								className="select select-bordered xz:select-sm sd:select-lg select-lg"
							>
								<option value="">Выберите услугу...</option>
								<option value="Диагностика автомобиля">Диагностика автомобиля</option>
								<option value="ТО автомобиля">ТО автомобиля</option>
								<option value="Ремонт подвески">Ремонт подвески</option>
								<option value="Ремонт тормозной системы">Ремонт тормозной системы</option>
								<option value="Ремонт системы охлаждения">Ремонт системы охлаждения</option>
								<option value="Другое">Другое</option>
							</select>
						</div>
						:
						null
				} */}

				{
					!no
						?
						<div className="form-control mt-3">
							<label className="label">
								<span className="label-text">Сообщение</span>
								<span className="label-text-alt">Необязательное поле</span>
							</label>
							<textarea
								name="message"
								value={formData.message}
								onChange={handleChange}
								className="textarea textarea-bordered xz:textarea-sm sd:textarea-lg bg-white"
								placeholder="Ваше сообщение"
							></textarea>
						</div>
						:
						null
				}
				<div className={`form-control ${no ? 'sd:ml-3 xz:ml-0 xz:mt-4 sd:mt-0' : 'mt-6'} xz:w-full sd:w-auto`}>
					<button className="btn btn-primary font-bold text-white btn-lg" type="submit">
						{btn}
					</button>
				</div>
			</form>
		</div>
	);
};

export default FormOrder;
