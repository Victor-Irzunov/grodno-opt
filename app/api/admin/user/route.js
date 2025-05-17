// pages/api/admin/user.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const body = await req.json();
		const {
			email,
			password,
			phone,
			fullName,
			discount,
			limit,
			address,
			isAdmin = false,
		} = body;

		// Находим пользователя по email
		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				userData: true,
				wholesaleBuyer: true,
			},
		});

		if (!user) {
			return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
		}

		// Объект данных для обновления
		const updateData = {
			email,
			isAdmin,
			userData: {
				update: {
					fullName,
					address,
					phone,
				},
			},
			wholesaleBuyer: {
				update: {
					discount: parseFloat(discount),
					limit: parseFloat(limit),
				},
			},
		};

		// Если админ ввёл новый пароль — хешируем и обновляем
		if (password && password.trim() !== "") {
			const hashedPassword = await bcrypt.hash(password, 10);
			updateData.password = hashedPassword;
		}

		await prisma.user.update({
			where: { id: user.id },
			data: updateData,
		});

		return NextResponse.json({ message: 'Пользователь обновлён' }, { status: 200 });
	} catch (error) {
		console.error('Ошибка при обновлении пользователя:', error);
		return NextResponse.json({ message: 'Ошибка при обновлении', error }, { status: 500 });
	}
}
