"use client";
import { sendOrderTelegram } from '@/http/telegramAPI';
import { useState } from 'react';
import PhoneInput from '@/components/Form/MaskPhone/PhoneInput';

const FormOrder = ({ selectedProduct, closeModal, setIsFormSubmitted, title, btn, no, user }) => {
	const [formData, setFormData] = useState({ phone: '', message: '', question: '', serviceType: '', address: '', email: '', workshop: '' });
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
			setTimeout(() => setAlertActive2(false), 4000);
			return;
		}

		if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			setAlertText3('Введите корректный email');
			setAlertActive3(true);
			setTimeout(() => setAlertActive3(false), 4000);
			return;
		}

		const telDigitsOnly = tel.replace(/\D/g, '');
		if (telDigitsOnly.length !== 12) {
			setAlertText('Введите весь номер телефона в правильном формате: +375 XX XXX-XX-XX');
			setAlertActive(true);
			setTimeout(() => setAlertActive(false), 4000);
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

		sendOrderTelegram(messageForm)
			.then(data => {
				if (data.ok) {
					if (!no) setIsFormSubmitted?.(true);
					setTimeout(() => closeModal?.(), 3000);
				} else {
					console.error('Ошибка отправки формы');
				}
			});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	return (
		<div className={`w-full sd:px-0 ${title ? 'xz:px-5' : 'xz:px-2'} sd:py-2 xz:py-0`}>
			<p className='text-black uppercase font-bold text-center mb-5 text-xl'>
				{title ? 'Напишите нам' : null}
			</p>

			<form className={`text-black ${no ? 'flex items-center sd:flex-row xz:flex-col' : ''}`} onSubmit={handleSubmit}>

				{/* Телефон */}
				<div className="form-control xz:w-full sd:w-auto">
					<label className={`label ${no ? 'hidden' : 'flex'}`}>
						<span className="label-text text-[11px]">Телефон</span>
						<span className="label-text-alt text-[9px]">Обязательное поле</span>
					</label>

					<PhoneInput
						value={tel}
						onChange={setTel}
						setAlertText={setAlertText}
						setAlertActive={setAlertActive}
						bg={false}
					/>

					<div className={`label ${no ? 'pb-0 pt-0' : ''}`}>
						<span className="label-text-alt text-red-300">
							{alertActive ? alertText : ''}
						</span>
					</div>
				</div>

				{/* Email */}
				<div className="form-control mt-3">
					<label className="label">
						<span className="label-text text-[11px]">Email</span>
						<span className="label-text-alt text-[9px]">Обязательное поле</span>
					</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className={`input input-bordered bg-white ${alertActive3 ? 'input-error' : ''} placeholder:text-[12px]`}
						placeholder="Введите ваш email"
					/>
					{alertActive3 && <div className="label-text-alt text-red-300 mt-2">{alertText3}</div>}
				</div>

				{/* Адрес */}
				<div className="form-control mt-3">
					<label className="label">
						<span className="label-text text-[11px]">Адрес мастерской</span>
						<span className="label-text-alt text-[9px]">Обязательное поле</span>
					</label>
					<input
						type="text"
						name="address"
						value={formData.address}
						onChange={handleChange}
						className="input input-bordered bg-white placeholder:text-[12px]"
						placeholder="Введите ваш адрес"
					/>
				</div>
				{alertActive2 && <div className="label-text-alt text-red-300 mt-2">{alertText2}</div>}

				{/* Название мастерской */}
				<div className="form-control mt-3">
					<label className="label">
						<span className="label-text text-[11px]">Название мастерской</span>
						<span className="label-text-alt text-[9px]">Необязательное поле</span>
					</label>
					<input
						type="text"
						name="workshop"
						value={formData.workshop || ''}
						onChange={handleChange}
						className="input input-bordered bg-white placeholder:text-[12px]"
						placeholder="Введите название мастерской"
					/>
				</div>

				{/* Сообщение (опционально) */}
				{!no ? (
					<div className="form-control mt-3">
						<label className="label">
							<span className="label-text text-[11px]">Сообщение</span>
							<span className="label-text-alt text-[9px]">Необязательное поле</span>
						</label>
						<textarea
							name="message"
							value={formData.message}
							onChange={handleChange}
							className="textarea textarea-bordered xz:textarea-sm sd:textarea-lg bg-white placeholder:text-[12px]"
							placeholder="Ваше сообщение"
						/>
					</div>
				) : null}

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
