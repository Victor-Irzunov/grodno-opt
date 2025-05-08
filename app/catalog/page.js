import { PrismaClient } from '@prisma/client';
import dynamic from "next/dynamic";

const CatalogClient = dynamic(() => import("@/components/catalog/CatalogClient"), {
	ssr: false,
 });

const prisma = new PrismaClient();

async function getData() {

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

export const metadata = {
	title: "Каталог запасных частей для мобильных телефонов - опт | proparts.by",
	description: "ᐈ ⭐ Купить запчасти для телефона оптом ➤➤➤ Оптовый магазин запчастей для телефонов ⚡ Доставка ☎️ (44) 740-00-01 ⚡ Огромный выбор запчастей и комплектующих ⚡ Инструмент для работы ⭐ Оптовые цены ⭐ Отсрочка ✓ Только оптовые продажи ✓ Звоните прямо сейчас!",
	keywords: "",
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/`
	},
	ogTitle: 'Каталог запасных частей для мобильных телефонов - опт | proparts.by',
	ogDescription: 'ᐈ ⭐ Купить запчасти для телефона оптом ➤➤➤ Оптовый магазин запчастей для телефонов ⚡ Доставка ☎️ (44) 740-00-01 ⚡ Огромный выбор запчастей и комплектующих ⚡ Инструмент для работы ⭐ Оптовые цены ⭐ Отсрочка ✓ Только оптовые продажи ✓ Звоните прямо сейчас!',
	twitterTitle: 'Каталог запасных частей для мобильных телефонов - опт | proparts.by',
	twitterDescription: 'ᐈ ⭐ Купить запчасти для телефона оптом ➤➤➤ Оптовый магазин запчастей для телефонов ⚡ Доставка ☎️ (44) 740-00-01 ⚡ Огромный выбор запчастей и комплектующих ⚡ Инструмент для работы ⭐ Оптовые цены ⭐ Отсрочка ✓ Только оптовые продажи ✓ Звоните прямо сейчас!',
	twitterImage: 'public/logo/logo.webp',
	ogType: 'website',
	ogUrl: '',
	twitterCard: 'public/logo/logo.webp'
};

export async function generateStaticParams() {
	return []; // Оставьте пустым, чтобы генерация страницы происходила на каждый запрос
}

export default async function Page() {
	const data = await getData();

	return (
		<main className='py-10'>
			<CatalogClient data={data} />
		</main >
	)
}

// При использовании ISR, установите revalidate
export const revalidate = 30; // Перегенерация каждые 30 секунд