// /app/api/user/return/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { buyerId, orderId, productId, quantity, reason, comment, orderItemId } = body;

    if (!buyerId || !orderId || !productId || !quantity || !reason || !orderItemId) {
      return NextResponse.json({ message: 'Не все данные переданы' }, { status: 400 });
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    if (!orderItem) {
      return NextResponse.json({ message: 'OrderItem не найден' }, { status: 404 });
    }

    const totalRefund = Number(orderItem.price) * quantity;

    const createdReturn = await prisma.return.create({
      data: {
        buyerId,
        orderId,
        totalRefund,
        reason,
        comment,
        status: 'В ожидании',  // было: 'pending'
        returnItems: {
          create: [
            {
              productId,
              orderItemId,
              quantity,
              refundAmount: totalRefund,
            },
          ],
        },
      },
    });

    return NextResponse.json({ message: 'Возврат создан', return: createdReturn }, { status: 200 });
  } catch (error) {
    console.error('Ошибка создания возврата:', error);
    return NextResponse.json({ message: 'Ошибка сервера', error }, { status: 500 });
  }
}
