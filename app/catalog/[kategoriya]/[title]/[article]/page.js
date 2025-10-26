// /app/catalog/[kategoriya]/[title]/[article]/page.js — ФАЙЛ ПОЛНОСТЬЮ
import OneProductPage from '@/components/OneProductPage/OneProductPage';
import { prisma } from '@/lib/prisma';
import { plainify } from '@/lib/plainify';

// Prisma нужен Node runtime
export const runtime = 'nodejs';

// ====== DATA LAYER ======
async function getData(article) {
  if (!article) return null;
  const product = await prisma.product.findFirst({
    where: { article: decodeURIComponent(article) },
    include: {
      category: true,
      group: true,
    },
  });
  return product;
}

async function getData2() {
  const products = await prisma.product.findMany({
    include: { category: true, group: true },
    take: 500,
  });
  return products;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: { groups: true },
    orderBy: { title: 'asc' },
  });
  return categories;
}

// ====== SEO / METADATA ======
export async function generateMetadata({ params }) {
  const { kategoriya, title, article } = params || {};

  const product = await getData(article);

  const metaTitle = product
    ? `${product.title} (${product.article}) — купить оптом`
    : `${decodeURIComponent(title || '')} — товар`;

  const metaDescription = product
    ? (product.description?.slice(0, 160) ||
      `Купить ${product.title} (${product.article}) оптом. В наличии: ${product.count > 0 ? 'да' : 'нет'}.`)
    : `Страница товара ${decodeURIComponent(title || '')}.`;

  const canonical = `/catalog/${encodeURIComponent(kategoriya || '')}/${encodeURIComponent(title || '')}/${encodeURIComponent(article || '')}`;

  // Подготовим изображения для OG/Twitter (если есть)
  const ogImages = [];
  if (product?.images) {
    // images может быть массивом строк или объектами — берём только валидные URL-строки
    try {
      const arr = Array.isArray(product.images) ? product.images : [];
      for (const it of arr) {
        if (typeof it === 'string' && it.startsWith('http')) ogImages.push(it);
        if (it && typeof it === 'object' && typeof it.url === 'string' && it.url.startsWith('http')) {
          ogImages.push(it.url);
        }
      }
    } catch (_) {
      // молча игнорим
    }
  }

  // JSON-LD для AEO/SEO
  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        sku: product.article,
        category: product?.category?.title || undefined,
        description: product?.description || undefined,
        offers: {
          '@type': 'Offer',
          availability: product.count > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          priceCurrency: 'BYN',
          // Если выведешь цену в JSON-LD: раскомментируй и убедись, что это строка или число
          // price: product.price?.toString?.() ?? undefined,
        },
        image: ogImages.length ? ogImages : undefined,
      }
    : null;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      type: 'website',              // ← фикс: 'product' недопустим в Next metadata
      images: ogImages.length ? ogImages : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImages.length ? ogImages : undefined,
    },
    // Складываем JSON-LD в meta name через 'other'
    // (для Product это ок, поисковики читают <script type="application/ld+json">,
    // его ты можешь добавить в компоненте через <Script id="ld" type="application/ld+json">{...}</Script>
    // Если хочешь именно <script> — перенесу в layout или в саму страницу.)
    other: jsonLd ? { 'script:ld+json': JSON.stringify(jsonLd) } : {},
  };
}

// ====== PAGE ======
export default async function Page({ params }) {
  const { article } = params || {};

  const [rawProduct, rawProducts, rawCategories] = await Promise.all([
    getData(article),
    getData2(),
    getCategories(),
  ]);

  // Приводим все сложные типы к plain JS, чтобы клиентские компоненты не падали
  const data = plainify(rawProduct, { decimal: 'number' });
  const dataAllProduct = plainify(rawProducts, { decimal: 'number' });
  const categories = plainify(rawCategories, { decimal: 'number' });

  return (
    <OneProductPage
      categories={categories}
      data={data}
      dataAllProduct={dataAllProduct}
    />
  );
}
