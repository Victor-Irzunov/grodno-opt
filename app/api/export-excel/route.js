import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {

	const getProducts = await prisma.product.findMany({
		select: {
			title: true,
			article: true,
			price: true,
		},
	}
	);

	const data = getProducts.map(p => ({
		Название: p.title,
		Артикул: p.article,
		Цена: parseFloat(p.price), // 👈 важно
	}));

	const ws = XLSX.utils.json_to_sheet(data);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Прайс');

	const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

	return new NextResponse(buffer, {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': 'attachment; filename="price.xlsx"',
		},
	});
}
