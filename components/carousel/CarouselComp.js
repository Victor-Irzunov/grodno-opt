"use client"
import Image from 'next/image';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import dynamic from 'next/dynamic';

// const Carousel = dynamic(() => import('react-multi-carousel'), { ssr: false });

const CarouselComp = () => {
	const responsive = {
		superLargeDesktop: {
			breakpoint: { max: 4000, min: 3000 },
			items: 1
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 1
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 1
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1
		}
	};

	const ButtonGroup = ({ next, previous }) => {
		return (
			<div className="carousel-button-group gap-4 flex justify-center items-center w-full absolute -bottom-24">
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
	};

	return (
		<div className='mx-auto relative'>
			<Carousel
				responsive={responsive}
				arrows={false}
				showDots={true}
				autoPlaySpeed={4000}
				renderButtonGroupOutside={true}
				autoPlay
				infinite
				customButtonGroup={<ButtonGroup />}
			>
				<div className='rounded-md'>
					<Image src='/otzyvy/1.webp' className='rounded-md' alt='Отзыв клиента - Дезинсекция' width={660} height={480} />
				</div>
				<div className='rounded-md'>
					<Image src='/otzyvy/2.webp' className='rounded-md' alt='Отзыв клиента - Дезинфекция' width={660} height={480} />
				</div>
				<div className='rounded-md'>
					<Image src='/otzyvy/3.webp' className='rounded-md' alt='Отзыв клиента - Уничтожение тараканов' width={660} height={480} />
				</div>
				<div className='rounded-md'>
					<Image src='/otzyvy/4.webp' className='rounded-md' alt='Отзыв клиента - Уничтожение клопов' width={660} height={480} />
				</div>
				<div className='rounded-md'>
					<Image src='/otzyvy/5.webp' className='rounded-md' alt='Отзыв клиента - Уничтожение муравьев' width={660} height={480} />
				</div>
				<div className='rounded-md'>
					<Image src='/otzyvy/6.webp' className='rounded-md' alt='Отзыв клиента - Дезинфекции' width={660} height={480} />
				</div>
				<div className='rounded-md'>
					<Image src='/otzyvy/7.webp' className='rounded-md' alt='Отзыв клиента - Дератизация' width={660} height={480} />
				</div>

			</Carousel>
		</div>
	);
}

export default CarouselComp;
