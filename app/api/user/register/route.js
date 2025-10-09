// /app/api/user/register/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      // эти поля могут приходить, но не обязательны при регистрации
      discount,
      limit,
      isAdmin = false,
    } = body || {};

    if (!email || !password) {
      return new NextResponse('Email и пароль обязательны', { status: 400 });
    }

    // уже есть пользователь с таким email?
    const userExists = await prisma.user.findFirst({ where: { email } });
    if (userExists) {
      return new NextResponse('Пользователь уже зарегистрирован в системе', { status: 409 });
    }

    // Защита: не позволяем создать второго администратора
    if (isAdmin) {
      const adminExists = await prisma.user.findFirst({ where: { isAdmin: true } });
      if (adminExists) {
        return new NextResponse('Администратор уже существует', { status: 409 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Вариант A — создаём пустой userData, поля возьмут дефолты из БД
    const userDB = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin,
        userData: { create: {} }, // fullName/address/phone заполнятся @default("")
      },
    });

    // Если переданы параметры для оптовика — создаём запись
    if (discount !== undefined && limit !== undefined) {
      await prisma.wholesaleBuyer.create({
        data: {
          userId: userDB.id,
          discount,
          balance: 0.0,
          limit,
        },
      });
    }

    const token = jwt.sign(
      { email: userDB.email, id: userDB.id, isAdmin: userDB.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    // Ловим частые ошибки (например, уникальный email)
    if (error.code === 'P2002') {
      return new NextResponse('Пользователь с таким email уже существует', { status: 409 });
    }
    console.error('Ошибка регистрации:', error);
    return new NextResponse('Ошибка регистрации!', { status: 500 });
  }
}
