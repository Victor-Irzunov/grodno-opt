import React from 'react'

const page = () => {
	return (
		<main className='pt-20'>
			<section>
				<div className='container mx-auto'>
					<h1 className='sd:text-4xl xz:text-xl font-semibold'>
						Гарантия
					</h1>

					<div className='mt-7 space-y-4 text-gray-800 text-base leading-relaxed sd:text-sm xz:text-xs'>

						<p>
							<strong>Товар подлежит возврату или обмену при соблюдении следующих условий:</strong>
						</p>

						<ul className="list-disc list-inside pl-4">
							<li>Отсутствие следов эксплуатации и установки</li>
							<li>Отсутствие механических повреждений</li>
							<li>Сохранение заводских плёнок</li>
							<li>Сохранение гарантийных пломб, штампов</li>
							<li>Наличие документов, подтверждающих покупку</li>
						</ul>

						<p>
							Приобретённый товар можно вернуть или обменять в течение <strong>14 дней</strong>.
						</p>

						<p>
							Расходы на доставку в случае обмена или возврата товара возлагаются на <strong>покупателя</strong>.
						</p>

						<p>
							Для <strong>оптовых клиентов</strong> гарантия составляет <strong>4 месяца</strong>.
						</p>

					</div>
				</div>
			</section>
		</main>
	)
}

export default page
