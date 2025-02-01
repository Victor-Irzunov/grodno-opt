const LizingArticle = () => {
	return (
		<article className="bg-white/85 text-secondary py-10 rounded-3xl shadow-lg space-y-8">
			<div className='container mx-auto'>
				{/* Main Title */}
				<h2 className="text-3xl font-bold text-blue-600">Лизинг на автомобиль: Автосалон «АвтоКар»</h2>

				{/* First Section */}
				<section className="space-y-2 mt-6">
					<h3 className="text-xl font-semibold">Лизинг на автомобиль</h3>
					<ul className="list-disc pl-5 space-y-1">
						<li>Возможен без трудоустройства в Беларуси (если вы работаете за пределами Беларуси)</li>
						<li>Срок от 1 года до 7 лет</li>
						<li>Авансовый платеж от 0%!</li>
						<li>На любой автомобиль</li>
						<li>Нужен только паспорт</li>
						<li>Одобрение за 30 минут</li>
						<li>Доступные валюты: BYN, USD, EUR, RUB</li>
					</ul>
				</section>

				{/* Leasing Info */}
				<section className="space-y-2 mt-7">
					<h3 className="text-xl font-semibold">Лизинг – выгодный способ купить автомобиль</h3>
					<p className="leading-relaxed">
						Лизинг – аналогичный выгодный способ купить автомобиль, если Вы имеете небольшой официальный доход или работаете за пределами Беларуси! Наши специалисты проконсультируют Вас по всем вопросам, помогут подобрать лучшие условия и лизинговую компанию.
					</p>
				</section>

				{/* Benefits Section */}
				<section className="space-y-2 mt-7">
					<h3 className="text-xl font-semibold">Преимущества покупки авто в лизинг</h3>
					<ul className="list-disc pl-5 space-y-1">
						<li>Предоплата за автомобиль от 0% до 40%</li>
						<li>Возможно без трудоустройства в Беларуси</li>
						<li>Принятие решения по лизингу от 30 минут до 1 дня</li>
						<li>Доступные валюты: BYN, USD, EUR, RUB</li>
						<li>Заявку можно подать в будние и выходные дни</li>
						<li>Возможен досрочный выкуп без штрафов и переплат</li>
					</ul>
				</section>

				{/* Partners Section */}
				<section className="space-y-2 mt-7">
					<h3 className="text-xl font-semibold">Наши партнеры</h3>
					<ul className="list-disc pl-5 space-y-1">
						<li>Микролизинг</li>
						<li>Мого Лизинг</li>
						<li>Твой Лизинг</li>
						<li>Дженерал</li>
						<li>Алфин</li>
						<li>Актив Лизинг</li>
						<li>А-Лизинг</li>
						<li>СберЛизинг</li>
						<li>Эксперт Лизинг</li>
						<li>Автопромлизинг</li>
						<li>Люкс Лизинг</li>
					</ul>
				</section>

				{/* Required Documents */}
				<section className="space-y-2 mt-7">
					<h3 className="text-xl font-semibold">Необходимые документы</h3>
					<p className="leading-relaxed">
						<strong>Для физических лиц:</strong> Действующий общегражданский паспорт (вид на жительство в Республике Беларусь)
					</p>
					<p className="leading-relaxed">
						<strong>Справка о доходах:</strong> Справка о размере получаемого дохода за последние 3 месяца

						<span className="block text-sm text-gray-500 mt-1">* Возможно оформление лизинга без справки о доходах, уточняйте условия по телефонам.</span>
					</p>
					<p className="leading-relaxed">
						<strong>Для ИП (индивидуальных предпринимателей):</strong> Свидетельство о регистрации + копия, Налоговая декларация за последние 6 месяцев или справка из ИМНС об уплате налогов за 6 месяцев, Копия квитанций (платежных поручений) об уплате налога за последние 6 месяцев.
					</p>
				</section>
			</div>
		</article>
	);
};

export default LizingArticle;
