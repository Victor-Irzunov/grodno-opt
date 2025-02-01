import Image from "next/image";

const About = () => {
	return (
		<section className='relative mt-8'>
			<div className='container mx-auto text-white'>
				<div className='grid sd:grid-cols-3 xz:grid-cols-1 gap-10 sd:px-8 xz:px-0'>
					<div className='sd:col-span-2 xz:col-span-1'>
						<h6 className='sd:text-5xl xz:text-3xl font-semibold'>
							О нас
						</h6>
						<p className='mt-4 mb-3 text-justify'>
							Мы — команда профессионалов, объединённых общей страстью к автомобилям, специализируемся на комиссионной продаже авто и стремимся сделать процесс покупки и продажи максимально простым и удобным для наших клиентов.
						</p>
						<p className='mb-3 text-justify'>
							Наша миссия — помочь вам найти идеальный автомобиль, который будет соответствовать вашим потребностям и стилю жизни.
						</p>
						<p className='text-justify'>
							Мы ценим доверие наших клиентов и стремимся создать комфортную атмосферу для покупки. У нас вы можете не только ознакомиться с автомобилями, но и воспользоваться выгодными условиями финансирования, а также услугами по trade-in.
						</p>
					</div>
					<div className='bg-[#2D3192] rounded-3xl overflow-hidden'>
						<Image src='/images/i4.webp' alt='О нас' width={354} height={354} className="mx-auto" />
					</div>
				</div>
				
			</div>
		</section>
	)
}

export default About;
