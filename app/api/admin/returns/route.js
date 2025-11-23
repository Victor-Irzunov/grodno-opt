// /app/api/admin/returns/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// GET /api/admin/returns?status=pending|approved|accepted|rejected|all
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') || 'pending';

    let where = {};
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'pending') where.status = 'В ожидании';
      if (statusFilter === 'approved') where.status = 'Одобрен';
      if (statusFilter === 'accepted') where.status = 'Принят';
      if (statusFilter === 'rejected') where.status = 'Отклонён';
    }

    const returns = await prisma.return.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: {
          include: {
            user: {
              include: {
                userData: true,
              },
            },
          },
        },
        order: {
          include: {
            shippingInfo: true,
            orderItems: {
              include: { product: true },
            },
          },
        },
        returnItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, returns }, { status: 200 });
  } catch (error) {
    console.error('Ошибка получения возвратов:', error);
    return NextResponse.json(
      { ok: false, message: 'Ошибка сервера при получении возвратов' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/returns  { returnId, action: "approve" | "reject" | "accept" }
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { returnId, action } = body || {};

    if (!returnId || !['approve', 'reject', 'accept'].includes(action)) {
      return NextResponse.json(
        { ok: false, message: 'Некорректные данные запроса' },
        { status: 400 }
      );
    }

    const existingReturn = await prisma.return.findUnique({
      where: { id: Number(returnId) },
      include: {
        buyer: true,
      },
    });

    if (!existingReturn) {
      return NextResponse.json(
        { ok: false, message: 'Возврат не найден' },
        { status: 404 }
      );
    }

    // Отклонение возврата (только из "В ожидании")
    if (action === 'reject') {
      if (existingReturn.status !== 'В ожидании') {
        return NextResponse.json(
          { ok: false, message: 'Можно отклонить только возврат в статусе "В ожидании"' },
          { status: 400 }
        );
      }

      const updated = await prisma.return.update({
        where: { id: existingReturn.id },
        data: { status: 'Отклонён' },
      });

      return NextResponse.json(
        { ok: true, status: updated.status, returnId: updated.id },
        { status: 200 }
      );
    }

    // Одобрение возврата (готов забрать, без пересчёта денег)
    if (action === 'approve') {
      if (existingReturn.status !== 'В ожидании') {
        return NextResponse.json(
          { ok: false, message: 'Можно одобрить только возврат в статусе "В ожидании"' },
          { status: 400 }
        );
      }

      const updatedReturn = await prisma.return.update({
        where: { id: existingReturn.id },
        data: {
          status: 'Одобрен',
        },
      });

      return NextResponse.json(
        {
          ok: true,
          returnId: updatedReturn.id,
          status: updatedReturn.status,
        },
        { status: 200 }
      );
    }

    // Принятие возврата (товар фактически передан, делаем пересчёт)
    if (action === 'accept') {
      if (existingReturn.status !== 'Одобрен') {
        return NextResponse.json(
          { ok: false, message: 'Принять можно только возврат в статусе "Одобрен"' },
          { status: 400 }
        );
      }

      const refundNumber = Number(existingReturn.totalRefund);
      const currentDebt = Number(existingReturn.buyer.debt);
      const currentBalance = Number(existingReturn.buyer.balance);

      let remainingRefund = refundNumber;
      let newDebt = currentDebt;
      let newBalance = currentBalance;

      // Сначала гасим долг
      if (currentDebt > 0 && remainingRefund > 0) {
        const usedForDebt = Math.min(currentDebt, remainingRefund);
        newDebt = currentDebt - usedForDebt;
        remainingRefund -= usedForDebt;
      }

      // Остаток в баланс
      if (remainingRefund > 0) {
        newBalance = currentBalance + remainingRefund;
      }

      const result = await prisma.$transaction(async (tx) => {
        const updatedReturn = await tx.return.update({
          where: { id: existingReturn.id },
          data: {
            status: 'Принят',
          },
        });

        const updatedBuyer = await tx.wholesaleBuyer.update({
          where: { id: existingReturn.buyer.id },
          data: {
            debt: newDebt.toFixed(2),
            balance: newBalance.toFixed(2),
          },
        });

        await tx.balanceTransaction.create({
          data: {
            buyerId: existingReturn.buyer.id,
            amount: refundNumber.toFixed(2),
            type: 'RETURN_REFUND',
          },
        });

        return { updatedReturn, updatedBuyer };
      });

      return NextResponse.json(
        {
          ok: true,
          returnId: result.updatedReturn.id,
          status: result.updatedReturn.status,
          buyer: {
            id: result.updatedBuyer.id,
            balance: result.updatedBuyer.balance,
            debt: result.updatedBuyer.debt,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: false, message: 'Неизвестное действие' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Ошибка обработки возврата админом:', error);
    return NextResponse.json(
      { ok: false, message: 'Ошибка сервера при обработке возврата' },
      { status: 500 }
    );
  }
}
