import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
	console.log('--------->' )
  try {
    const { userId, discount, limit } = await req.json()

    if (!userId || discount === undefined || limit === undefined) {
      return NextResponse.json({ message: 'Некорректные данные' }, { status: 400 })
    }

    const buyer = await prisma.wholesaleBuyer.findUnique({
      where: { userId: Number(userId) },
    })

    if (!buyer) {
      return NextResponse.json({ message: 'Покупатель не найден' }, { status: 404 })
    }

    await prisma.wholesaleBuyer.update({
      where: { id: buyer.id },
      data: {
        discount: Number(discount),
        limit: Number(limit),
      },
    })

    return NextResponse.json({ message: 'Обновление успешно' })
  } catch (error) {
    console.error('[UPDATE_LIMIT_DISCOUNT_ERROR]', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
