// /app/api/admin/group/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// === GET: группы одной категории по categoryId ===
export async function GET(req, context) {
  try {
    const { id } = await context.params; // ВАЖНО: await
    const categoryId = Number(id);

    const groupsOneCategory = await prisma.group.findMany({
      where: { categoryId },
      orderBy: { id: 'asc' },
    });

    // Вернём пустой массив, если групп нет — это не ошибка
    return NextResponse.json({ groupsOneCategory }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении групп одной категории:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// === PUT: обновить группу по её id ===
export async function PUT(req, context) {
  try {
    const { id } = await context.params; // ВАЖНО: await
    const groupId = Number(id);

    const { title } = await req.json();
    if (!title) {
      return new NextResponse('Название группы не предоставлено', { status: 400 });
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: { title },
    });

    return NextResponse.json(
      { message: 'Группа успешно отредактирована', updatedGroup },
      { status: 200 }
    );
  } catch (error) {
    // Если группы нет — Prisma кидает P2025
    if (error?.code === 'P2025') {
      return new NextResponse('Группа не найдена', { status: 404 });
    }
    console.error('Ошибка при редактировании группы:', error);
    return new NextResponse('Ошибка при редактировании группы', { status: 500 });
  }
}

// === DELETE: удалить группу и её товары ===
export async function DELETE(req, context) {
  try {
    const { id } = await context.params; // ВАЖНО: await
    const groupId = Number(id);

    // сначала удаляем товары этой группы
    await prisma.product.deleteMany({
      where: { groupId },
    });

    // затем удаляем саму группу
    const deleteGroup = await prisma.group.delete({
      where: { id: groupId },
    });

    return NextResponse.json(
      { message: 'Группа и связанные товары успешно удалены', deleteGroup },
      { status: 200 }
    );
  } catch (error) {
    if (error?.code === 'P2025') {
      return new NextResponse('Группа не найдена', { status: 404 });
    }
    console.error('Ошибка при удалении группы:', error);
    return new NextResponse('Ошибка при удалении группы', { status: 500 });
  }
}
