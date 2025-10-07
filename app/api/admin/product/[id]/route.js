import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
// import crypto from 'crypto';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

export async function GET(req, { params: { id } }) {
	try {

		const oneProduct = await prisma.product.findFirst({
			where: { id: parseInt(id, 10) },
		});

		if (!oneProduct) {
			return new NextResponse("Товар не найден", { status: 404 });
	  }

	  return NextResponse.json({ message: "Товар получен", oneProduct }, { status: 200 });
 
	} catch (error) {
	  console.error('Ошибка при получении товара:', error);
	  return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
	}
 }
 
 