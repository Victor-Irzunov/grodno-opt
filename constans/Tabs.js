export const tabsContent = [
	{
		label: `Как купить`,
		key: 1,
		children: (<div className='sd:text-sm xz:text-xs'>
			<p className='mb-1'>Для покупки товара в нашем интернет-магазине выберите понравившийся товар и добавьте его в корзину. Далее перейдите в Корзину и нажмите на «Оформить заказ» или «Быстрый заказ».</p>
			<p className='mb-1'>Когда оформляете быстрый заказ, напишите ФИО, телефон и e-mail. Вам перезвонит менеджер и уточнит условия заказа. По результатам разговора вам придет подтверждение оформления товара на почту или через СМС. Теперь останется только ждать доставки и радоваться новой покупке.</p>
			<p className=''>Оформление заказа в стандартном режиме выглядит следующим образом. Заполняете полностью форму по последовательным этапам: адрес, способ доставки, оплаты, данные о себе. Советуем в комментарии к заказу написать информацию, которая поможет курьеру вас найти. Нажмите кнопку «Оформить заказ».</p>
		</div>),
	},
	{
		label: `Оплата`,
		key: 2,
		children: (
			<div className='sd:text-sm xz:text-xs'>
				<p>Оплачивайте покупки удобным способом. В интернет-магазине доступно 3 варианта оплаты:</p>
				<ul className='mt-2'>
					<li>1. Наличные при самовывозе или доставке курьером. Специалист свяжется с вами в день доставки, чтобы уточнить время и заранее подготовить сдачу с любой купюры. Вы подписываете товаросопроводительные документы, вносите денежные средства, получаете товар и чек.
					</li>
					<li>2. Безналичный расчет при самовывозе или оформлении в интернет-магазине: карты Visa и MasterCard. Чтобы оплатить покупку, система перенаправит вас на сервер системы ASSIST. Здесь нужно ввести номер карты, срок действия и имя держателя.
					</li>
					<li>3. Электронные системы при онлайн-заказе: PayPal, WebMoney и Яндекс.Деньги. Для совершения покупки система перенаправит вас на страницу платежного сервиса. Здесь необходимо заполнить форму по инструкции.
					</li>
				</ul>
			</div>
		),
	},
	{
		label: `Доставка`,
		key: 3,
		children: (
			<div className='sd:text-sm xz:text-xs'>
				<p>Экономьте время на получении заказа. В интернет-магазине доступно 4 варианта доставки:</p>
				<ul className='mt-3'>
					<li>1. Курьерская доставка работает с 9.00 до 19.00. Когда товар поступит на склад, курьерская служба свяжется для уточнения деталей. Специалист предложит выбрать удобное время доставки и уточнит адрес. Осмотрите упаковку на целостность и соответствие указанной комплектации.
					</li>
					<li>2. Самовывоз из магазина. Список торговых точек для выбора появится в корзине. Когда заказ поступит на склад, вам придет уведомление. Для получения заказа обратитесь к сотруднику в кассовой зоне и назовите номер.
					</li>
					<li>3. Постамат. Когда заказ поступит на точку, на ваш телефон или e-mail придет уникальный код. Заказ нужно оплатить в терминале постамата. Срок хранения — 3 дня.
					</li>
					<li>4. Почтовая доставка через почту России. Когда заказ придет в отделение, на ваш адрес придет извещение о посылке. Перед оплатой вы можете оценить состояние коробки: вес, целостность. Вскрывать коробку самостоятельно вы можете только после оплаты заказа. Один заказ может содержать не больше 10 позиций и его стоимость не должна превышать 100 000 р.
					</li>
				</ul>
			</div>
		),
	},
	{
		label: `Дополнительно`,
		key: 4,
		children: (
			<div className='sd:text-sm xz:text-xs'>
				<p>Дополнительная вкладка, для размещения информации о магазине, доставке или любого другого важного контента. Поможет вам ответить на интересующие покупателя вопросы и развеять его сомнения в покупке. Используйте её по своему усмотрению.</p>
				<p className='mt-3'>Вы можете убрать её или вернуть обратно, изменив одну галочку в настройках компонента. Очень удобно.</p>
				
			</div>
		),
	},
]