import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; 

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Извлекаем параметры из URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Получаем пользователя и его связанные данные
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id), // Парсим ID из строки в число
      },
      include: {
        userData: true, // Загружаем связанные данные (UserData)
      },
    });
    console.log("🚀 🚀 🚀  _ GET _ user:", user)

    if (!user) {
      return new NextResponse('Пользователь не найден', { status: 404 });
    }

    // Возвращаем данные пользователя с его данными
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse('Серверная ошибка', { status: 500 });
  }
}
