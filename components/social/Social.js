import Image from "next/image"


const Social = () => {
	return (
		<div className="fixed z-50 sd:bottom-10 xz:bottom-5 sd:right-6 xz:right-1 flex flex-col items-center">
			{/* <a href="https://www.instagram.com/" target="_blank" className='mx-2.5 lg:tooltip text-white' data-tip="instagram">
				<Image src='/svg/instagram.svg' className='mb-4' alt='instagram для заказа' width={25} height={25} />
			</a> */}
			<a href='https://t.me/+375291349555' className='mx-2.5 lg:tooltip' data-tip="telegram">
				<Image src='/svg/telegram.svg' className='mb-4' alt='Телеграмм для заказа' width={25} height={25} />
			</a>

			<a href="viber://chat?number=%2B375291349555" target="_blank" className='mx-2.5 lg:tooltip' data-tip="viber">
				<Image src='/svg/viber.svg' className='mb-4' alt='Вайбер для заказа' width={25} height={25} />
			</a>

			{/* <a href="http://wa.me/375447405956?text=Нужна%20консультация" target="_blank" className='mx-2.5 lg:tooltip' data-tip="whatsApp">
				<Image src='/svg/whatsapp.svg' className='mb-4' alt='whatsapp для заказа' width={25} height={25} />
			</a> */}


		</div>
	)
}

export default Social