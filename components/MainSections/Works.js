import Image from "next/image"


const Works = () => {
	return (
		<section className='py-16 relative'>
			<div className='container mx-auto text-white'>
				<h5 className='sd:text-5xl xz:text-3xl font-semibold text-center'>
					Как мы работаем
				</h5>

				<div className='grid sd:grid-cols-5 xz:grid-cols-1 gap-4 mt-8 sd:px-10 xz:px-0'>

					<div className='flex flex-col items-center'>
						<div className='border-4 border-white p-2 rounded-full w-32 h-32 relative'>
							<div className='bg-white rounded-full w-24 h-24 overflow-hidden absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center items-center'>
								<Image
									src='/images/i1.webp'
									alt='Подбор авто'
									width={70} height={70}
									className=""
								/>
							</div>
						</div>
						<p className='mt-3 text-center'>
							Консультация и подбор автомобиля
						</p>
					</div>

					<div className='flex items-center justify-center sd:pb-12 xz:pb-0'>
						<Image src='/svg/arrow3.svg' alt='Стрелка' width={30} height={30} className="xz:rotate-90 sd:rotate-0" />
					</div>

					<div className='flex flex-col items-center'>
						<div className='border-4 border-white p-2 rounded-full w-32 h-32 relative'>
							<div className='bg-white rounded-full w-24 h-24 overflow-hidden absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center items-center'>
								<Image
									src='/images/i2.webp'
									alt='Подбор авто'
									width={70} height={70}
									className=""
								/>
							</div>
						</div>
						<p className='mt-3 text-center'>
							Тест-драйв и оценка автомобиля
						</p>
					</div>

					<div className='flex items-center justify-center sd:pb-12 xz:pb-0'>
						<Image src='/svg/arrow3.svg' alt='Стрелка' width={30} height={30} className="xz:rotate-90 sd:rotate-0" />
					</div>

					<div className='flex flex-col items-center'>
						<div className='border-4 border-white p-2 rounded-full w-32 h-32 relative'>
							<div className='bg-white rounded-full w-24 h-24 overflow-hidden absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center items-center'>
								<Image
									src='/images/i2.webp'
									alt='Подбор авто'
									width={70} height={70}
									className=""
								/>
							</div>
						</div>
						<p className='mt-3 text-center'>
							Финансирование и оформление сделки
						</p>
					</div>

				</div>
			</div>
		</section>
	)
}

export default Works