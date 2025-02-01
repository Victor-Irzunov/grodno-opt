import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, categoryId } = body;

    // Проверяем, указаны ли необходимые данные
    if (!title || !categoryId) {
      return NextResponse.json(
        { message: 'Название группы и ID категории обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли указанная категория
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { message: 'Указанная категория не найдена' },
        { status: 404 }
      );
    }

    // Проверяем, существует ли группа с таким названием в указанной категории
    const groupExists = await prisma.group.findFirst({
      where: {
        title,
        categoryId,
      },
    });

    if (groupExists) {
      return NextResponse.json(
        { message: 'Группа с таким названием уже существует в этой категории' },
        { status: 400 }
      );
    }

    // Создаем новую группу
    const newGroup = await prisma.group.create({
      data: {
        title,
        categoryId,
      },
    });

    return NextResponse.json(newGroup, { status: 200 });
  } catch (error) {
    console.error('Ошибка при добавлении группы:', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}




export async function GET(req) {
  try {
    const groups = await prisma.group.findMany();

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении всех групп:', error);
    return NextResponse.json({ message: 'Ошибка сервера при получении всех групп' }, { status: 500 });
  }
}

