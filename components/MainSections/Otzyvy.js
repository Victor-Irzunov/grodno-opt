const reviews = [
	{
		id: 1,
		name: 'Александр Добрый',
		letter: 'A',
		review: 'Приятное впечатление от автосалона! Вежливые сотрудники, помогли быстро оформить кредит и выбрать подходящую машину. Не ожидал, что смогу уехать на ней в тот же день!'
	},
	{
		id: 2,
		name: 'Кирилл Маслов',
		letter: 'K',
		review: 'Очень доволен обслуживанием в автосалоне. Понравилось, что менеджеры быстро разобрались с документами и предложили выгодные условия по лизингу. Машина в отличном состоянии, а цена приятно удивила.'
	},
	{
		id: 3,
		name: 'Никита Хорьков',
		letter: 'H',
		review: 'Отличный выбор автомобилей и компетентные консультанты. Приехал по рекомендации и не пожалел. Всё оформили максимально оперативно, и уже через пару часов я уехал на новом автомобиле!'
	}
];

const Otzyvy = () => {
	return (
		<section className='py-10 mt-8 relative'>
			<div className='container mx-auto text-white'>
				<h6 className='sd:text-5xl xz:text-3xl font-semibold'>
					Отзывы наших покупателей
				</h6>
				<div className='grid sd:grid-cols-3 xz:grid-cols-1 gap-10 mt-8'>
					{reviews.map((review) => (
						<div key={review.id} className='bg-white/85 rounded-3xl p-7'>
							<div className='flex items-center'>
								<div className={`${review.id === 1 && 'bg-[#2D3192]'} ${review.id === 2 && 'bg-[#192134]'} ${review.id === 3 && 'bg-[#0000FE]'} rounded-xl w-16 h-16 text-5xl flex justify-center items-center`}>
									{review.letter}
								</div>
								<p className='text-[#2D3192] text-xl ml-2'>
									{review.name.split(' ')[0]} <br /> {review.name.split(' ')[1]}
								</p>
							</div>
							<p className='mt-3 font-light text-secondary sd:text-balance xz:text-sm'>
								{review.review}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Otzyvy;
