import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const data = await req.json(); 
        const userData = await prisma.userData.create({
            data: {
                fullName: data.fullName,
                phone: data.phone,
                userId: data.userId, // Получаем userId из данных запроса
            },
        });
        return NextResponse.json({ message: 'User data saved successfully', userData }, { status: 200 });
    } catch (error) {
        console.error('Error saving user data:', error);
        return NextResponse.json({ message: 'Error saving user data', error }, { status: 500 });
    }
}
