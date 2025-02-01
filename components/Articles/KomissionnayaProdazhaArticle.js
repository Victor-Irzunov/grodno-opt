import phoneNumbers from "@/config/config";
import Image from "next/image";
import BtnComp from "../btn/BtnComp";

const KomissionnayaProdazhaArticle = () => {
	return (
		<article className="sd:mt-10 xz:mt-10 bg-white/85 text-secondary sd:px-8 xz:px-3 py-14 rounded-3xl">
			<div className='container mx-auto'>
				<h2 className="sd:text-5xl xz:text-2xl font-semibold">
					Комиссионная продажа автомобилей: Автосалон «АвтоКар»
				</h2>

				<div className='mt-5'>
					<p className='sd:text-base xz:text-sm'>
						Продажа автомобиля может превратиться в сложный и длительный процесс, требующий значительных временных и финансовых затрат. Мы понимаем, что вам хочется завершить сделку максимально быстро, выгодно и безопасно. Именно поэтому наша компания предлагает вам полный комплекс услуг по комиссионной продаже авто, которые позволят продать ваш автомобиль быстро, с максимальной выгодой и без лишних хлопот.
					</p>

					<p className='sd:text-base xz:text-sm mt-2'>
						Ежегодно мы успешно находим новых владельцев для более чем 1000 автомобилей. Наш опыт и наработанные связи на рынке позволяют нам предложить вам лучшие условия для продажи. Наша цель — помочь вам не просто продать автомобиль, а продать его на максимально выгодных условиях. Мы работаем так, чтобы вам не пришлось беспокоиться ни о чем, кроме получения денежных средств за вашу машину.
					</p>

					<p className='sd:text-lg xz:text-base mt-2 font-semibold'>
						Мы берем на себя все этапы подготовки и реализации сделки, включая:
					</p>
					<ul className="list-disc list-inside sd:text-base xz:text-sm mt-2">
						<li>Комплексную мойку и чистку автомобиля — ваш автомобиль будет представлен в лучшем виде, что повысит его привлекательность для покупателей.</li>
						<li>Активное рекламное продвижение — мы используем проверенные каналы рекламы, чтобы как можно больше потенциальных клиентов узнали о вашем предложении.</li>
						<li>Безопасное хранение — на время продажи ваш автомобиль будет находиться под нашим присмотром, в безопасных и удобных условиях.</li>
					</ul>

					<p className='sd:text-base xz:text-sm mt-2'>
						И все эти услуги для вас абсолютно бесплатны! Мы покрываем все расходы, чтобы ваша машина продалась как можно быстрее и выгоднее. Вам не нужно беспокоиться о дополнительных тратах на рекламу, обслуживание или хранение автомобиля.
					</p>

					<p className='sd:text-base xz:text-sm mt-2'>
						Кроме того, мы гарантируем полное юридическое сопровождение сделки. Все документы будут оформлены в соответствии с действующим законодательством, что исключает возможные риски и неприятные сюрпризы. Вам не нужно беспокоиться о деталях — наша команда профессионалов позаботится обо всем, от составления договора купли-продажи до передачи автомобиля новому владельцу.
					</p>

					<p className='sd:text-base xz:text-sm mt-2'>
						С нашей помощью вы сможете сэкономить свое время и силы, получить максимальную цену за автомобиль и быть уверенным в безопасности сделки. Мы стремимся сделать процесс продажи вашего авто максимально простым, прозрачным и удобным для вас.
					</p>

				</div>

				<div className='grid sd:grid-cols-3 xz:grid-cols-1 gap-6 mt-9'>

					<div className='sd:col-span-2 xz:col-span-1'>
						<Image src='/fon/fon8.webp' alt=' Комиссионная продажа автомобилей' width={1280} height={853} className="rounded-xl" />
					</div>

					<div className='bg-gray-400 p-3 text-secondary rounded-xl'>
						<div className="relative bg-white border rounded-xl p-4 text-left shadow-md">
							<div className="font-semibold">Нужна дополнительная информация по комиссионной продаже авто?</div>
							<p className="text-gray-700">Я с удовольствием проконсультирую Вас по телефону.</p>
							<div className="absolute -bottom-2 left-10 w-4 h-4 bg-white  rotate-45"></div>
						</div>
						<div className='flex sd:space-x-6 xz:space-x-3 sd:mt-0 xz:mt-3 sd:p-5 xz:p-3'>
							<div className=''>
								<Image
									src='/fon/fon5.webp'
									alt='Менеджер по комиссионной продаже авто' width={80} height={80}
									className="rounded-full"
								/>
							</div>
							<div className=''>
								<p className='font-semibold sd:text-base xz:text-xs'>
									Менеджер по комиссионной продаже
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
		</article>
	);
};

export default KomissionnayaProdazhaArticle;
