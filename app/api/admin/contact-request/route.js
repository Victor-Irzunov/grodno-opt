// /app/api/admin/contact-request/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** GET: список заявок; ?status=Заявка для фильтра, ?onlyNew=1 вернёт count новых */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const onlyNew = searchParams.get("onlyNew");
  const statusFilter = searchParams.get("status");

  if (onlyNew) {
    const cnt = await prisma.contactRequest.count({ where: { status: "Заявка" } });
    return NextResponse.json({ count: cnt });
  }

  const where = statusFilter ? { status: statusFilter } : {};
  // Порядок: сначала «Заявка», потом «Добавлен», потом «Отказано», внутри — по дате
  const list = await prisma.contactRequest.findMany({
    where,
    orderBy: [
      { status: "asc" },       // "Заявка" < "Добавлен" < "Отказано" — подходит для кириллицы (Юникодное сравнение)
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json(list);
}

/** PATCH: обновление isViewed / status */
export async function PATCH(req) {
  try {
    const { id, isViewed, status } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const data = {};
    if (typeof isViewed === "boolean") data.isViewed = isViewed;
    if (status) data.status = status; // "Заявка" | "Добавлен" | "Отказано"

    const updated = await prisma.contactRequest.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("contact-request PATCH error:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
