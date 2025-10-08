// /app/api/admin/product/search/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const qRaw = (searchParams.get('q') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    if (!qRaw) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const isNumeric = /^\d+$/.test(qRaw);

    const OR = [
      { article: qRaw },                // точный артикул
      { title: { startsWith: qRaw } },  // начало названия
      { title: { contains: qRaw } },    // вхождение
    ];

    if (isNumeric) {
      OR.unshift({ id: Number(qRaw) }); // точный id
    }

    const items = await prisma.product.findMany({
      where: {
        isDeleted: false,
        OR,
      },
      select: {
        id: true,
        title: true,
        article: true,
        status: true,
        count: true,
        price: true,
        categoryId: true,
        groupId: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ id: 'asc' }],
      take: limit,
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (e) {
    console.error('SEARCH ERROR:', e);
    // Вернём текст ошибки для быстрой диагностики во время разработки
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
