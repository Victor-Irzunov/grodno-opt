// /app/api/user/add-balance/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, amount } = body;

    if (!userId || !amount || isNaN(amount)) {
      return NextResponse.json(
        { message: 'Некорректные данные' },
        { status: 400 }
      );
    }

    const depositAmount = Number(amount);

    if (depositAmount <= 0) {
      return NextResponse.json(
        { message: 'Сумма пополнения должна быть больше 0' },
        { status: 400 }
      );
    }

    // Находим оптового покупателя по userId
    const buyer = await prisma.wholesaleBuyer.findUnique({
      where: { userId: Number(userId) },
    });

    if (!buyer) {
      return NextResponse.json(
        { message: 'Покупатель не найден' },
        { status: 404 }
      );
    }

    const currentDebt = Number(buyer.debt || 0);
    const currentBalance = Number(buyer.balance || 0);

    let newDebt = currentDebt;
    let newBalance = currentBalance;
    let remainingDeposit = depositAmount;

    // Сначала гасим долг
    if (currentDebt > 0 && remainingDeposit > 0) {
      const usedForDebt = Math.min(currentDebt, remainingDeposit);
      newDebt = currentDebt - usedForDebt;
      remainingDeposit -= usedForDebt;
    }

    // Остаток идёт в плюс к балансу
    if (remainingDeposit > 0) {
      newBalance = currentBalance + remainingDeposit;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Записываем транзакцию пополнения
      await tx.balanceTransaction.create({
        data: {
          buyerId: buyer.id,
          amount: depositAmount.toFixed(2),
          type: 'DEPOSIT',
        },
      });

      // Обновляем баланс и долг
      const updatedBuyer = await tx.wholesaleBuyer.update({
        where: { id: buyer.id },
        data: {
          balance: newBalance.toFixed(2),
          debt: newDebt.toFixed(2),
        },
      });

      return updatedBuyer;
    });

    return NextResponse.json(
      {
        message: 'Пополнение проведено успешно',
        newBalance: Number(result.balance),
        newDebt: Number(result.debt),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ADD_BALANCE_ERROR]', error);
    return NextResponse.json(
      { message: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
