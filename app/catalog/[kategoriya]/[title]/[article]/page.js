// /app/catalog/[kategoriya]/[title]/[article]/page.js — ФАЙЛ ПОЛНОСТЬЮ
import OneProductPage from '@/components/OneProductPage/OneProductPage';
import { prisma } from '@/lib/prisma'; // если у тебя другой путь — оставь как было
// Если у тебя были свои функции getData/getData2 — см. ниже: я их сохранил

async function getData(article) {
  // оставь свою реализацию; пример через Prisma:
  const product = await prisma.product.findFirst({
    where: { article },
    include: {
      category: true,
      group: true,
    },
  });
  return product;
}

async function getData2() {
  // оставь свою реализацию; пример:
  const products = await prisma.product.findMany({
    include: { category: true, group: true },
    take: 500, // чтобы не грелось, можно убрать
  });
  return products;
}

async function getCategories() {
  // оставь свою реализацию; пример:
  const categories = await prisma.category.findMany({
    include: { groups: true },
    orderBy: { title: 'asc' },
  });
  return categories;
}

// МЕТАДАННЫЕ – теперь ждём params
export async function generateMetadata({ params }) {
  const { kategoriya, title, article } = await params;

  const data = await getData(article);

  let title1;
  let description1;

  if (data) {
    title1 = `${data.title} (${data.article}) — купить оптом`;
    description1 =
      data.description?.slice(0, 160) ||
      `Купить ${data.title} (${data.article}) оптом. В наличии: ${data.count > 0 ? 'да' : 'нет'}.`;
  } else {
    title1 = `${title} — товар`;
    description1 = `Страница товара ${title}.`;
  }

  return {
    title: title1,
    description: description1,
    alternates: {
      canonical: `/catalog/${kategoriya}/${title}/${article}`,
    },
  };
}

// СТРАНИЦА – тоже ждём params
export default async function Page({ params }) {
  const { article } = await params;

  const [data, dataAllProduct, categories] = await Promise.all([
    getData(article),
    getData2(),
    getCategories(),
  ]);

  return (
    <OneProductPage
      categories={categories}
      data={data}
      dataAllProduct={dataAllProduct}
    />
  );
}
