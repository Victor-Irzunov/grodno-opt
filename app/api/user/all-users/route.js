import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
	try {
		const dataUsers = await prisma.user.findMany({
			where: {
				isAdmin: false,
			},
			include: {
				userData: true, 
				wholesaleBuyer: true, 
			},
		});

		return NextResponse.json(dataUsers);
	} catch (error) {
		console.error(error);
		return new NextResponse('Серверная ошибка при получении всех пользователей', { status: 500 });
	}
}
