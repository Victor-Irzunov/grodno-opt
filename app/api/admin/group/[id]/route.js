import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params: { id } }) {
	try {
		const groupsOneCategory = await prisma.group.findMany({
			where: { categoryId: parseInt(id, 10) },
		});

		if (!groupsOneCategory) {
			return new NextResponse("Группы не найдены", { status: 404 });
		}

		return NextResponse.json({ groupsOneCategory });
	} catch (error) {
		console.error("Ошибка при получении групп одной категории:", error);
		return new NextResponse("Ошибка при получении групп одной категории", { status: 500 });
	}
}


export async function PUT(req, { params: { id } }) {
	try {
		 const { title } = await req.json();

		 if (!title) {
			  return new NextResponse("Название группы не предоставлено", { status: 400 });
		 }

		 const updatedGroup = await prisma.group.update({
			  where: { id: parseInt(id, 10) },
			  data: { title },
		 });

		 if (!updatedGroup) {
			  return new NextResponse("Группа не найдена", { status: 404 });
		 }

		 return NextResponse.json({ message: "Группа успешно отредактирована", updatedGroup }, { status: 200 });
	} catch (error) {
		 console.error("Ошибка при редактировании группы:", error);
		 return new NextResponse("Ошибка при редактировании группы", { status: 500 });
	}
}

export async function DELETE(req, { params: { id } }) {
	try {
		 await prisma.product.deleteMany({
			  where: { groupId: parseInt(id, 10) },
		 });
		 const deleteGroup = await prisma.group.delete({
			  where: { id: parseInt(id, 10) },
		 });
		 if (!deleteGroup) {
			  return new NextResponse("Группа не найдена", { status: 404 });
		 }
		 return NextResponse.json({ message: "Группа и связанные товары успешно удалены", deleteGroup }, { status: 200 });
	} catch (error) {
		 console.error("Ошибка при удалении группы:", error);
		 return new NextResponse("Ошибка при удалении группы", { status: 500 });
	}
}
