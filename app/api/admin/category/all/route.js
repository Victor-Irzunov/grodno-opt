import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  console.log('получение всех категорий', )
  try {
    const categories = await prisma.category.findMany({
      include: {
        groups: true,
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return NextResponse.json({ message: 'Ошибка сервера - получение категории' }, { status: 500 });
  }
}
