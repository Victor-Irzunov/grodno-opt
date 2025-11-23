// /app/api/admin/product/one/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

function toMoneyString(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toFixed(3) : "0.000";
}

async function saveUploadsDir() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

/**
 * Достаём массив { original, thumbnail } из FormData:
 * - originalImages: File
 * - thumbnailImages: File
 * Сохраняем в /public/uploads, возвращаем массив объектов для записи в БД.
 */
async function extractImagesFromFormData(fd) {
  const originalFiles = fd.getAll("originalImages") || [];
  const thumbnailFiles = fd.getAll("thumbnailImages") || [];

  if (!originalFiles.length) return [];

  const uploadDir = await saveUploadsDir();
  const saved = [];

  for (let i = 0; i < originalFiles.length; i++) {
    const origFile = originalFiles[i];
    if (!origFile) continue;

    const thumbFile = thumbnailFiles[i];

    const base = `${Date.now()}-${i}-${randomUUID()}`;
    const origName = `${base}-orig.webp`;
    const thumbName = `${base}-thumb.webp`;

    // Оригинал
    const origArrayBuffer = await origFile.arrayBuffer();
    const origBuffer = Buffer.from(origArrayBuffer);
    await fs.writeFile(path.join(uploadDir, origName), origBuffer);

    // Превью (если прилетело)
    if (thumbFile) {
      const thumbArrayBuffer = await thumbFile.arrayBuffer();
      const thumbBuffer = Buffer.from(thumbArrayBuffer);
      await fs.writeFile(path.join(uploadDir, thumbName), thumbBuffer);
    }

    saved.push({
      original: origName,
      thumbnail: thumbName,
    });
  }

  return saved;
}

export async function POST(req) {
  try {
    const ct = req.headers.get("content-type") || "";
    let payload;
    let uploadedImages = [];

    if (ct.includes("application/json")) {
      payload = await req.json();
    } else if (
      ct.includes("multipart/form-data") ||
      ct.includes("application/x-www-form-urlencoded")
    ) {
      const fd = await req.formData();
      uploadedImages = await extractImagesFromFormData(fd);

      payload = {
        title: fd.get("title"),
        article: fd.get("article"),
        count: Number(fd.get("count")),
        price: Number(fd.get("price")),
        status: fd.get("status"),
        categoryId: Number(fd.get("categoryId")),
        groupId: Number(fd.get("groupId")),
        description: fd.get("description") || null,
        images: [], // из формы старых нет
      };
    } else {
      return NextResponse.json(
        { message: "Unsupported Content-Type" },
        { status: 415 }
      );
    }

    const {
      title = "",
      article = "",
      count = 0,
      price = 0,
      status = "В наличии",
      categoryId,
      groupId,
      description = null,
      images = [],
    } = payload || {};

    if (!title?.trim() || !article?.trim()) {
      return NextResponse.json(
        { message: "title и article обязательны" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(categoryId) || !Number.isFinite(groupId)) {
      return NextResponse.json(
        { message: "categoryId и groupId обязательны" },
        { status: 400 }
      );
    }

    const [cat, grp] = await Promise.all([
      prisma.category.findUnique({
        where: { id: Number(categoryId) },
        select: { id: true },
      }),
      prisma.group.findUnique({
        where: { id: Number(groupId) },
        select: { id: true, categoryId: true },
      }),
    ]);
    if (!cat)
      return NextResponse.json(
        { message: "Категория не найдена" },
        { status: 400 }
      );
    if (!grp)
      return NextResponse.json(
        { message: "Группа не найдена" },
        { status: 400 }
      );
    if (grp.categoryId !== Number(categoryId)) {
      return NextResponse.json(
        { message: "Группа не принадлежит выбранной категории" },
        { status: 400 }
      );
    }

    const cleanCount =
      Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
    const cleanPrice = toMoneyString(price);

    // исходные images из payload (обычно пустой массив)
    let baseImages = [];
    if (Array.isArray(images)) {
      baseImages = images;
    } else if (typeof images === "string") {
      try {
        baseImages = JSON.parse(images);
      } catch {
        baseImages = [];
      }
    }

    const finalImages = [...baseImages, ...uploadedImages];

    const exists = await prisma.product.findUnique({ where: { article } });

    if (exists) {
      const updated = await prisma.product.update({
        where: { id: exists.id },
        data: {
          title,
          count: (exists.count || 0) + cleanCount,
          price: cleanPrice,
          status,
          categoryId: Number(categoryId),
          groupId: Number(groupId),
          description: description ?? exists.description ?? null,
          // Сохраняем JSON-строкой, чтобы фронт (OneProductPage / UpdateForm) мог парсить
          images: JSON.stringify(
            finalImages.length ? finalImages : exists.images || []
          ),
        },
      });
      return NextResponse.json(
        { id: updated.id, message: "Товар обновлён", product: updated },
        { status: 200 }
      );
    }

    const created = await prisma.product.create({
      data: {
        title,
        article,
        count: cleanCount,
        price: cleanPrice,
        status,
        categoryId: Number(categoryId),
        groupId: Number(groupId),
        description: description ?? null,
        images: JSON.stringify(finalImages),
        isDeleted: false,
      },
    });

    return NextResponse.json(
      { id: created.id, message: "Товар успешно добавлен", product: created },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const ct = req.headers.get("content-type") || "";
    let payload;
    let uploadedImages = [];

    if (ct.includes("application/json")) {
      payload = await req.json();
    } else {
      // multipart/form-data
      const fd = await req.formData();
      uploadedImages = await extractImagesFromFormData(fd);

      payload = {
        productId: Number(fd.get("productId")),
        title: fd.get("title"),
        article: fd.get("article"),
        count: Number(fd.get("count")),
        price: Number(fd.get("price")),
        status: fd.get("status"),
        categoryId: Number(fd.get("categoryId")),
        groupId: Number(fd.get("groupId")),
        description: fd.get("description") || null,
        images: JSON.parse(fd.get("existingImages") || "[]"),
      };
    }

    const {
      productId,
      title,
      article,
      count,
      price,
      status,
      categoryId,
      groupId,
      description = undefined,
      images = [],
    } = payload || {};

    if (!productId) {
      return NextResponse.json(
        { message: "productId обязателен" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existing) {
      return NextResponse.json(
        { message: "Товар не найден" },
        { status: 404 }
      );
    }

    if (Number.isFinite(categoryId) || Number.isFinite(groupId)) {
      const catId = Number.isFinite(categoryId)
        ? Number(categoryId)
        : existing.categoryId;
      const grpId = Number.isFinite(groupId)
        ? Number(groupId)
        : existing.groupId;
      const grp = await prisma.group.findUnique({
        where: { id: grpId },
        select: { id: true, categoryId: true },
      });
      if (!grp) {
        return NextResponse.json(
          { message: "Группа не найдена" },
          { status: 400 }
        );
      }
      if (grp.categoryId !== catId) {
        return NextResponse.json(
          { message: "Группа не принадлежит выбранной категории" },
          { status: 400 }
        );
      }
    }

    let baseImages = [];
    if (Array.isArray(images)) {
      baseImages = images;
    } else if (typeof images === "string") {
      try {
        baseImages = JSON.parse(images);
      } catch {
        baseImages = [];
      }
    }

    const finalImages = [...baseImages, ...uploadedImages];

    await prisma.product.update({
      where: { id: productId },
      data: {
        title: title ?? existing.title,
        article: article ?? existing.article,
        count: Number.isFinite(count)
          ? Math.max(0, Math.floor(count))
          : existing.count,
        price: Number.isFinite(price) ? toMoneyString(price) : existing.price,
        status: status ?? existing.status,
        categoryId: Number.isFinite(categoryId)
          ? Number(categoryId)
          : existing.categoryId,
        groupId: Number.isFinite(groupId)
          ? Number(groupId)
          : existing.groupId,
        description:
          description === undefined ? existing.description : description,
        images: JSON.stringify(
          finalImages.length ? finalImages : existing.images || []
        ),
      },
    });

    return NextResponse.json(
      { message: "Товар успешно обновлён" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
