// /app/api/contact-request/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, phone, company, message } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ error: "name, phone — обязательны" }, { status: 400 });
    }

    const item = await prisma.contactRequest.create({
      data: { name, phone, company, message },
    });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const text =
        `📨 *Новая заявка на сотрудничество*\n` +
        `*Имя:* ${escapeMd(name)}\n` +
        `*Телефон:* ${escapeMd(phone)}\n` +
        (company ? `*Компания:* ${escapeMd(company)}\n` : "") +
        (message ? `*Сообщение:* ${escapeMd(message)}\n` : "") +
        `*Время:* ${new Date().toLocaleString("ru-RU")}`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, id: item.id });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

function escapeMd(s) {
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
