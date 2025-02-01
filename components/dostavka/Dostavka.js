const Dostavka = () => {
	return (
		<section className="bg-white relative py-16" id="dostavka">
			<div className='container mx-auto'>
				<div className='border-b-4 border-primary pb-4'>
					<h4 className='text-4xl'>
						Доставка
					</h4>
				</div>

				<div className='mt-10'>
					<h5 className='text-primary font-semibold text-2xl'>
						Осуществляем доставку по Минской области
					</h5>

					<p className='mt-5'>
						Мы осуществляем бесплатную доставку в любой город или деревню Минской области.
					</p>

					<ul className='mt-4 sd:pl-5 xz:pl-1'>
						<li className='mb-2'>
							<p className="font-semibold">
								Дополнительная информация:
							</p>
							<div className='sd:pl-5 xz:pl-3'>
								<p className=''>
									• Средний срок доставки по Минской области – 3 дня.
								</p>
								<p className=''>
									• Средний срок доставки по г. Минску – 2 дня.
								</p>
								<p className='mt-2'>
									Не стесняйтесь обращаться к нашим специалистам для уточнения всех деталей. Мы готовы помочь вам сделать правильный выбор и предоставить наилучший сервис доставки.
								</p>
							</div>
						</li>

						<li className='mb-2'>
							<p className="font-semibold">
								Условия доставки:
							</p>
							<div className='sd:pl-5 xz:pl-3'>
								<p className='mt-2'>
									Пожалуйста, обращайтесь к нашим менеджерам для уточнения условий доставки. Мы готовы предложить вам индивидуальный подход, который может отличаться от стандартных условий.
								</p>
							</div>
						</li>

						<li className='mb-2'>
							<p className="font-semibold">
								Самовывоз:
							</p>
							<div className='sd:pl-5 xz:pl-3'>
								<p className='mt-2'>
									Если вы предпочитаете забрать товар самостоятельно, мы рады предложить вам эту возможность. Наше производство открыто для вас в удобное время:
								</p>
								<p className=''>
									• Работаем без выходных с 8:00 до 20:00.
								</p>
							</div>
						</li>

						<li className='mb-2'>
							<p className="font-semibold">
								Замеры:
							</p>
							<div className='sd:pl-5 xz:pl-3'>
								<p className='mt-4'>
									• При сложных заказах мы бесплатно выезжаем на замеры.
								</p>
								<p className='mt-2'>
									• При простых заказах заказчик может самостоятельно предоставить размеры.
								</p>
							</div>
						</li>

					</ul>
				</div>
			</div>
		</section>
	)
}

export default Dostavka