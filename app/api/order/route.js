import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = parseInt(searchParams.get("orderId"), 10);

    if (!Number.isInteger(orderId)) {
      return NextResponse.json({ message: "Некорректный или отсутствующий orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Заказ не найден" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { count: true, status: true },
        });

        if (product) {
          const updatedCount = product.count + item.quantity;

          await tx.product.update({
            where: { id: item.productId },
            data: {
              count: {
                increment: item.quantity,
              },
              status: updatedCount > 0 ? "В наличии" : product.status,
            },
          });
        }
      }

      await tx.orderItem.deleteMany({ where: { orderId } });
      await tx.shippingInfo.deleteMany({ where: { orderId } });
      await tx.order.delete({ where: { id: orderId } });
    });

    return NextResponse.json({ message: "Заказ успешно удалён" }, { status: 200 });
  } catch (error) {
    console.error('❌ Ошибка при удалении заказа:', error);
    return NextResponse.json({ message: 'Серверная ошибка при удалении заказа' }, { status: 500 });
  }
}





export async function POST(req) {
  try {
    const body = await req.json();
    const { phone, message, deliveryMethod, address, data, userData: incomingUserData } = body;

    if (!incomingUserData?.userId) {
      return NextResponse.json({ message: 'Не передан userId пользователя' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: incomingUserData.userId } });
    if (!user) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    const userData = await prisma.userData.findUnique({ where: { id: incomingUserData.id } });
    if (!userData) {
      return NextResponse.json({ message: 'UserData не найдена' }, { status: 404 });
    }

    const buyer = await prisma.wholesaleBuyer.findUnique({ where: { userId: user.id } });
    if (!buyer) {
      return NextResponse.json({ message: 'Пользователь не является оптовым покупателем' }, { status: 404 });
    }

    // Обновляем userData
    await prisma.userData.update({
      where: { id: userData.id },
      data: {
        fullName: incomingUserData.fullName || userData.fullName,
        address: incomingUserData.address || userData.address,
        phone: phone || userData.phone,
      },
    });

    const totalAmount = Number(
      data.reduce((sum, item) => {
        const price = parseFloat(item.price);
        if (isNaN(price)) throw new Error(`Некорректная цена у товара: ${item.price}`);
        return sum + price * item.quantity;
      }, 0).toFixed(2)
    );

    let newBalance = Number(buyer.balance);
    let newDebt = Number(buyer.debt);

    if (newBalance >= totalAmount) {
      newBalance = Number((newBalance - totalAmount).toFixed(2));
    } else {
      newBalance = 0;
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          buyerId: buyer.id,
          totalAmount,
          message,
          shippingInfo: deliveryMethod !== 'Самовывоз Космонавтов 9, каб 3' ? {
            create: {
              courier: deliveryMethod,
              trackingNumber: '',
              address,
            },
          } : undefined,
          orderItems: {
            create: data.map(product => ({
              productId: product.id,
              quantity: product.quantity,
              price: parseFloat(product.price),
            })),
          },
        },
        include: {
          shippingInfo: true,
          orderItems: true,
        },
      });

      await tx.wholesaleBuyer.update({
        where: { id: buyer.id },
        data: {
          balance: newBalance,
        },
      });

      await tx.balanceTransaction.create({
        data: {
          buyerId: buyer.id,
          amount: totalAmount,
          type: 'order',
        },
      });

      for (const item of data) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { count: true, status: true },
        });

        const decrementQuantity = Math.min(item.quantity, product.count);

        if (decrementQuantity > 0) {
          const newCount = product.count - decrementQuantity;

          await tx.product.update({
            where: { id: item.id },
            data: {
              count: {
                decrement: decrementQuantity,
              },
              status: newCount === 0 ? "Нет в наличии" : product.status,
            },
          });
        } else {
          console.warn(`⚠️ Попытка уменьшить товар (id: ${item.id}) при нулевом остатке`);
        }
      }

      return order;
    });

    return NextResponse.json({ message: 'Заказ успешно создан', order: result }, { status: 200 });
  } catch (error) {
    console.error('❌ Ошибка при создании заказа:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const dataOrders = await prisma.order.findMany({
      where: {
        status: "pending",
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        buyer: {
          include: {
            user: {
              include: {
                userData: true,
              },
            },
          },
        },
        shippingInfo: true,
      },
    });

    return NextResponse.json(dataOrders);
  } catch (error) {
    console.error('❌ Ошибка при получении заказов:', error);
    return new NextResponse('Серверная ошибка при получении всех заказов', { status: 500 });
  }
}