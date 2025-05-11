import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();


export async function GET() {
	console.log('запрос в базу за товаром' )
	try {
		const data = await prisma.product.findMany({
			include: {
				category: true,
				group: true,
			}
		}
		);
		
		const serializedProducts = data.map((product) => ({
			...product,
			price: product.price.toString(), // Преобразуем Decimal в строку
		}));
		if (!serializedProducts) {
			return new NextResponse("Товар не найден", { status: 404 });
		}
		return NextResponse.json({ message: "Товар получен", serializedProducts }, { status: 200 });

	} catch (error) {
		console.error("Ошибки при запросе при получении товара:", error);
		return [];
	}
}
