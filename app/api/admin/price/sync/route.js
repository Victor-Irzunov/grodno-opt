// /app/api/admin/price/sync/route.js — СОЗДАЙ ФАЙЛ ПОЛНОСТЬЮ
import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

function parseServiceKey() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is empty');
  const creds = JSON.parse(raw);
  if (creds.private_key?.includes('\\n')) {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }
  return creds;
}

async function readSheet() {
  const spreadsheetId = process.env.PRICE_SPREADSHEET_ID;
  const sheetName = process.env.PRICE_SHEET_NAME || 'Чистый';
  if (!spreadsheetId) throw new Error('PRICE_SPREADSHEET_ID is empty');

  const credentials = parseServiceKey();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // читаем весь лист: вверху 2 строки отчёта, далее — заголовок и данные (у тебя)
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:Z100000`,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  });
  const rows = Array.isArray(data.values) ? data.values : [];
  if (!rows.length) return { header: [], items: [] };

  // найдём строку заголовка динамически (ищем «товары» + «артикул»)
  const headerIdx = rows.findIndex((r) => {
    const low = (r || []).map((x) => String(x ?? '').trim().toLowerCase());
    return low.includes('товары') && low.includes('артикул');
  });
  if (headerIdx === -1) return { header: [], items: [] };

  const header = rows[headerIdx].map((x) => String(x ?? '').trim().toLowerCase());
  const dataRows = rows.slice(headerIdx + 1);

  // карта колонок
  const colTitle = header.findIndex((c) => c === 'товары');
  const colArt   = header.findIndex((c) => c === 'артикул');
  const colPrice = header.findIndex((c) => c === 'цена');
  const colQty   = header.findIndex((c) => c === 'количество');

  return {
    header,
    items: dataRows.map((r) => ({
      title: String((r[colTitle] ?? '')).trim(),
      article: String((r[colArt] ?? '')).trim(),
      price: Number(r[colPrice] ?? 0),
      qty: Number(r[colQty] ?? 0),
    })),
  };
}

function toMoneyString(n) {
  if (Number.isFinite(n)) return n.toFixed(3); // под Decimal(12,3)
  return '0.000';
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const mode = body?.mode === 'receive' ? 'receive' : 'reprice'; // по умолчанию — переоценка
  const fx = Number(body?.exchangeRate || 0);
  const applyFx = Number.isFinite(fx) && fx > 0 ? fx : null;

  const DEFAULT_CATEGORY_ID = process.env.DEFAULT_CATEGORY_ID ? Number(process.env.DEFAULT_CATEGORY_ID) : null;
  const DEFAULT_GROUP_ID = process.env.DEFAULT_GROUP_ID ? Number(process.env.DEFAULT_GROUP_ID) : null;

  try {
    const { items } = await readSheet();

    // фильтруем мусор
    const clean = items.filter((x) => x.article && x.title);
    if (!clean.length) {
      return new Response(JSON.stringify({ ok: false, error: 'Нет валидных строк (проверь лист "Чистый")' }), { status: 200 });
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let missingForCreate = 0;
    let qtyIncreased = 0;

    for (const row of clean) {
      const article = row.article;
      const title = row.title;
      const qty = Number.isFinite(row.qty) ? Math.max(0, Math.floor(row.qty)) : 0;
      let price = Number.isFinite(row.price) ? row.price : 0;
      if (applyFx) price = price * applyFx;

      // ищем по артикулу
      const existing = await prisma.product.findUnique({ where: { article } });

      if (existing) {
        // обновление цены/названия
        const dataUpd = {
          title: title || existing.title,
          price: toMoneyString(price),
        };

        if (mode === 'receive' && qty > 0) {
          dataUpd.count = (existing.count || 0) + qty;
          qtyIncreased += qty;
        }

        await prisma.product.update({
          where: { id: existing.id },
          data: dataUpd,
        });
        updated += 1;
      } else {
        // нет товара
        if (!DEFAULT_CATEGORY_ID || !DEFAULT_GROUP_ID) {
          // создавать нельзя — нет обязательных foreign keys
          missingForCreate += 1;
          continue;
        }
        await prisma.product.create({
          data: {
            title: title || 'Без названия',
            status: 'active',
            count: mode === 'receive' ? qty : 0,
            price: toMoneyString(price),
            article,
            groupId: DEFAULT_GROUP_ID,
            categoryId: DEFAULT_CATEGORY_ID,
            isDeleted: false,
          },
        });
        created += 1;
        if (mode === 'receive' && qty > 0) qtyIncreased += qty;
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      mode,
      created,
      updated,
      skipped,
      missingForCreate,
      qtyIncreased,
    }), { status: 200 });
  } catch (e) {
    console.error('sync error:', e);
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
}
