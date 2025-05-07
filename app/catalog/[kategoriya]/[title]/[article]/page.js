import OneProductPage from '@/components/OneProductPage/OneProductPage';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getData(article) {
	try {
		const data = await prisma.product.findFirst({
			where: { article },
		});

		if (!data) return null;

		// Преобразуем Decimal поля в строку
		return {
			...data,
			price: data.price?.toString(), // Если price - Decimal, преобразуем в строку
		};
	} catch (error) {
		console.error("Ошибка при запросе:", error);
		return null;
	}
}


async function getData2() {
	try {
		const data = await prisma.product.findMany({
			include: {
				category: true,
				group: true,
			}
		}
		);

			const serializedProducts = data.map((product) => ({
			...product,
			price: product.price.toString(),
			group: {
				...product.group,
				discount: product.group?.discount?.toString() ?? null,
			},
		}));
		

		return serializedProducts || [];
	} catch (error) {
		console.error("Ошибки при запросе:", error);
		return [];
	}
}


export async function generateMetadata({ params: { kategoriya, title, article } }) {
	const data = await getData(article);
	let title1
	let description1
	let artileBig = article.toUpperCase()

	if (data) {
		title1 = `${data?.title} купить оптом для телефона ${artileBig}| proparts.by`,
			description1 = `ᐈ ⭐ ${data?.title}  (${artileBig}) купить ⚡ Оптовый магазин ⚡ Продажа ${data?.title} по оптовым ценам ➤➤➤ Доставка ☎️ (33) 000-00-00 ⚡ Большой выбор запчастей ⚡ Помощь в подборе ⭐ Только опт ⭐ ✓ proparts.by ✓ Звоните прямо сейчас! `
	}
	return {
		title: title1,
		description: description1,
		keywords: ``,
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_BASE_URL}//catalog/${kategoriya}/${title}/${article}/`,
		},
		og: {
			title: title1,
			description: description1,
			type: 'website',
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/`,
			image: 'public/logo/logo.webp',
		},
	};
}

const page = async ({ params: { article } }) => {
	const data = await getData(article)
	const dataAllProduct = await getData2()

	const categories = Array.from(new Map(dataAllProduct.map(item => [item.category.id, { id: item.category.id, title: item.category.title }])).values());

	if (!data) {
		return (
			<main className="py-20 min-h-screen">
				<div className='container mx-auto'>
					<p>Загрузка...</p>
				</div>
			</main>
		);
	}

	return (
		<main className='sd:py-20 xz:py-7 min-h-screen'>
			<div className='w-full bg-cover fon bg-center' />
			<OneProductPage categories={categories} data={data} dataAllProduct={dataAllProduct} />
		</main>
	)
}

export default page