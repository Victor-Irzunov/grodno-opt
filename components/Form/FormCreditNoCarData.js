"use client"
import { useEffect, useState } from "react";
import { DatePicker, ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/ru_RU';
import { sendOrderTelegram } from "@/http/telegramAPI";
import { dollarExchangeRate } from "@/Api-bank/api";
import phoneNumbers from "@/config/config";
import Image from "next/image";

const getYearSuffix = (years) => {
	if (years <= 1) return 'год';
	if (years >= 2 && years <= 4) return 'года';
	return 'лет';
};

const FormCreditNoCarData = ({ title = 'Кредитный калькулятор', srok = 'Срок кредитования', title2 = 'Кредит', lizing }) => {
	const [creditTerm, setCreditTerm] = useState(4);
	const [initialPayment, setInitialPayment] = useState('');
	const [officialSalary, setOfficialSalary] = useState('');
	const [currentCreditPayment, setCurrentCreditPayment] = useState('');
	const [childrenCount, setChildrenCount] = useState('');
	const [monthlyPayment, setMonthlyPayment] = useState('');
	const [priceAuto, setPriceAuto] = useState('');
	const [dollar, setDollar] = useState(null);
	const [isActive, setIsActive] = useState(false);
	const [formData, setFormData] = useState({
		surname: '',
		phone: '',
		name: '',
		email: '',
		middleName: '',
		birthDate: '',
		gender: '',
		maritalStatus: '',
		conviction: '',
		driverLicense: '',
		incomeCertificate: '',
		jobExperience: '',
		jobPlace: ''
	});

	useEffect(() => {
		dollarExchangeRate().then(data => {
			setDollar(data.data.Cur_OfficialRate);
		});
	}, []);

	const calculateMonthlyPayment = () => {
		const loanAmount = parseFloat(priceAuto || 0) - parseFloat(initialPayment || 0);
		const months = creditTerm * 12;
		if (months > 0) {
			const monthly = loanAmount / months;
			setMonthlyPayment(monthly.toFixed(2));
		} else {
			setMonthlyPayment('');
		}
	};

	useEffect(() => {
		calculateMonthlyPayment();
	}, [priceAuto, creditTerm, initialPayment]);

	const handleCreditTermChange = (e) => {
		setCreditTerm(parseInt(e.target.value, 10));
	};

	const handleChildrenCountChange = (e) => {
		setChildrenCount(e.target.value);
	};

	const handleDateChange = (date, dateString) => {
		setFormData((prevData) => ({
			...prevData,
			birthDate: dateString,
		}));
	};

	const handleChange = (e) => {
		if (e.target && e.target.name) {
			const { name, value } = e.target;
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	const resetForm = () => {
		setCreditTerm(4);
		setInitialPayment('');
		setOfficialSalary('');
		setCurrentCreditPayment('');
		setChildrenCount('');
		setMonthlyPayment('');
		setPriceAuto('');
		setFormData({
			surname: '',
			phone: '',
			name: '',
			email: '',
			middleName: '',
			birthDate: '',
			gender: '',
			maritalStatus: '',
			conviction: '',
			driverLicense: '',
			incomeCertificate: '',
			jobExperience: '',
			jobPlace: ''
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const dataToSend = {
			...formData,
			creditTerm,
			initialPayment,
			officialSalary,
			currentCreditPayment,
			childrenCount,
			priceUSD: priceAuto,
			priceBYN: (priceAuto * dollar).toFixed(1),
		};

		let messageForm = `<b>Заявка на ${title2} без авто с сайта Автосалона:</b>\n`;
		messageForm += `<b>Цена авто:</b> ${priceAuto} USD\n`;
		messageForm += `<b>Ежемесячный платеж:</b> ${monthlyPayment} USD / ${(monthlyPayment * dollar).toFixed(1)} BYN\n`;

		// Данные клиента
		messageForm += `<b>Фамилия:</b> ${formData.surname || 'Не указано'}\n`;
		messageForm += `<b>Имя:</b> ${formData.name || 'Не указано'}\n`;
		messageForm += `<b>Отчество:</b> ${formData.middleName || 'Не указано'}\n`;
		messageForm += `<b>Телефон:</b> <a href='tel:${formData.phone}'>${formData.phone || 'Не указано'}</a>\n`;
		messageForm += `<b>E-mail:</b> ${formData.email || 'Не указано'}\n`;
		messageForm += `<b>Дата рождения:</b> ${formData.birthDate || 'Не указано'}\n\n`;

		// Дополнительные данные клиента
		messageForm += `<b>Пол:</b> ${formData.gender === 'male' ? 'Мужской' : formData.gender === 'female' ? 'Женский' : 'Не указано'}\n`;
		messageForm += `<b>Семейное положение:</b> ${formData.maritalStatus === 'married' ? 'В браке' : formData.maritalStatus === 'single' ? 'Холост/Не замужем' : 'Не указано'}\n`;
		messageForm += `<b>Судимость:</b> ${formData.conviction === 'yes' ? 'Есть' : formData.conviction === 'no' ? 'Нет' : 'Не указано'}\n`;
		messageForm += `<b>Количество детей до 18 лет:</b> ${childrenCount || 'Не указано'}\n`;
		messageForm += `<b>Наличие водительского удостоверения:</b> ${formData.driverLicense === 'yes' ? 'Есть' : formData.driverLicense === 'no' ? 'Нет' : 'Не указано'}\n`;
		messageForm += `<b>Наличие справки о доходах:</b> ${formData.incomeCertificate === 'yes' ? 'Есть' : formData.incomeCertificate === 'no' ? 'Нет' : 'Не указано'}\n`;
		messageForm += `<b>Место работы:</b> ${formData.jobPlace || 'Не указано'}\n`;
		messageForm += `<b>Стаж работы:</b> ${formData.jobExperience || 'Не указано'} лет\n\n`;

		// Финансовые данные
		messageForm += `<b>Срок кредитования:</b> ${creditTerm} ${getYearSuffix(creditTerm)}\n`;
		messageForm += `<b>Первоначальный взнос:</b> ${initialPayment || 'Не указано'} BYN\n`;
		messageForm += `<b>Официальная зарплата:</b> ${officialSalary || 'Не указано'} BYN\n`;
		messageForm += `<b>Платежи по действующему кредиту:</b> ${currentCreditPayment || 'Не указано'} BYN\n`;

		try {
			const response = await sendOrderTelegram(messageForm);
			resetForm();
			setIsActive(true)
			setTimeout(() => {
				setIsActive(false)
			}, 5000)
			if (response.ok) {
				window.location.href = '/thank-you';
			}
		} catch (error) {
			alert("Ошибка при отправке данных.");
		}
	};

	return (
		<div className="mt-10">
			<form onSubmit={handleSubmit} className='text-white'>

				<div className=''>
					<div className='bg-blue-800/50 py-8 sd:px-8 xz:px-4 rounded-3xl'>
						<h2 className="text-center text-3xl font-semibold mb-6">{title}</h2>
						<div className="space-y-4 mt-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<input type="text" required name="surname" placeholder="Фамилия" className="input input-bordered w-full bg-white text-black rounded-full" onChange={handleChange} />
								<input type="text" required name="name" placeholder="Имя" className="input input-bordered w-full bg-white text-black rounded-full" onChange={handleChange} />
								<input type="text" required name="middleName" placeholder="Отчество" className="input input-bordered w-full bg-white text-black rounded-full" onChange={handleChange} />
								<input type="text" required name="phone" placeholder="Телефон" className="input input-bordered w-full bg-white text-black rounded-full" onChange={handleChange} />
								<input type="email" required name="email" placeholder="E-mail" className="input input-bordered w-full bg-white text-black rounded-full" onChange={handleChange} />
								<ConfigProvider locale={locale}>
									<DatePicker onChange={handleDateChange} name="birthDate" placeholder="дд/мм/гггг" format="DD/MM/YYYY" className="input input-bordered w-full bg-white text-black rounded-full font-bold cursor-pointer" />
								</ConfigProvider>
							</div>

							{/* Пол, семейное положение, судимость */}
							<div className="space-y-4">
								<div className='grid sd:grid-cols-2 xz:grid-cols-1 gap-4'>
									<div className='space-y-4'>
										<div className="flex flex-col space-y-3">
											<span>Пол:</span>
											<label className="flex items-center space-x-2">
												<input type="radio" name="gender" value="male" className="radio radio-primary" onChange={handleChange} />
												<span>Мужской</span>
											</label>
											<label className="flex items-center space-x-2">
												<input type="radio" name="gender" value="female" className="radio radio-primary" onChange={handleChange} />
												<span>Женский</span>
											</label>
										</div>
										<div className="flex flex-col space-y-3">
											<span>Семейное положение:</span>
											<label className="flex items-center space-x-2">
												<input type="radio" name="maritalStatus" value="married" className="radio radio-primary" onChange={handleChange} />
												<span>В браке</span>
											</label>
											<label className="flex items-center space-x-2">
												<input type="radio" name="maritalStatus" value="single" className="radio radio-primary" onChange={handleChange} />
												<span>Холост/Не замужем</span>
											</label>
										</div>
									</div>

									<div className=''>
										<div className="flex flex-col space-y-3">
											<span>Судимость:</span>
											<label className="flex items-center space-x-2">
												<input type="radio" name="conviction" value="no" className="radio radio-primary" onChange={handleChange} />
												<span>Нет</span>
											</label>
											<label className="flex items-center space-x-2">
												<input type="radio" name="conviction" value="yes" className="radio radio-primary" onChange={handleChange} />
												<span>Есть</span>
											</label>
										</div>

										<div className="flex flex-col space-y-3 mt-5">
											<span>Кол-во детей до 18 лет:</span>
											<input type="number" value={childrenCount} onChange={handleChildrenCountChange} className="input input-bordered bg-white text-black w-40 rounded-full" />
										</div>
									</div>
								</div>
							</div>

							{/* Водительское удостоверение, справка о доходах */}
							<div className='grid sd:grid-cols-2 xz:grid-cols-1 gap-4'>
								<div className="flex flex-col xz:space-y-3">
									<span>Наличие водительского удостоверения:</span>
									<label className="flex items-center space-x-2">
										<input type="radio" name="driverLicense" value="no" className="radio radio-primary" onChange={handleChange} />
										<span>Нет</span>
									</label>
									<label className="flex items-center space-x-2">
										<input type="radio" name="driverLicense" value="yes" className="radio radio-primary" onChange={handleChange} />
										<span>Есть</span>
									</label>
								</div>
								<div className="flex flex-col xz:space-y-3">
									<span>Наличие справки о доходах:</span>
									<label className="flex items-center space-x-2">
										<input type="radio" name="incomeCertificate" value="no" className="radio radio-primary" onChange={handleChange} />
										<span>Нет</span>
									</label>
									<label className="flex items-center space-x-2">
										<input type="radio" name="incomeCertificate" value="yes" className="radio radio-primary" onChange={handleChange} />
										<span>Есть</span>
									</label>
								</div>
							</div>

							{/* Место работы и стаж */}
							<div className='grid sd:grid-cols-2 xz:grid-cols-1 gap-4'>
								<input type="text" name="jobPlace" placeholder="Место работы" className="input input-bordered w-full bg-white text-black rounded-full" onChange={handleChange} />
								<input type="number" name="jobExperience" placeholder="Стаж работы" className="input input-bordered w-full bg-white text-black rounded-full" onChange={handleChange} />
							</div>

							{/* Официальная зарплата и платежи по кредиту */}
							<div className="grid sd:grid-cols-2 xz:grid-cols-1 gap-4">
								<div className="flex flex-col items-center">
									<span>Официальная зарплата</span>
									<input type="number" value={officialSalary} onChange={(e) => setOfficialSalary(e.target.value)} className="input input-bordered w-full bg-white text-black rounded-full" />
									<span className="ml-2">BYN</span>
								</div>
								<div className="flex flex-col items-center">
									<span>Платежи по действующему кредиту</span>
									<input type="number" value={currentCreditPayment} onChange={(e) => setCurrentCreditPayment(e.target.value)} className="input input-bordered w-full bg-white text-black rounded-full" />
									<span className="ml-2">BYN</span>
								</div>
							</div>

						</div>
					</div>

					<div className="space-y-5 mt-10">
						<div className=''>
							<span className="">Стоимость авто:</span>
							<div className='mt-2'>
								<input type="number" value={priceAuto} onChange={(e) => setPriceAuto(e.target.value)} className="input input-bordered bg-white text-black w-full rounded-full" placeholder="USD" />
							</div>
						</div>

						<div className="">
							<span>{srok}</span>
							<div className='flex flex-col mt-2'>
								<input
									type="range"
									min={1}
									max={`${lizing ? '7' : '10'}`}
									value={creditTerm}
									onChange={handleCreditTermChange}
									className="range"
									step="1"
								/>
								<div className="flex w-full justify-between px-2 text-xs">
									{Array.from({ length: lizing ? 7 : 10 }).map((_, i) => (
										<span key={i}>|</span>
									))}
								</div>
							</div>
							<span className="text-primary">
								{creditTerm} {getYearSuffix(creditTerm)}
							</span>
						</div>

						<div className=''>
							<span className="">Первоначальный взнос:</span>
							<div className='mt-2'>
								<input type="number" value={initialPayment} onChange={(e) => setInitialPayment(e.target.value)} className="input input-bordered bg-white text-black w-full rounded-full" placeholder="BYN" />
							</div>
						</div>

						<div className='xz:text-lg sd:text-xl'>
							<span className="">Ежемесячный платеж:</span>
							<span className="text-primary font-bold ml-2 sd:inline-block xz:block">
								{monthlyPayment} USD / {(monthlyPayment * dollar).toFixed(1)} BYN
							</span>
						</div>
					</div>

					<div className='flex space-x-6 mt-12'>
						<div className=''>
							<button type="submit" className="btn btn-primary text-white rounded-full">
								Отправить заявку
							</button>
						</div>
					</div>
				</div>
			</form>


			<div className="dropdown dropdown-top text-white mt-12 w-full">
				<button
					tabIndex={0}
					className="btn rounded-full btn-outline btn-primary w-full"
				>
					Позвонить
				</button>

				<div
					tabIndex={0}
					className={`dropdown-content bg-[#2D3192] z-30 px-6 py-8 shadow-slate-400 w-[300px] text-center rounded-xl`}
				>
					<div>
						<Image
							src="/logo/logo2.webp"
							alt="Логотип - продажа авто в кредит и лизинг"
							width={120}
							height={120}
							className="mx-auto"
						/>
					</div>
					<p className="text-xl">Мы в Минске</p>
					<div className="mt-5">
						<Image
							src="/svg/location-white.svg"
							alt="Адрес автосалона"
							width={30}
							height={30}
							className="mx-auto mb-2"
						/>
						<a
							href="https://yandex.by/maps/-/CDdkfUlz"
							target="_blank"
							className="mt-2 text-sm"
						>
							Минск, ул. Куйбышева 40, <br />
							Паркинг 4 этаж
						</a>
					</div>
					<div className="mt-5">
						<Image
							src="/svg/phone-white.svg"
							alt="Телефон автосалона"
							width={25}
							height={25}
							className="mx-auto mb-2"
						/>
						<a
							href={`tel:${phoneNumbers.secondaryPhoneLink}`}
							className="font-light"
						>
							{phoneNumbers.secondaryPhone} МТС
						</a>
						<a
							href={`tel:${phoneNumbers.mainPhoneLink}`}
							className="font-light mt-2 block"
						>
							{phoneNumbers.mainPhone} A1
						</a>
					</div>
				</div>

			</div>


			{
				isActive ?
					<div role="alert" className="alert alert-success fixed max-w-80 z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>Ваша заявка успешно отправлена!</span>
					</div>
					:
					null
			}
		</div>
	);
};

export default FormCreditNoCarData;
