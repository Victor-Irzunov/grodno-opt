import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();


export async function GET(req) {
	console.log("🚀 🚀 🚀  _ GET ____________________:")
  try {
	 const products = await prisma.product.findMany();
	 console.log("🚀 🚀 🚀  _ GET _ products:", products)

	  
	 return NextResponse.json(products, { status: 200 });
  } catch (error) {
	 console.error('Ошибка при получении категорий:', error);
	 return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}

