// /app/api/product/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
	console.log('запрос в базу за товаром');
	try {
		const data = await prisma.product.findMany({
			where: { isDeleted: false },
			include: {
				category: true,
				group: true,
			},
		
		});
		

		const products = data.map((p) => ({
			...p,
			price: p.price?.toString?.() ?? null,
		}));
		

		if (products.length === 0) {
			return NextResponse.json({ message: 'Товаров нет', products: [] }, { status: 200 });
		}

		return NextResponse.json({ message: 'Товар получен', products }, { status: 200 });
	} catch (error) {
		console.error('Ошибки при запросе при получении товара:', error);
		return NextResponse.json(
			{ message: 'Ошибка при получении товара', error: String(error?.code || error?.message || error) },
			{ status: 500 }
		);
	}
}
