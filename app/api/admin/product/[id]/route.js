// /app/api/admin/product/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, context) {
  try {
    const { id } = await context.params; // ВАЖНО: await для Next.js 15
    const oneProduct = await prisma.product.findFirst({
      where: { id: Number(id) },
    });

    if (!oneProduct) {
      return new NextResponse('Товар не найден', { status: 404 });
    }

    return NextResponse.json({ message: 'Товар получен', oneProduct }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
