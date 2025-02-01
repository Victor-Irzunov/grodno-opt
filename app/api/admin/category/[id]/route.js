import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req, { params: { id } }) {
	try {
		 const { title } = await req.json();

		 if (!title) {
			  return new NextResponse("Название категории не предоставлено", { status: 400 });
		 }

		 const updatedCategory = await prisma.category.update({
			  where: { id: parseInt(id, 10) },
			  data: { title },
		 });

		 if (!updatedCategory) {
			  return new NextResponse("Категория не найдена", { status: 404 });
		 }

		 return NextResponse.json({ message: "Категория успешно отредактирована", updatedCategory }, { status: 200 });
	} catch (error) {
		 console.error("Ошибка при редактировании категории:", error);
		 return new NextResponse("Ошибка при редактировании категории", { status: 500 });
	}
}

export async function DELETE(req, { params: { id } }) {
	try {
		const categoryId = parseInt(id, 10);

		// 1️⃣ Проверяем, существует ли категория
		const categoryExists = await prisma.category.findUnique({
			where: { id: categoryId },
		});

		if (!categoryExists) {
			return new NextResponse("Категория не найдена", { status: 404 });
		}

		// 2️⃣ Удаляем все группы, связанные с этой категорией
		await prisma.group.deleteMany({
			where: { categoryId },
		});

		// 3️⃣ Удаляем все товары, связанные с этой категорией
		await prisma.product.deleteMany({
			where: { categoryId },
		});

		// 4️⃣ Удаляем саму категорию
		const deletedCategory = await prisma.category.delete({
			where: { id: categoryId },
		});

		return NextResponse.json({
			message: "Категория, все группы и связанные товары успешно удалены",
			deletedCategory,
		}, { status: 200 });

	} catch (error) {
		console.error("Ошибка при удалении категории:", error);
		return new NextResponse("Ошибка при удалении категории", { status: 500 });
	}
}
