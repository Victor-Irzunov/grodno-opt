import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PUT(req) {
  try {
    const { id, count, status } = await req.json()
    await prisma.product.update({
      where: { id },
      data: { count, status }
    })
    return NextResponse.json({ message: 'Товар успешно обновлен' })
  } catch (error) {
    console.error('Ошибка при обновлении:', error)
    return new NextResponse('Ошибка при обновлении товара', { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return new NextResponse('Товар не найден', { status: 404 })
    }

    await prisma.product.update({
      where: { id },
      data: { isDeleted: true }
    })

    return NextResponse.json({ message: 'Товар помечен как удалён' })
  } catch (error) {
    console.error('Ошибка при удалении:', error)
    return new NextResponse('Ошибка при удалении товара', { status: 500 })
  }
}