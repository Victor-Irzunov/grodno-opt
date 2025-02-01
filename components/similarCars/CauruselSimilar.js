"use client"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import phoneNumbers from '@/config/config';

const CauruselSimilar = ({ data }) => {
	console.log("🚀 🚀 🚀  _ CauruselSimilar _ data:", data);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const responsive = {
		superLargeDesktop: {
			breakpoint: { max: 4000, min: 3000 },
			items: 4
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 3
		},
		tablet: {
			breakpoint: { max: 1024, min: 375 },
			items: 2
		},
		mobile: {
			breakpoint: { max: 375, min: 0 },
			items: 1
		}
	};

	const ButtonGroup = ({ next, previous }) => (
		<div className="carousel-button-group gap-4 flex justify-center items-center w-full relative mt-6">
			<button className='block p-3 bg-white/5 rounded-md' onClick={previous}>
				<Image src='/svg/arrow-left.svg' alt='' width={40} height={40} />
			</button>
			<button onClick={next}>
				<span className='block p-3 bg-white/5 rounded-md'>
					<Image src='/svg/arrow-right.svg' alt='' width={40} height={40} />
				</span>
			</button>
		</div>
	);

	return (
		<div>
			{/* Модальное окно */}
			{isModalOpen && (
				<div className="modal modal-open">
					<div className="modal-box relative" style={{background:'transparent'}}>
						<button
							className="btn btn-sm btn-circle absolute right-2 top-2"
							onClick={() => setIsModalOpen(false)}
						>✕</button>
						<div className="bg-[#2D3192] px-6 py-8 text-center rounded-xl text-white">
							<div>
								<Image src='/logo/logo2.webp' alt='Логотип - продажа авто в кредит и лизинг' width={120} height={120} className="mx-auto" />
							</div>
							<p className='text-xl'>Мы в Минске</p>
							<div className='mt-5'>
								<Image src='/svg/location-white.svg' alt='Адрес автосалона' width={30} height={30} className="mx-auto mb-2" />
								<a href="https://yandex.by/maps/-/CDdkfUlz" target="_blank" className="mt-2 text-sm">
									Минск, ул. Куйбышева 40, <br />
									Паркинг 4 этаж
								</a>
							</div>
							<div className='mt-5'>
								<Image src='/svg/phone-white.svg' alt='Телефон автосалона' width={25} height={25} className="mx-auto mb-2" />
								<a href={`tel:${phoneNumbers.secondaryPhoneLink}`} className='font-light'>
									{phoneNumbers.secondaryPhone} МТС
								</a>
								<a href={`tel:${phoneNumbers.mainPhoneLink}`} className='font-light mt-2 block'>
									{phoneNumbers.mainPhone} A1
								</a>
							</div>
						</div>
					</div>
				</div>
			)}

			<Carousel
				responsive={responsive}
				arrows={false}
				autoPlaySpeed={5000}
				renderButtonGroupOutside={true}
				autoPlay
				infinite
				customButtonGroup={<ButtonGroup />}
			>
				{data && data.length && data.map((car, index) => (
					<article
						key={car.id}
						className={`card bg-white rounded-2xl shadow-xl sd:mx-2 xz:mx-0.5`}
					>
						<figure className="relative w-full sd:h-[250px] xz:h-[150px] overflow-hidden rounded-t-2xl">
							<div className="carousel rounded-t-2xl w-full h-full">
								{JSON.parse(car.images).map((image, index) => (
									<div key={index} className="carousel-item w-full mx-0.5">
										<Image
											src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${image.original}`}
											alt={car.title}
											className="w-full h-full object-cover"
											width={250}
											height={250}
										/>
									</div>
								))}
								<div className='absolute bottom-1 right-1'>
									<Image src='/svg/left-right.svg' alt='Рука и палец для фото влево и вправо' width={25} height={25} />
								</div>
							</div>
						</figure>
						<div className="card-body sd:p-4 xz:p-2">
							<p className='text-info sd:text-lg xz:text-sm'>
								{car.priceUSD} USD <span className="font-semibold sd:text-xl xz:text-base">/ {car.priceBYN} BYN</span>
							</p>
							<h5 className="card-title text-secondary sd:text-base xz:text-sm">
								{car.title}
							</h5>
							<ul className='text-[#333333] sd:text-sm xz:text-[9px] xy:text-[10px]'>
								<li className='flex justify-between mb-1'>
									<span>Год</span>
									<span>{car.year} г</span>
								</li>
								<li className='flex justify-between mb-1'>
									<span>Пробег</span>
									<span>{car.mileage}</span>
								</li>
								<li className='flex justify-between mb-1'>
									<span>Тип двигателя</span>
									<span>{car.engine}</span>
								</li>
								<li className='flex justify-between mb-1'>
									<span>Коробка передач</span>
									<span>{car.transmission}</span>
								</li>
							</ul>
							<div className="card-actions justify-between sd:px-0 xy:px-2">
								<button
									onClick={() => setIsModalOpen(true)}
									className="btn btn-circle sd:btn-lg xz:btn-sm btn-outline btn-secondary"
								>
									<Image src='/svg/phone1.svg' alt='Телефон' width={25} height={25} className="sd:w-9 xz:w-5" />
								</button>
								<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/catalog/${car.id}/${car.titleLink}`}>
									<button className="btn sd:btn-lg xz:btn-sm btn-primary rounded-full sd:px-7 xz:px-2 sd:text-base xz:text-xs">
										Подробнее
									</button>
								</Link>
							</div>
						</div>
					</article>
				))}
			</Carousel>
		</div>
	)
}

export default CauruselSimilar;
