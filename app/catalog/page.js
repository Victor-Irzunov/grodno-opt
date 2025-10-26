import { PrismaClient } from '@prisma/client';
import CatalogPageClient from './CatalogPage.client';

const prisma = new PrismaClient();

async function getData() {
  try {
    const data = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        category: true,
        group: true,
      },
    });
    console.log("🚀 🚀 🚀  _ getData _ data:", data)

    const serializedProducts = data.map((product) => ({
      ...product,
      price: product.price?.toString?.() ?? String(product.price),
      group: {
        ...product.group,
        discount: product.group?.discount?.toString?.() ?? null,
      },
    }));

    return serializedProducts || [];
  } catch (error) {
    console.error('Ошибки при запросе:', error);
    return [];
  }
}

export const metadata = {
  title: 'Каталог запасных частей для мобильных телефонов - опт | proparts.by',
  description:
    'ᐈ ⭐ Купить запчасти для телефона оптом ➤➤➤ Оптовый магазин запчастей для телефонов ⚡ Доставка ☎️ (44) 740-00-01 ⚡ Огромный выбор запчастей и комплектующих ⚡ Инструмент для работы ⭐ Оптовые цены ⭐ Отсрочка ✓ Только оптовые продажи ✓ Звоните прямо сейчас!',
  keywords: '',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/`,
  },
  ogTitle:
    'Каталог запасных частей для мобильных телефонов - опт | proparts.by',
  ogDescription:
    'ᐈ ⭐ Купить запчасти для телефона оптом ➤➤➤ Оптовый магазин запчастей для телефонов ⚡ Доставка ☎️ (44) 740-00-01 ⚡ Огромный выбор запчастей и комплектующих ⚡ Инструмент для работы ⭐ Оптовые цены ⭐ Отсрочка ✓ Только оптовые продажи ✓ Звоните прямо сейчас!',
  twitterTitle:
    'Каталог запасных частей для мобильных телефонов - опт | proparts.by',
  twitterDescription:
    'ᐈ ⭐ Купить запчасти для телефона оптом ➤➤➤ Оптовый магазин запчастей для телефонов ⚡ Доставка ☎️ (44) 740-00-01 ⚡ Огромный выбор запчастей и комплектующих ⚡ Инструмент для работы ⭐ Оптовые цены ⭐ Отсрочка ✓ Только оптовые продажи ✓ Звоните прямо сейчас!',
  twitterImage: 'public/logo/logo.webp',
  ogType: 'website',
  ogUrl: '',
  twitterCard: 'public/logo/logo.webp',
};

export async function generateStaticParams() {
  return []; // оставляем, как у тебя было
}

// ISR
export const revalidate = 30;

export default async function Page() {
  const data = await getData();

  return (
    <main className="py-10">
      <CatalogPageClient data={data} />
    </main>
  );
}
