import Image from "next/image";
import Marquee from "react-fast-marquee";

const RunningLine = () => {
	return (
		<section className='w-full sd:mt-12 xz:mt-8'>
			<Marquee>
				<div className='flex items-center'>
					<div className='mx-10'>
						<Image src='/svg/car_repair2-gray.svg' alt='Ремонт авто' width={70} height={70} />
					</div>
					<div className='mx-10'>
						<Image src='/svg/diagnostics-gray.svg' alt='Диагностика автомобиля' width={58} height={58} />
					</div>
					<div className='mx-10'>
						<Image src='/svg/to-gray.svg' alt='ТО автомобиля' width={55} height={55} />
					</div>
					<div className='mx-10'>
						<Image src='/svg/car_repair-gray.svg' alt='Ремонт подвески' width={58} height={58} />
					</div>
					<div className='mx-10'>
						<Image src='/svg/brakes-gray.svg' alt='Ремонт тормозной системы' width={55} height={55} />
					</div>
					<div className='mx-10'>
						<Image src='/svg/radiator-gray.svg' alt='Ремонт системы охлаждения' width={58} height={58} />
					</div>
					<div className='mx-10'>
						<Image src='/svg/car-repair.svg' alt='СТО в Минске' width={50} height={50} />
					</div>
					<div className='mx-10'>
						<Image src='/svg/car-repair2.svg' alt='Автосервис' width={58} height={58} />
					</div>
					<div className='mx-10'>
						<Image src='/svg/car-repair3.svg' alt='Автоэлектрик' width={58} height={58} />
					</div>
				</div>
			</Marquee>
		</section>
	)
}

export default RunningLine