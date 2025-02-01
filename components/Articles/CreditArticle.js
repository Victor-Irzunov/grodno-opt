import phoneNumbers from "@/config/config";


const CreditArticle = () => {

	return (
		<article className='bg-white/85 text-secondary py-8 rounded-3xl'>
			<div className='container mx-auto'>
				<h2 className='text-2xl font-bold mb-4'>Купить машину в кредит</h2>
				<h3 className='text-xl font-semibold mb-2'>Автокредит на автомобиль (мотоцикл) | Автосалон «АвтоКар»</h3>
				<p className='mb-4'>
					Иметь собственный автомобиль – мечта многих людей. Обладание личным транспортным средством дает неоспоримые преимущества:
				</p>
				<ul className='list-disc pl-6 mb-4'>
					<li>Перемещаясь по городу, вы не зависите от расписания общественного транспорта, его состояния, скорости передвижения.</li>
					<li>Выбирая интересные места для поездки по стране или за рубежом, ориентируетесь исключительно на свои предпочтения и возможности, а не маршруты автобусов, поездов.</li>
					<li>Можете уехать по делам/для развлечения в любое время суток, на любое расстояние.</li>
					<li>И множество других плюсов, понять которые смогут непосредственно автомобилисты.</li>
				</ul>
				<p className='mb-4'>
					Но что делать, если для покупки вожделенной машины не хватает денег? Некоторые люди выберут копить и ждать. Мы же предлагаем лучший вариант: взять кредит в наших банках-партнерах и купить авто в компании VION в ближайшее время!
				</p>
				<h4 className='text-lg font-semibold mb-2'>Наши банки-партнеры:</h4>
				<ul className='list-none mb-4'>
					<li>ОАО «Сбер Банк», УНП 100219673 — Процентная ставка от 13.5% годовых!</li>
					<li>ЗАО «МТБанк», УНП 100394906 — Процентная ставка от 14.61% годовых!</li>
					<li>ЗАО Банк ВТБ (Беларусь), УНП 101165625 — Процентная ставка от 14.61% годовых!</li>
				</ul>
				<h4 className='text-lg font-semibold mb-2'>Почему стоит обращаться к нам:</h4>
				<p className='mb-4'>Преимущества наших банков-партнеров:</p>
				<ul className='list-disc pl-6 mb-4'>
					<li>Не платите первоначальный взнос, зато машину или деньги забираете сразу же после официального оформления.</li>
					<li>Выдаются суммы до 40 000 BYN и выше! При сумме до 10 000 BYN справка о доходах не требуется.</li>
					<li>Срок выплат от 1 года до 7 лет.</li>
					<li>Досрочное погашение без штрафов.</li>
					<li>Адекватная процентная ставка.</li>
				</ul>
				<p className='mb-4'>Сотрудничество с нами совершается на выгодных для вас условиях:</p>
				<ul className='list-disc pl-6 mb-4'>
					<li>Наши действия и договоры абсолютно прозрачны для клиентов – нет лишних комиссий, переплат, пунктов «мелким шрифтом» и т.д.</li>
					<li>Получаете вежливое и профессиональное обслуживание: консультанты ответят на любые вопросы касательно кредита, помогут с выбором модели и быстро оформят бумаги.</li>
					<li>Специальная бесплатная услуга для клиентов из других городов – забираем вас в Минске и привозим в наш офис для заключения сделки.</li>
				</ul>
				<p className='font-semibold text-center'>
					Звоните и заказывайте автокредит в  по тел.:
				</p>
				<div className='flex flex-col justify-center items-center mt-6 text-primary'>
					<a href={`tel:${phoneNumbers.secondaryPhoneLink}`} className='font-light'>
						{phoneNumbers.secondaryPhone}
					</a>
					<a href={`tel:${phoneNumbers.mainPhoneLink}`} className='font-light mt-2 block'>
						{phoneNumbers.mainPhone}
					</a>
				</div>
			</div>
		</article>
	);
};

export default CreditArticle;
