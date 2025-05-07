import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const body = await req.json()
    const { userId, amount } = body

    if (!userId || !amount || isNaN(amount)) {
      return NextResponse.json({ message: 'Некорректные данные' }, { status: 400 })
    }

    const depositAmount = Number(amount)

    // Найти оптового покупателя
    const buyer = await prisma.wholesaleBuyer.findUnique({
      where: { userId: Number(userId) },
    })

    if (!buyer) {
      return NextResponse.json({ message: 'Покупатель не найден' }, { status: 404 })
    }

    // Создать транзакцию
    await prisma.balanceTransaction.create({
      data: {
        buyerId: buyer.id,
        amount: depositAmount,
        type: 'deposit',
      },
    })

    let newDebt = buyer.debt
    let newBalance = buyer.balance

    if (buyer.debt > 0) {
      if (depositAmount >= buyer.debt) {
        // Покрываем весь долг
        newDebt = 0
        newBalance += (depositAmount - buyer.debt)
      } else {
        // Частично покрываем долг
        newDebt = buyer.debt - depositAmount
        newBalance = buyer.balance // не меняем
      }
    } else {
      // Нет долга — всё в баланс
      newBalance += depositAmount
    }

    await prisma.wholesaleBuyer.update({
      where: { id: buyer.id },
      data: {
        balance: newBalance,
        debt: newDebt,
      },
    })

    return NextResponse.json({
      message: 'Пополнение проведено успешно',
      newBalance,
      newDebt,
    })
  } catch (error) {
    console.error('[ADD_BALANCE_ERROR]', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
