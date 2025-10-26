// /app/api/contact-request/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Создание заявки (публичная форма). Всегда сохраняем со статусом "Заявка". */
export async function POST(req) {
  try {
    const { name, phone, company, message } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "name и phone обязательны" }, { status: 400 });
    }
    const created = await prisma.contactRequest.create({
      data: { name, phone, company: company || null, message: message || null, status: "Заявка" },
    });
    return NextResponse.json({ ok: true, id: created.id }, { status: 200 });
  } catch (e) {
    console.error("contact-request POST error:", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
