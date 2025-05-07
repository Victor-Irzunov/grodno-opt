// /api/admin/orders/shipping
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId, courier, trackingNumber, address, deliveryCost, status, items } = body;
    if (!orderId || !courier || !address || !status || !items) {
      return NextResponse.json({ message: 'Некорректные данные' }, { status: 400 });
    }
    const updateItems = items.map(item =>
      prisma.orderItem.update({
        where: { id: item.id },
        data: { price: item.price },
      })
    );

    await prisma.$transaction([
      ...updateItems,
      prisma.order.update({
        where: { id: orderId },
        data: {
          deliveryStatus: status,
          deliveryCost: deliveryCost ? parseFloat(deliveryCost) : undefined,
          shippingInfo: {
            upsert: {
              update: { courier, trackingNumber, address },
              create: { courier, trackingNumber, address },
            },
          },
        },
      }),
    ]);
    return NextResponse.json({ message: 'Информация о доставке обновлена' });
  } catch (error) {
    console.error('Ошибка обновления доставки:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'orderId не передан' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { buyer: true },
    });

    if (!order) {
      return NextResponse.json({ message: 'Заказ не найден' }, { status: 404 });
    }

    if (!order.buyer) {
      return NextResponse.json({ message: 'Покупатель не найден' }, { status: 404 });
    }

    const { buyer, totalAmount, deliveryCost } = order;
    const total = parseFloat(totalAmount) + parseFloat(deliveryCost || 0);

    let newBalance = parseFloat(buyer.balance);
    let newDebt = parseFloat(buyer.debt);

    let paidFromBalance = 0;
    let addedToDebt = total;

    if (newBalance > 0) {
      if (newBalance >= total) {
        paidFromBalance = total;
        addedToDebt = 0;
        newBalance -= total;
      } else {
        paidFromBalance = newBalance;
        addedToDebt = total - newBalance;
        newBalance = 0;
        newDebt += addedToDebt;
      }
    } else {
      newDebt += total;
    }

    const transactionOps = [];

    if (paidFromBalance > 0) {
      transactionOps.push(
        prisma.balanceTransaction.create({
          data: {
            buyerId: buyer.id,
            amount: paidFromBalance,
            type: 'balance',
          },
        })
      );
    }

    if (addedToDebt > 0) {
      transactionOps.push(
        prisma.balanceTransaction.create({
          data: {
            buyerId: buyer.id,
            amount: addedToDebt,
            type: 'debt',
          },
        })
      );
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'completed',
          deliveryStatus: 'completed',
        },
      }),
      prisma.wholesaleBuyer.update({
        where: { id: buyer.id },
        data: {
          balance: newBalance,
          debt: newDebt,
        },
      }),
      ...transactionOps,
    ]);

    return NextResponse.json({ message: 'Заказ успешно закрыт' });
  } catch (error) {
    console.error('Ошибка при закрытии заказа:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

