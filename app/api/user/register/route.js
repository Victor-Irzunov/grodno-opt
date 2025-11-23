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
      // опционально можем прислать discount/limit,
      // но если нет — ставим 0
      discount,
      limit,
      isAdmin = false,
    } = body || {};

    if (!email || !password) {
      return new NextResponse('Email и пароль обязательны', { status: 400 });
    }

    const userExists = await prisma.user.findFirst({ where: { email } });
    if (userExists) {
      return new NextResponse('Пользователь уже зарегистрирован в системе', { status: 409 });
    }

    // защита от второго админа
    if (isAdmin) {
      const adminExists = await prisma.user.findFirst({ where: { isAdmin: true } });
      if (adminExists) {
        return new NextResponse('Администратор уже существует', { status: 409 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // создаём пользователя + пустой userData
    const userDB = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin,
        userData: {
          create: {
            fullName: '',
            phone: '',
            address: '',
          },
        },
      },
    });

    // ВАЖНО: всегда создаём WholesaleBuyer
    await prisma.wholesaleBuyer.create({
      data: {
        userId: userDB.id,
        balance: 0.0,
        debt: 0.0,
        discount: discount ?? 0.0,
        limit: limit ?? 0.0,
      },
    });

    if (!process.env.SECRET_KEY) {
      console.error('SECRET_KEY не задан в .env');
      return new NextResponse('Ошибка конфигурации сервера', { status: 500 });
    }

    const token = jwt.sign(
      { email: userDB.email, id: userDB.id, isAdmin: userDB.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    if (error.code === 'P2002') {
      return new NextResponse('Пользователь с таким email уже существует', { status: 409 });
    }
    console.error('Ошибка регистрации:', error);
    return new NextResponse('Ошибка регистрации!', { status: 500 });
  }
}
