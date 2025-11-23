// /app/api/user/change-password/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Не авторизован" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY не задан в .env");
      return NextResponse.json(
        { message: "Ошибка конфигурации сервера" },
        { status: 500 }
      );
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      console.error("JWT verify error:", err);
      return NextResponse.json(
        { message: "Неверный или просроченный токен" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { newPassword } = body || {};

    if (!newPassword || String(newPassword).trim().length < 6) {
      return NextResponse.json(
        { message: "Новый пароль должен быть не менее 6 символов" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(String(newPassword).trim(), 10);

    await prisma.user.update({
      where: { id: payload.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Ошибка смены пароля:", error);
    return NextResponse.json(
      { message: "Ошибка смены пароля" },
      { status: 500 }
    );
  }
}
