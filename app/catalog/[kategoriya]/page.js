import Catalog from "@/components/catalog/Catalog";
import { data } from "@/constans/Data";


export async function generateMetadata({ params: { kategoriya } }) {
	// const data = await getCarData(id.id);

	const dataObj = data.find((obj) => kategoriya === obj.link)


	let title1
	let description1

	if (data) {
		title1 = `${dataObj.title} купить оптом для телефона | proparts.by`,
			description1 = `ᐈ ⭐ ${dataObj.title} купить ⚡ Оптовый магазин ⚡ Продажа ${dataObj.title} по оптовым ценам ➤➤➤ Доставка ☎️ (33) 355-88-55 ⚡ Большой выбор запчастей ⚡ Помощь в подборе ⭐ Только опт ⭐ ✓ ✓ Звоните прямо сейчас!`
	}
	return {
		title: title1,
		description: description1,
		keywords: ``,
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/${dataObj.link}`,
		},
		og: {
			title: title1,
			description: description1,
			type: 'website',
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/${dataObj.link}`,
			image: 'public/logo/logo.webp',
		},
	};
}

const page = ({ params: { kategoriya } }) => {


	return (
		<main className='py-10'>
			<Catalog data={data} kategoriya={kategoriya} />
		</main >
	)
}

export default page