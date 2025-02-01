import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();
    console.log("🚀 🚀 🚀  _ POST _ formData:", formData);

    const title = formData.get('title');
    const article = formData.get('article');
    const count = Number(formData.get('count'));
    const price = Number(formData.get('price'));
    const status = formData.get('status');
    const categoryId = Number(formData.get('categoryId'));
    const groupId = Number(formData.get('groupId'));

    const originalImages = formData.getAll('originalImages');
    const thumbnailImages = formData.getAll('thumbnailImages');
    const images = [];

    for (let i = 0; i < originalImages.length; i++) {
      const originalFile = originalImages[i];
      const thumbnailFile = thumbnailImages[i];

      if (originalFile instanceof File && thumbnailFile instanceof File) {
        const uniqueName = uuidv4();
        const originalName = `${uniqueName}.webp`;
        const thumbnailName = `thumb_${uniqueName}.webp`;

        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const originalPath = path.join(uploadDir, originalName);
        const thumbnailPath = path.join(uploadDir, thumbnailName);

        await fs.writeFile(originalPath, Buffer.from(await originalFile.arrayBuffer()));
        await fs.writeFile(thumbnailPath, Buffer.from(await thumbnailFile.arrayBuffer()));

        images.push({
          original: originalName,
          thumbnail: thumbnailName,
        });
      }
    }

    const product = await prisma.product.create({
      data: {
        title,
        article,
        count,
        price,
        status,
        categoryId,
        groupId,
        images: JSON.stringify(images),
      },
    });

    return NextResponse.json({ message: 'Товар успешно добавлен', product }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
