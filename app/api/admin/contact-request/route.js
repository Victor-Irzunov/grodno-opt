// /app/api/admin/contact-request/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const list = await prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(list);
}

export async function PATCH(req) {
  const { id, isViewed } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const updated = await prisma.contactRequest.update({
    where: { id: Number(id) },
    data: { isViewed: Boolean(isViewed) },
  });
  return NextResponse.json(updated);
}
