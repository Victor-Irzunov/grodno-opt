// /app/api/order/shipping/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      orderId,
      courier,
      trackingNumber,
      address,
      deliveryCost,
      status,
      items,
    } = body;

    if (
      !orderId ||
      !courier ||
      !status ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { message: "Некорректные данные" },
        { status: 400 }
      );
    }

    // для не-Самовывоз адрес обязателен
    if (courier !== "Самовывоз" && (!address || !String(address).trim())) {
      return NextResponse.json(
        {
          message:
            "Адрес доставки обязателен для выбранного способа доставки",
        },
        { status: 400 }
      );
    }

    const safeAddress =
      courier === "Самовывоз"
        ? (address && String(address).trim()) ||
        "Самовывоз Космонавтов 9, каб 3"
        : address;

    // нормализуем позиции: количество, цена, статус
    const normalizedItems = items.map((item) => {
      const qty =
        typeof item.quantity === "number"
          ? item.quantity
          : parseInt(item.quantity, 10) || 0;

      const price =
        typeof item.price === "number"
          ? item.price
          : parseFloat(item.price) || 0;

      const st = item.status || "Ожидание";

      return {
        id: item.id,
        quantity: qty < 0 ? 0 : qty,
        price,
        status: st,
      };
    });

    // пересчитываем сумму заказа
    const refusedStatuses = ["отказано", "отказ", "отсутствует на складе"];
    const totalAmount = normalizedItems.reduce((sum, item) => {
      const statusLower = String(item.status).toLowerCase();
      const isRefused = refusedStatuses.some((s) =>
        statusLower.includes(s)
      );
      const effectiveQty = isRefused ? 0 : item.quantity;
      return sum + effectiveQty * item.price;
    }, 0);

    const numericOrderId = Number(orderId);

    // ВСЁ ДЕЛАЕМ В ТРАНЗАКЦИИ: сначала находим заказ и его позиции,
    // затем удаляем лишние позиции, обновляем оставшиеся и сам заказ.
    await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: numericOrderId },
        include: {
          orderItems: true,
        },
      });

      if (!existingOrder) {
        throw new Error("Заказ не найден");
      }

      const keepIds = new Set(
        normalizedItems.map((item) => Number(item.id))
      );

      // какие orderItems нужно УДАЛИТЬ (их нет в форме)
      const idsToDelete = existingOrder.orderItems
        .filter((oi) => !keepIds.has(oi.id))
        .map((oi) => oi.id);

      if (idsToDelete.length > 0) {
        await tx.orderItem.deleteMany({
          where: {
            id: { in: idsToDelete },
          },
        });
      }

      // обновляем оставшиеся позиции
      await Promise.all(
        normalizedItems.map((item) =>
          tx.orderItem.update({
            where: { id: Number(item.id) },
            data: {
              price: item.price,
              quantity: item.quantity,
              status: item.status,
            },
          })
        )
      );

      // обновляем сам заказ + shippingInfo
      await tx.order.update({
        where: { id: numericOrderId },
        data: {
          deliveryStatus: status,
          deliveryCost: deliveryCost ? parseFloat(deliveryCost) : null,
          totalAmount: Number(totalAmount.toFixed(2)),
          shippingInfo: {
            upsert: {
              update: { courier, trackingNumber, address: safeAddress },
              create: { courier, trackingNumber, address: safeAddress },
            },
          },
        },
      });
    });

    return NextResponse.json({
      message: "Информация о доставке обновлена",
    });
  } catch (error) {
    console.error("Ошибка обновления доставки:", error);
    // если ошибка "Заказ не найден" из транзакции — отдадим 404
    if (error.message === "Заказ не найден") {
      return NextResponse.json(
        { message: "Заказ не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { message: "orderId не передан" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { buyer: true },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Заказ не найден" },
        { status: 404 }
      );
    }

    if (!order.buyer) {
      return NextResponse.json(
        { message: "Покупатель не найден" },
        { status: 404 }
      );
    }

    const { buyer, totalAmount, deliveryCost } = order;
    const total =
      parseFloat(totalAmount) + parseFloat(deliveryCost || 0);

    let newBalance = parseFloat(buyer.balance);
    let newDebt = parseFloat(buyer.debt);

    let paidFromBalance = 0;
    let addedToDebt = total;

    // ВАЖНО: списание и изменение долга — ТОЛЬКО ЗДЕСЬ, при ЗАКРЫТИИ заказа
    if (newBalance > 0) {
      if (newBalance >= total) {
        // баланса хватает, уходим не в минус, только списываем
        paidFromBalance = total;
        addedToDebt = 0;
        newBalance -= total;
      } else {
        // части хватает, остальное уходит в долг
        paidFromBalance = newBalance;
        addedToDebt = total - newBalance;
        newBalance = 0;
        newDebt += addedToDebt;
      }
    } else {
      // баланса нет, вся сумма уходит в долг
      newDebt += total;
    }

    const transactionOps = [];

    if (paidFromBalance > 0) {
      transactionOps.push(
        prisma.balanceTransaction.create({
          data: {
            buyerId: buyer.id,
            amount: paidFromBalance,
            type: "balance",
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
            type: "debt",
          },
        })
      );
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: "Завершён",
          deliveryStatus: "Завершён",
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

    return NextResponse.json({
      message: "Заказ успешно закрыт",
    });
  } catch (error) {
    console.error("Ошибка при закрытии заказа:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
