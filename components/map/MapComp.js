"use client"
import Image from "next/image"
import phoneNumbers from "@/config/config"
import { useEffect, useState } from "react";

const MapComp = () => {
	const [showMap, setShowMap] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMap(true);
		}, 3000);

		return () => clearTimeout(timer); // Очищаем таймер при размонтировании компонента
	}, []);
	return (
		<section className='sd:block xz:hidden mt-10 py-16'>
			<div className='container mx-auto'>
				<div className='relative text-white'>
					<div className={`${showMap ? 'block' : 'hidden'} absolute -top-5 left-10 bg-[#2D3192] px-6 py-8 z-10 text-center rounded-xl`}>
						<div className=''>
							<Image src='/logo/logo2.webp' alt='Логотип - продажа авто в кредит и лизинг' width={120} height={120} className="mx-auto" />
						</div>
						<p className='text-xl'>
							Мы в Минске
						</p>
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
					<div style={{ position: 'relative', overflow: 'hidden' }}>
						<a
							href="https://yandex.by/maps/org/avtokar/122416526987/?utm_medium=mapframe&utm_source=maps"
							style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '0px' }}>
							Автокар
						</a>
						<a
							href="https://yandex.by/maps/157/minsk/category/car_dealership/184105322/?utm_medium=mapframe&utm_source=maps"
							style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '14px' }}>
							Автосалон в Минске
						</a>
						<a
							href="https://yandex.by/maps/157/minsk/category/sale_of_used_cars/190246757599/?utm_medium=mapframe&utm_source=maps"
							style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '28px' }}>
							Продажа автомобилей с пробегом в Минске
						</a>
						{showMap && (
							<iframe
								src="https://yandex.by/map-widget/v1/?ll=27.578063%2C53.921117&mode=search&oid=122416526987&ol=biz&z=16.72"
								width="100%"
								height="400"
								frameBorder="1"
								allowFullScreen
								loading="lazy"
								style={{ position: 'relative' }}
							></iframe>
						)}
					</div>
				</div>

				{/* отзывы с карты */}
				{/* <div style={{ width: '560px', height: '800px', overflow: 'hidden', position: 'relative' }}>
					<iframe
						style={{
							width: '100%',
							height: '100%',
							border: '1px solid #e6e6e6',
							borderRadius: '8px',
							boxSizing: 'border-box'
						}}
						src="https://yandex.ru/maps-reviews-widget/122416526987?comments">
					</iframe>
					<a
						href="https://yandex.by/maps/org/avtokar/122416526987/"
						target="_blank"
						style={{
							boxSizing: 'border-box',
							textDecoration: 'none',
							color: '#b3b3b3',
							fontSize: '10px',
							fontFamily: 'YS Text, sans-serif',
							padding: '0 20px',
							position: 'absolute',
							bottom: '8px',
							width: '100%',
							textAlign: 'center',
							left: '0',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: 'block',
							maxHeight: '14px',
							whiteSpace: 'nowrap',
							padding: '0 16px',
							boxSizing: 'border-box'
						}}>
						Автокар на карте Минска — Яндекс Карты
					</a>
				</div> */}

			</div>
		</section>
	)
}

export default MapComp