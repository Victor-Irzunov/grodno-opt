"use client"
import { sendOrderTelegram } from '@/http/telegramAPI';
import { useState } from 'react';
import InputMask from 'react-input-mask';

const FormOrder = ({ selectedProduct, closeModal, setIsFormSubmitted, title, btn, no, user }) => {
	const [formData, setFormData] = useState({ phone: '', message: '', question: '', serviceType: '', address: '', email: '' });
	const [tel, setTel] = useState('');
	const [alertActive, setAlertActive] = useState(false);
	const [alertActive2, setAlertActive2] = useState(false);
	const [alertActive3, setAlertActive3] = useState(false);
	const [alertText, setAlertText] = useState('');
	const [alertText2, setAlertText2] = useState('');
	const [alertText3, setAlertText3] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.address.trim()) {
			setAlertText2('Введите адрес');
			setAlertActive2(true);
			setTimeout(() => {
				setAlertActive2(false);
			}, 4000);
			return;
		}

		if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			setAlertText3('Введите корректный email');
			setAlertActive3(true);
			setTimeout(() => setAlertActive3(false), 4000);
			return;
		}


		let messageForm = `<b>Заявка с сайта Опт Гродно:</b>\n`;
		messageForm += `<b>${selectedProduct || 'Узнать'} </b>\n`;
		messageForm += `<b>--------------- </b>\n`;
		messageForm += `<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n`;
		messageForm += `<b>Email:</b> ${formData.email} \n`;
		messageForm += `<b>--------------- </b>\n`;
		messageForm += `<b>Адрес:</b> ${formData.address} \n`;
		messageForm += `<b>Название мастерской:</b> ${formData.workshop || '-'} \n`;
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
					// window.location.href = '/thank-you';
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

				{/* Поле Email */}
				<div className="form-control mt-3">
					<label className="label">
						<span className="label-text">Email</span>
						<span className="label-text-alt">Обязательное поле</span>
					</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className={`input input-bordered bg-white ${alertActive3 ? 'input-error' : ''}`}
						placeholder="Введите ваш email"
					/>
					{alertActive3 && <div className="label-text-alt text-red-300 mt-2">{alertText3}</div>}
				</div>

				{/* Поле Адрес */}
				<div className="form-control mt-3">
					<label className="label">
						<span className="label-text">Адрес мастерской</span>
						<span className="label-text-alt">Обязательное поле</span>
					</label>
					<input
						type="text"
						name="address"
						value={formData.address}
						onChange={handleChange}
						className="input input-bordered bg-white"
						placeholder="Введите ваш адрес"
					/>
				</div>
				{/* Ошибка отображения */}
				{alertActive2 && <div className="label-text-alt text-red-300 mt-2">{alertText2}</div>}

				{/* Поле Название мастерской */}
				<div className="form-control mt-3">
					<label className="label">
						<span className="label-text">Название мастерской</span>
						<span className="label-text-alt">Необязательное поле</span>
					</label>
					<input
						type="text"
						name="workshop"
						value={formData.workshop}
						onChange={handleChange}
						className="input input-bordered bg-white"
						placeholder="Введите название мастерской"
					/>
				</div>


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
