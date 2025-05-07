import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

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
    console.log('🚀 POST buyer:', buyer);

    // Обновляем userData
    await prisma.userData.update({
      where: { id: userData.id },
      data: {
        fullName: incomingUserData.fullName || userData.fullName,
        address: incomingUserData.address || userData.address,
        phone: phone || userData.phone,
      },
    });

    // Расчёт суммы
    const totalAmount = Number(
      data.reduce((sum, item) => {
        const price = parseFloat(item.price);
        if (isNaN(price)) throw new Error(`Некорректная цена у товара: ${item.price}`);
        return sum + price * item.quantity;
      }, 0).toFixed(2)
    );

    // Баланс и долг
    let newBalance = Number(buyer.balance);
    let newDebt = Number(buyer.debt);

    if (newBalance >= totalAmount) {
      newBalance = Number((newBalance - totalAmount).toFixed(2));
    } else {
      newBalance = 0;
    }

    console.log('⏳ Обновляем покупателя: balance:', newBalance, 'debt (без изменений):', newDebt);

    const result = await prisma.$transaction(async (tx) => {
      // Создание заказа
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

      // Обновляем только баланс покупателя
      await tx.wholesaleBuyer.update({
        where: { id: buyer.id },
        data: {
          balance: newBalance,
        },
      });

      // Записываем транзакцию
      await tx.balanceTransaction.create({
        data: {
          buyerId: buyer.id,
          amount: totalAmount,
          type: 'order',
        },
      });

      // Уменьшаем остаток по каждому товару
      for (const item of data) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            count: {
              decrement: item.quantity,
            },
          },
        });
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
            product: true, // 🔁 каждый товар в заказе
          },
        },
        buyer: {
          include: {
            user: {
              include: {
                userData: true, // 👤 данные пользователя (ФИО, адрес, телефон)
              },
            },
          },
        },
        shippingInfo: true, // 📦 информация о доставке
      },
    });

    return NextResponse.json(dataOrders);
  } catch (error) {
    console.error('❌ Ошибка при получении заказов:', error);
    return new NextResponse('Серверная ошибка при получении всех заказов', { status: 500 });
  }
}


