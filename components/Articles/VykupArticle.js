import phoneNumbers from "@/config/config";
import Image from "next/image";
import BtnComp from "../btn/BtnComp";


const VykupArticle = () => {
	return (
		<article className="sd:mt-20 xz:mt-10 bg-white/95 text-secondary sd:px-8 xz:px-3 py-14 rounded-3xl">
			<div className='container mx-auto'>
				<h2 className="sd:text-5xl xz:text-2xl font-semibold">
					Выкупим автомобиль в Минске и Минской области
				</h2>

				<div className="mt-6">

					<h3 className="mt-6 text-2xl font-semibold">
						Преимущества выкупа авто в автосалоне «AvtoCar»:
					</h3>

					<div className='grid sd:grid-cols-3 xz:grid-cols-1 gap-4 mt-7'>

						<div className='card bg-[#0000FF] text-white shadow-xl'>
							<div className="card-body items-center text-center">
								<Image src='/svg/to-gray.svg' alt='Выкупаем авто в любом состоянии' width={70} height={70} />
								<p className='uppercase'>
									Выкупаем авто в любом состоянии
								</p>
								<p className='text-sm'>
									Делаем максимально выгодное предложение от рынка
								</p>
							</div>
						</div>

						<div className='card bg-white text-[#0000FF] shadow-xl'>
							<div className="card-body items-center text-center">
								<Image src='/svg/car-sales.svg' alt='Выкуп авто в день обращения' width={70} height={70} />
								<p className='uppercase'>
									Выкуп авто в день обращения
								</p>
								<p className='text-sm'>
									Оцениваем авто с учетом внешнего вида и технического состояния
								</p>
							</div>
						</div>

						<div className='card bg-[#0000FF] text-white shadow-xl'>
							<div className="card-body items-center text-center">
								<Image src='/svg/garantiya.svg' alt='Юридическое сопровождение сделки' width={70} height={70} />
								<p className='uppercase'>
									Юридическое сопровождение сделки
								</p>
								<p className='text-sm'>
									Быстрая и безопасная продажа автомобиля за 30-40 минут
								</p>
							</div>
						</div>
					</div>

					<h3 className="mt-12 sd:text-3xl xz:text-2xl font-semibold">
						Процесс выкупа автомобиля:
					</h3>
					<ol className="list-inside mt-4">
						<li className="mb-3">
							<span className="sd:text-xl xz:text-base uppercase font-bold text-[#0000FF]">1. Заявка на выкуп авто:</span>
							<p className='mt-1'>
								Позвоните в автосалон «AvtoCar»
								по телефону{' '}
								<a href={`tel:${phoneNumbers.mainPhoneLink}`} className=''>
									{phoneNumbers.mainPhone}
								</a>{' '}
								или посетите нас по адресу: Минск, ул. Куйбышева 40, Паркинг 4 этаж
							</p>
						</li>
						<li className="mb-3">
						<span className="sd:text-xl xz:text-base uppercase font-bold text-[#0000FF]">2. Осмотр и оценка:</span>
							<p className='mt-1'>
								10-15 минут осмотр вашего авто
							</p>
						</li>
						<li className="mb-3">
						<span className="sd:text-xl xz:text-base uppercase font-bold text-[#0000FF]">3. Оформление документов:</span>
							<p className='mt-1'>
								После согласования стоимости автомобиля, заключаем договор купли-продажи
							</p>
						</li>
						<li className="mb-3">
						<span className="sd:text-xl xz:text-base uppercase font-bold text-[#0000FF]">4. Выплата денег:</span>
							<p className='mt-1'>
								Рассчитываемся с вами на месте, наличными или по безналичному расчету
							</p>
						</li>

					</ol>

					<p className="mt-12 text-primary">
						Быстрый выкуп автомобиля в автосалон «АвтоКар» — это надежный и
						быстрый способ продать ваше авто с минимальными усилиями. Наши
						специалисты готовы проконсультировать вас по всем вопросам и помочь
						сделать правильный выбор.
					</p>

					<p className="mt-4">
						Для получения дополнительной информации свяжитесь с нами по телефону
						<a href={`tel:${phoneNumbers.mainPhoneLink}`} className='mt-1 block'>
							{phoneNumbers.mainPhone}
						</a> или посетите наш автосалон по адресу: Минск, ул. Куйбышева 40, Паркинг 4 этаж.
					</p>

					<div className='grid sd:grid-cols-2 xz:grid-cols-1 gap-4 mt-8'>

						<div className=''>
							<Image src='/fon/fon10.webp' alt='Выкуп авто' className="rounded-xl" width={594} height={325} />
						</div>

						<div className='bg-gray-400 p-3 text-secondary rounded-xl'>
							<div className="relative bg-white border rounded-xl p-4 text-left shadow-md">
								<div className="font-semibold">Нужна дополнительная информация по продаже авто?</div>
								<p className="text-gray-700">Я с удовольствием проконсультирую Вас по телефону.</p>
								<div className="absolute -bottom-2 left-10 w-4 h-4 bg-white  rotate-45"></div>
							</div>
							<div className='flex sd:space-x-6 xz:space-x-3 sd:mt-0 xz:mt-3 sd:p-5 xz:p-3'>
								<div className=''>
									<Image
										src='/fon/fon5.webp'
										alt='Менеджер по выкупу авто' width={80} height={80}
										className="rounded-full"
									/>
								</div>
								<div className=''>
									<p className='font-semibold sd:text-base xz:text-xs'>
										Менеджер по выкупу авто
									</p>
									<p className='text-gray-700'>
										Максим
									</p>
									<div className=''>
										<a href={`tel:${phoneNumbers.mainPhoneLink}`} className='sd:text-base xz:text-sm mt-1 block'>
											{phoneNumbers.mainPhone}
										</a>
									</div>
									<div className='mt-5'>
										<BtnComp title='Оставить заявку' index={199} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default VykupArticle;
