'use client';

import dynamic from 'next/dynamic';

const CatalogClient = dynamic(
  () => import('@/components/catalog/CatalogClient'),
  { ssr: false }
);

export default function CatalogPageClient({ data }) {
  return <CatalogClient data={data} />;
}
