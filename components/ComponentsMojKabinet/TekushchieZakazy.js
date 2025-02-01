import Link from "next/link"
import IstoriyaZakazov from "./IstoriyaZakazov"


const TekushchieZakazy = ({ setActiveComponent }) => {
	return (
		<div className="pt-10">
			<h3 className='sd:text-2xl xz:text-xl font-semibold'>
				Текущие заказы не найдены
			</h3>

			<div className='border sd:p-6 xz:p-4 rounded-sm mt-8'>
				<p
					onClick={() => setActiveComponent(() => <IstoriyaZakazov />)}
					className='font-bold text-primary text-sm cursor-pointer'>
					Посмотреть историю заказов
				</p>
			</div>
			<div className='border sd:p-6 xz:p-4 rounded-sm mt-4'>
				<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/catalog`} className="font-semibold text-primary text-sm">
					Перейти в каталог
				</Link>
			</div>


		</div>
	)
}

export default TekushchieZakazy