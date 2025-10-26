// /app/api/admin/product/search/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ----- helpers -----
function parseImages(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw == null || raw === '') return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// разбор запроса с поддержкой префиксов:
// id:123, art:ABC-12, group:Автомобильные, g:119, cat:19, category:Запчасти
// без префиксов: пытаемся как ID, артикул, начало/вхождение в title
function parseQuery(qRaw) {
  const q = (qRaw || '').trim();
  const params = { id: null, article: null, groupId: null, groupTitle: null, categoryId: null, categoryTitle: null, text: null };
  if (!q) return params;

  // разбираем простые префиксы
  const m =
    q.match(/^(id|art|article|g|group|cat|category):(.+)$/i) ||
    q.match(/^(id|art|article|g|group|cat|category)\s+(.+)$/i);

  if (m) {
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    switch (key) {
      case 'id': {
        const n = Number(val);
        if (Number.isInteger(n)) params.id = n;
        break;
      }
      case 'art':
      case 'article':
        params.article = val;
        break;
      case 'g':
        params.groupId = Number(val);
        break;
      case 'group':
        params.groupTitle = val;
        break;
      case 'cat':
        params.categoryId = Number(val);
        break;
      case 'category':
        params.categoryTitle = val;
        break;
      default:
        break;
    }
    return params;
  }

  // без префикса: numeric → возможно id; иначе текст
  if (/^\d+$/.test(q)) {
    params.id = Number(q);
  }
  params.text = q;
  return params;
}

// простая «релевантность» на стороне сервера для сортировки
function scoreItem(item, q) {
  const qLower = (q || '').toLowerCase();
  const t = (item?.title || '').toLowerCase();
  const a = (item?.article || '').toLowerCase();

  let s = 0;
  if (!qLower) return s;
  if (a === qLower) s += 100;            // точное совпадение артикула
  if (t.startsWith(qLower)) s += 40;     // начало названия
  if (t.includes(qLower)) s += 15;       // вхождение в название
  if (a.includes(qLower)) s += 20;       // вхождение в артикул
  return s;
}

// ----- handler -----
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const qRaw = (searchParams.get('q') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    if (!qRaw) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const parsed = parseQuery(qRaw);

    // формируем where: всегда isDeleted=false
    const where = { isDeleted: false };

    // фильтры по id / article
    const OR = [];
    if (parsed.id != null) {
      OR.push({ id: parsed.id });
    }

    // УСИЛЕН: поиск по артикулу (точное, startsWith, contains, варианты регистра)
    if (parsed.article) {
      const a = parsed.article;
      OR.push(
        { article: a },                  // точное совпадение
        { article: { startsWith: a } },  // префикс
        { article: { contains: a } },    // contains
        { article: { contains: a.toUpperCase() } },
        { article: { contains: a.toLowerCase() } },
      );
    }

    // Текст без префикса → ищем по title и article (без mode)
    if (parsed.text) {
      OR.push(
        { title:   { startsWith: parsed.text } },
        { title:   { contains:   parsed.text } },
        { article: { contains:   parsed.text } },
      );
    }

    if (OR.length) where.OR = OR;

    // фильтры по группе/категории (id или название) — без mode (MySQL обычно CI по collation)
    if (parsed.groupId != null) {
      where.groupId = parsed.groupId;
    }
    if (parsed.categoryId != null) {
      where.categoryId = parsed.categoryId;
    }
    if (parsed.groupTitle) {
      where.group = {
        title: { contains: parsed.groupTitle },
      };
    }
    if (parsed.categoryTitle) {
      where.category = {
        title: { contains: parsed.categoryTitle },
      };
    }

    // основной запрос
    const rows = await prisma.product.findMany({
      where,
      select: {
        id: true,
        title: true,
        article: true,
        status: true,
        count: true,
        price: true,
        categoryId: true,
        groupId: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, title: true } },
        group:    { select: { id: true, title: true } },
      },
      orderBy: [{ id: 'desc' }], // базовая сортировка (дальше перебалансируем по score)
      take: limit,
    });

    // нормализуем данные и дорефакторим сортировку по простому score
    const items = rows
      .map((p) => ({
        ...p,
        price: p.price?.toString?.() ?? null,
        images: parseImages(p.images),
      }))
      .sort((a, b) => {
        const sa = scoreItem(a, parsed.text || parsed.article || qRaw);
        const sb = scoreItem(b, parsed.text || parsed.article || qRaw);
        return sb - sa;
      });

    return NextResponse.json({ items }, { status: 200 });
  } catch (e) {
    console.error('SEARCH ERROR:', e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

