
import Marquee from "react-fast-marquee";

const RunningLineFooter = () => {
	return (
		<section className='w-full sd:my-8 xz:my-2 text-black'>
			<Marquee speed={100}>
				<div className='flex items-center uppercase text-9xl'>

					<div className='mx-8'>

						<p className=''>
							Здравствуйте, давайте поговорим
						</p>
					</div>
					<div className='mx-8'>

						<p className=''>
							Здравствуйте, давайте поговорим
						</p>
					</div>
					<div className='mx-8'>

						<p className='t'>
							Здравствуйте, давайте поговорим
						</p>
					</div>
					<div className=' mx-8'>
						<p className=''>
							Здравствуйте, давайте поговорим
						</p>
					</div>
				</div>
			</Marquee>
		</section>
	)
}

export default RunningLineFooter