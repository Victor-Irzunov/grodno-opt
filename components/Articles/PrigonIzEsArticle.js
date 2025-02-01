import phoneNumbers from "@/config/config";
import Image from "next/image";
import BtnComp from "../btn/BtnComp";


const PrigonIzEsArticle = () => {

	const cardData = [
		{
			title: "Европейские дилеры и аукционы",
			text: "Мы работаем с европейскими официальными дилерами, с электронными торговыми площадками и аукционами.",
		},
		{
			title: "Проверка и безопасность",
			text: "Поиск, проверка и доставка автомобиля из любого региона Европы. Мы занимаемся этим более 15 лет, обеспечивая качество и безопасность.",
		},
		{
			title: "Большой опыт",
			text: "Наш опыт работы с автомобилями из Европы насчитывает множество успешных сделок. Мы знаем все особенности и нюансы доставки.",
		},
		{
			title: "Популярные бренды",
			text: "У нас вы можете заказать все популярные европейские бренды, включая премиальные: Audi, BMW, Mercedes-Benz, Porsche, Bentley, Rolls-Royce, Lamborghini, Ferrari и другие.",
		},
	];


	return (
		<article className="sd:mt-20 xz:mt-10 bg-white/95 text-secondary sd:px-8 xz:px-3 py-14 rounded-3xl">
			<div className='container mx-auto text-secondary'>
				<h2 className="sd:text-5xl xz:text-2xl font-semibold">
					Пригнать авто из Европы?
				</h2>

				<p className='mt-7'>
					Компания «AvtoCar» является экспертом по подбору и доставке автомобилей из Европы. Мы специализируемся на поиске как новых, так и подержанных автомобилей, включая эксклюзивные модели и машины, заказанные под индивидуальные параметры. Наша команда тщательно проверяет каждый автомобиль на соответствие заявленным характеристикам, техническому состоянию и юридической чистоте, работая только с проверенными дилерами, торговыми площадками и аукционами.
				</p>
				<p className='mt-6'>
					С нами вы можете быть уверены в прозрачности процесса: от первичного подбора автомобиля до его доставки к вам. Мы предлагаем полный комплекс услуг "под ключ", включающий в себя логистику, оформление документов и помощь на всех этапах сделки, чтобы процесс покупки автомобиля из Европы был для вас максимально удобным и безопасным.
				</p>

				<div className="mt-12">

					<div className=''>
						<h3 className="mt-6 sd:text-4xl xz:text-2xl font-semibold">
							Доставка автомобилей из Европы: Автосалон «АвтоКар»
						</h3>
						<div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-8 relative mt-8">
							<div className="sd:col-span-2 xz:col-span-1">
								{cardData.map((card, index) => (
									<div key={index} className="card card-body bg-white shadow-lg mt-8">
										<h4 className="sd:text-3xl xz:text-xl font-semibold text-secondary">
											{card.title}
										</h4>
										<p className="mt-4 text-gray-500">
											{card.text}
										</p>
									</div>
								))}
							</div>
							<div className="sd:inline xz:hidden justify-end items-end">
								<Image
									src="/fon/avto-png.webp"
									className="sticky top-10 rotate-180"
									alt="Доставка автомобилей из Европы"
									width={300}
									height={300}
								/>
							</div>
						</div>
					</div>


					<div className='sd:py-24 xz:py-9 text-center mt-7 sd:max-w-2xl xz:max-w-full mx-auto'>
						<h3 className='sd:text-5xl xz:text-3xl font-semibold'>
							Средний срок доставки автомобилей из Европы от 30 календарных дней
						</h3>
						<p className='mt-7'>
							Остались вопросы звоните по тел.: <a href={`tel:${phoneNumbers.mainPhoneLink}`} className='font-semibold'>{phoneNumbers.mainPhone}</a> или оставляйте заявку и наши специалисты ответят на все интересующие вопросы.
						</p>
					</div>


					<div className='grid sd:grid-cols-2 xz:grid-cols-1 sd:gap-16 xz:gap-4 sd:my-8 xz:mt-6 sd:py-16 xz:py-0'>

						<div className='p-10 rounded-full flex justify-center items-center bg-blue-300 sd:order-1 xz:order-2'>
							<Image src='/fon/evro.webp' alt='Стоимость пригона авто из Европы' width={500} height={500} />
						</div>

						<div className='sd:order-2 xz:order-1'>
							<p className='text-[#0000FF]'>
								1500 бел. руб.
							</p>
							<h3 className='sd:text-5xl xz:text-3xl font-semibold sd:mt-6 xz:mt-3'>
								Стоимость пригона авто из Европы идет в зачет стоимости автомобиля
							</h3>
							<p className='mt-4'>
								Если мы не смогли подобрать автомобиль под ваши параметры, вы в праве расторгнуть договор и сумма услуги возвращается в полном объеме.
							</p>
							<p className='mt-4'>
								Остались вопросы звоните по тел.: <a href={`tel:${phoneNumbers.mainPhoneLink}`} className='font-semibold'>{phoneNumbers.mainPhone}</a> или оставляйте заявку и наши специалисты ответят на все интересующие вопросы.
							</p>
						</div>
					</div>


					<div className='grid sd:grid-cols-2 xz:grid-cols-1 sd:gap-16 xz:gap-4 sd:my-8 xz:my-0 py-24'>
						<div className=''>
							<h3 className='sd:text-5xl xz:text-3xl font-semibold'>
								Автомобили с НДС под заказ для юридических лиц
							</h3>
							<p className='mt-8 text-gray-500'>
								Подробнее по телелфону: <a href={`tel:${phoneNumbers.mainPhoneLink}`} className='font-semibold sd:inline-block xz:block'>{phoneNumbers.mainPhone}</a>
							</p>
						</div>

						<div className='relative'>
							<p className='sd:text-[200px] xz:text-8xl font-bold text-primary text-center'>
								НДС
							</p>
							<Image
								className="absolute sd:top-10 xz:-top-2"
								src='/fon/avto2-png.webp'
								alt='Стоимость пригона авто из Европы'
								width={700} height={700}
							/>
						</div>
					</div>

					<div className='grid sd:grid-cols-2 xz:grid-cols-1 gap-4 sd:mt-32 xz:mt-28'>

						<div className=''>
							<Image src='/fon/fon10.webp' alt='Пригон авто из Европы' className="rounded-xl" width={594} height={325} />
						</div>

						<div className='bg-gray-400 p-3 text-secondary rounded-xl'>
							<div className="relative bg-white border rounded-xl p-4 text-left shadow-md">
								<div className="font-semibold">Нужна дополнительная информация по пригону авто из Европы?</div>
								<p className="text-gray-700">Я с удовольствием проконсультирую Вас по телефону.</p>
								<div className="absolute -bottom-2 left-10 w-4 h-4 bg-white  rotate-45"></div>
							</div>
							<div className='flex sd:space-x-6 xz:space-x-3 sd:mt-0 xz:mt-3 sd:p-5 xz:p-3'>
								<div className=''>
									<Image
										src='/fon/fon5.webp'
										alt='Менеджер доставке авто из Европы' width={80} height={80}
										className="rounded-full"
									/>
								</div>
								<div className=''>
									<p className='font-semibold sd:text-base xz:text-xs'>
										Менеджер по доставке авто
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

export default PrigonIzEsArticle;
