import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ message: 'Название категории не указано' }, { status: 400 });
    }

    // Проверяем, существует ли категория с таким названием
    const existingCategory = await prisma.category.findUnique({
      where: { title },
    });

    if (existingCategory) {
      return NextResponse.json({ message: 'Категория с таким названием уже существует' }, { status: 400 });
    }

    // Создаем новую категорию
    const newCategory = await prisma.category.create({
      data: { title },
    });

    return NextResponse.json(newCategory, { status: 200 });
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

