// /app/api/admin/search-buyers/route.js — ПОЛНОСТЬЮ
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return NextResponse.json({ ok: true, buyers: [] }, { status: 200 });
    }

    const maybeNumber = Number(q);
    const isNumeric = !Number.isNaN(maybeNumber);

    const where = {
      OR: [
        // По ID Buyer / User, если введено число
        ...(isNumeric
          ? [
              { id: maybeNumber }, // ID оптового покупателя
              { userId: maybeNumber }, // ID пользователя
            ]
          : []),
        // Поиск по связанному User / UserData
        {
          user: {
            OR: [
              // email
              {
                email: {
                  contains: q,
                },
              },
              // ФИО
              {
                userData: {
                  fullName: {
                    contains: q,
                  },
                },
              },
              // Телефон
              {
                userData: {
                  phone: {
                    contains: q,
                  },
                },
              },
              // Адрес
              {
                userData: {
                  address: {
                    contains: q,
                  },
                },
              },
            ],
          },
        },
      ],
    };

    const buyers = await prisma.wholesaleBuyer.findMany({
      where,
      include: {
        user: {
          include: {
            userData: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      take: 20,
    });

    return NextResponse.json(
      {
        ok: true,
        buyers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SEARCH_BUYERS_ERROR]", error);
    return NextResponse.json(
      { ok: false, message: "Ошибка сервера при поиске клиентов" },
      { status: 500 }
    );
  }
}
