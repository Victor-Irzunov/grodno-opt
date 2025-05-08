import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // ⬅️ это важно

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        userData: true,
        wholesaleBuyer: {
          include: {
            orders: {
              include: {
                orderItems: {
                  include: {
                    product: true,
                  },
                },
                shippingInfo: true,
              },
            },
            returns: {
              include: {
                returnItems: {
                  include: {
                    product: true,
                  },
                },
              },
            },
            transactions: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('Пользователь не найден', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse('Серверная ошибка', { status: 500 });
  }
}
