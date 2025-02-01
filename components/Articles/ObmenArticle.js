import phoneNumbers from "@/config/config";
import Image from "next/image";
import BtnComp from "../btn/BtnComp";


const ObmenArticle = () => {
	return (
		<article className="sd:mt-20 xz:mt-10 bg-white/95 text-secondary sd:px-8 xz:px-3 py-14 rounded-3xl">
			<div className='container mx-auto'>
				<h2 className="sd:text-5xl xz:text-2xl font-semibold">
					Обмен автомобиля в Минске
				</h2>

				<div className="mt-6">
					<p>
						Обмен автомобиля по системе Trade-In — это удобный способ обновить
						ваше транспортное средство, не тратя время на самостоятельную продажу
						старого авто. В автосалоне «AvtoCar» в Минске вы можете обменять свой
						текущий автомобиль на любой из представленных в нашем ассортименте.
						Процесс обмена занимает не более часа, что позволяет вам быстро и без
						лишних хлопот пересесть на новый автомобиль.
					</p>

					<h3 className="mt-6 text-2xl font-semibold">
						Преимущества обмена авто в «AvtoCar»:
					</h3>
					<ul className="list-disc list-inside mt-4">
						<li>
							<strong>Оценка по рыночной стоимости:</strong> Наши специалисты
							проведут профессиональную оценку вашего автомобиля, предложив
							справедливую цену с учетом его технического состояния и внешнего
							вида.
						</li>
						<li>
							<strong>Быстрый процесс:</strong> Обмен автомобиля занимает около
							часа, что позволяет вам сэкономить время и сразу же уехать на новом
							авто.
						</li>
						<li>
							<strong>Возможность доплаты:</strong> Если стоимость выбранного вами
							автомобиля превышает цену вашего текущего, вы можете внести доплату.
							Мы также предлагаем оформление кредита на недостающую сумму прямо в
							автосалоне.
						</li>
						<li>
							<strong>Широкий выбор автомобилей:</strong> В нашем автосалоне
							представлен широкий ассортимент автомобилей различных марок и
							моделей, что позволяет выбрать оптимальный вариант, соответствующий
							вашим предпочтениям и бюджету.
						</li>
					</ul>

					<h3 className="mt-6 text-2xl font-semibold">
						Процесс обмена включает следующие шаги:
					</h3>
					<ol className="list-decimal list-inside mt-4">
						<li>
							<strong>Свяжитесь с нами:</strong> Позвоните в автосалон «AvtoCar»
							по телефону{' '}
							<a href={`tel:${phoneNumbers.mainPhoneLink}`} className=''>
								{phoneNumbers.mainPhone}
							</a>{' '}
							или посетите нас по адресу: Минск, ул. Куйбышева 40, Паркинг 4 этаж
						</li>
						<li>
							<strong>Оценка автомобиля:</strong> Привезите свой автомобиль для
							оценки. Наши специалисты проведут детальный осмотр и предложат вам
							справедливую цену.
						</li>
						<li>
							<strong>Выбор нового авто:</strong> Ознакомьтесь с ассортиментом
							автомобилей в нашем автосалоне и выберите подходящую модель.
						</li>
						<li>
							<strong>Оформление сделки:</strong> После согласования всех условий
							мы оформим необходимые документы, и вы сможете сразу же уехать на
							новом автомобиле.
						</li>
					</ol>

					<p className="mt-6">
						Обмен автомобиля по системе Trade-In в Автосалоне «АвтоКар» — это надежный и
						быстрый способ обновить ваш автопарк с минимальными усилиями. Наши
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
							<Image src='/fon/fon4.webp' alt='Обмен авто' className="rounded-xl" width={594} height={325} />
						</div>

						<div className='bg-gray-400 p-3 text-secondary rounded-xl'>
							<div className="relative bg-white border rounded-xl p-4 text-left shadow-md">
								<div className="font-semibold">Нужна дополнительная информация по обмену авто?</div>
								<p className="text-gray-700">Я с удовольствием проконсультирую Вас по телефону.</p>
								<div className="absolute -bottom-2 left-10 w-4 h-4 bg-white  rotate-45"></div>
							</div>
							<div className='flex sd:space-x-6 xz:space-x-3 sd:mt-0 xz:mt-3 sd:p-5 xz:p-3'>
								<div className=''>
									<Image
										src='/fon/fon5.webp'
										alt='Менеджер по обмену авто' width={80} height={80}
										className="rounded-full"
									/>
								</div>
								<div className=''>
									<p className='font-semibold sd:text-base xz:text-xs'>
										Менеджер по обмену
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

export default ObmenArticle;
