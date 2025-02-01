import Link from "next/link"


const page = () => {
	return (
		<main className='pt-36 relative xz:min-h-[50vh] sd:min-h-[70vh]'>
			 <div className='w-full min-h-[90vh] bg-cover fon bg-center sd:block xz:hidden' />
			 <div className='w-full min-h-[90vh] bg-cover fon-mobil bg-center sd:hidden xz:block -z-10' />
			<section className='relative'>
				<div className='container mx-auto text-white'>
					<h1 className='sd:text-5xl xz:text-3xl font-semibold'>
						Ваш запрос принят!
					</h1>
					<p className='sd:text-3xl xz:text-xl mt-4'>
						Мы свяжемся с вами в ближайшее время.
					</p>

					<div className='mt-5'>
						<Link href='/' className="underline">
						На главную
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}

export default page