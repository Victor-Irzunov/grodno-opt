// /app/api/admin/price/sync/route.js  — ФАЙЛ ПОЛНОСТЬЮ
import { google } from 'googleapis';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const prisma = new PrismaClient();

/* ───────────────────────── GOOGLE KEY ───────────────────────── */
function parseServiceKey() {
  let raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is empty');
  raw = raw.trim();

  if (
    (raw.startsWith('`') && raw.endsWith('`')) ||
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1);
  }

  if (/^BASE64:/i.test(raw)) {
    const b64 = raw.replace(/^BASE64:/i, '').trim();
    raw = Buffer.from(b64, 'base64').toString('utf8').trim();
  }

  const creds = JSON.parse(raw);
  if (creds.private_key?.includes('\\n')) {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }
  if (!creds.client_email || !creds.private_key) {
    throw new Error('Bad GOOGLE_SERVICE_ACCOUNT_KEY (no client_email/private_key)');
  }
  return creds;
}
function makeAuth(scopes) {
  const c = parseServiceKey();
  return new google.auth.JWT({
    email: c.client_email,
    key: c.private_key,
    scopes: Array.isArray(scopes) ? scopes : [scopes],
  });
}

/* ───────────────────────── HELPERS ───────────────────────── */
function toNumberSafe(x) {
  if (typeof x === 'number') return x;
  const s = String(x ?? '').replace(/\s+/g, '').replace(',', '.').trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}
function toMoneyString(n) {
  if (Number.isFinite(n)) return Number(n).toFixed(3);
  return '0.000';
}
function priceHash(items) {
  const payload = items
    .map(({ article, price, qty }) => ({
      a: String(article || ''),
      p: Number.isFinite(price) ? Number(price) : 0,
      q: Number.isFinite(qty) ? Number(qty) : 0,
    }))
    .sort((x, y) => (x.a < y.a ? -1 : x.a > y.a ? 1 : 0));
  const str = JSON.stringify(payload);
  return crypto.createHash('sha256').update(str).digest('hex');
}

/** «мусорная» строка (повтор заголовков в середине, пустышки и т.п.) */
function isJunkRow(row) {
  const t = String(row.title || '').trim().toLowerCase();
  const a = String(row.article || '').trim().toLowerCase();
  if (!t && !a) return true;
  // типовой случай из твоего скрина: "Товары (работы, услуги)" + "Артикул" + 0/0
  if (a === 'артикул') return true;
  if (/^товары(\b|[\s(])/i.test(t)) return true;
  // ещё чаще «пустышки» с нулевыми значениями:
  if (!a && !t) return true;
  return false;
}

/* ───────────────────────── READ: GViz fallback ───────────────────────── */
async function readViaGViz(spreadsheetId, sheetName) {
  const url =
    `https://docs.google.com/spreadsheets/d/${encodeURIComponent(
      spreadsheetId
    )}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(sheetName)}`;

  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();

  const start = text.indexOf('(');
  const end = text.lastIndexOf(')');
  if (start === -1 || end === -1) throw new Error('GViz: bad envelope');

  const json = JSON.parse(text.slice(start + 1, end));
  const cols = (json.table?.cols || []).map((c) => String(c.label || '').trim().toLowerCase());
  const rows = json.table?.rows || [];

  let colTitle = cols.findIndex((c) => c.includes('товар'));
  let colArt   = cols.findIndex((c) => c.includes('артикул') || c.includes('sku') || c.includes('код'));
  let colPrice = cols.findIndex((c) => c.includes('цена'));
  let colQty   = cols.findIndex((c) => c.includes('колич'));
  if (colTitle === -1 || colArt === -1 || colPrice === -1 || colQty === -1) {
    colTitle = 0; colArt = 1; colPrice = 2; colQty = 3;
  }

  const items = rows.map((r, i) => {
    const cells = r.c || [];
    const v = (idx) => {
      const cell = cells[idx];
      const val = cell ? (cell.f ?? cell.v) : '';
      return val;
    };
    return {
      _rowIndex: i + 2,
      title: String(v(colTitle) ?? '').trim(),
      article: String(v(colArt) ?? '').trim(),
      price: toNumberSafe(v(colPrice)),
      qty: Math.max(0, Math.floor(toNumberSafe(v(colQty)))),
    };
  });

  const header = ['товары', 'артикул', 'цена', 'количество'];
  const totalRows = (json.table?.rows || []).length + 1;
  return { header, items, source: 'gviz', totalRows, headerRowIndex: 0 };
}

/* ───────────────────────── READ: API first ───────────────────────── */
async function readSheetRows() {
  const spreadsheetId = process.env.PRICE_SPREADSHEET_ID;
  const sheetName = process.env.PRICE_SHEET_NAME || 'Чистый';
  if (!spreadsheetId) throw new Error('PRICE_SPREADSHEET_ID is empty');

  try {
    const auth = makeAuth('https://www.googleapis.com/auth/spreadsheets.readonly');
    const sheets = google.sheets({ version: 'v4', auth });
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z100000`,
      valueRenderOption: 'UNFORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    });

    const allRows = Array.isArray(data.values) ? data.values : [];
    const totalRows = allRows.length;

    if (!allRows.length) {
      return { spreadsheetId, sheetName, header: [], items: [], source: 'api', totalRows, headerRowIndex: -1 };
    }

    const headerRowIndex = allRows.findIndex((r) => {
      const low = (r || []).map((x) => String(x ?? '').trim().toLowerCase());
      return low.includes('товары') && low.includes('артикул');
    });
    if (headerRowIndex === -1) {
      return { spreadsheetId, sheetName, header: [], items: [], source: 'api', totalRows, headerRowIndex: -1 };
    }

    const header = allRows[headerRowIndex].map((x) => String(x ?? '').trim().toLowerCase());
    const dataRows = allRows.slice(headerRowIndex + 1);

    const colTitle = header.findIndex((c) => c === 'товары');
    const colArt   = header.findIndex((c) => c === 'артикул');
    const colPrice = header.findIndex((c) => c === 'цена');
    const colQty   = header.findIndex((c) => c === 'количество');

    const items = dataRows.map((r, i) => ({
      _rowIndex: headerRowIndex + 2 + i,
      title: String((r[colTitle] ?? '')).trim(),
      article: String((r[colArt] ?? '')).trim(),
      price: toNumberSafe(r[colPrice]),
      qty: Math.max(0, Math.floor(toNumberSafe(r[colQty]))),
    }));

    return { spreadsheetId, sheetName, header, items, source: 'api', totalRows, headerRowIndex };
  } catch (e) {
    console.warn('[price/sync] API read failed, fallback to GViz:', e?.message || e);
    const g = await readViaGViz(spreadsheetId, sheetName);
    return { spreadsheetId, sheetName, ...g };
  }
}

/* ───────────────────────── WRITE: keep only unresolved ───────────────────────── */
async function writeBackUnresolved({ spreadsheetId, sheetName, header, unresolved, source }) {
  if (source === 'gviz') return { wrote: false, reason: 'gviz_readonly' };

  const auth = makeAuth('https://www.googleapis.com/auth/spreadsheets');
  const sheets = google.sheets({ version: 'v4', auth });

  const outHeader = header.length ? header : ['Товары', 'Артикул', 'Цена', 'Количество'];
  const values = [outHeader].concat(
    unresolved.map((u) => [
      u.title || '',
      u.article || '',
      Number.isFinite(u.price) ? u.price : 0,
      Number.isFinite(u.qty) ? u.qty : 0,
    ])
  );

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });

  return { wrote: true, reason: 'updated_sheet' };
}

/* ───────────────────────── MAIN ───────────────────────── */
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const fx = Number(body?.exchangeRate || 0);
  const applyFx = Number.isFinite(fx) && fx > 0 ? fx : null;

  const DEFAULT_CATEGORY_ID = process.env.DEFAULT_CATEGORY_ID ? Number(process.env.DEFAULT_CATEGORY_ID) : null;
  const DEFAULT_GROUP_ID    = process.env.DEFAULT_GROUP_ID ? Number(process.env.DEFAULT_GROUP_ID) : null;

  try {
    const ctx = await readSheetRows();
    const { spreadsheetId, sheetName, header, items, source } = ctx;

    // фильтр валидных + выкидываем «ложные заголовки»
    const incoming = items
      .filter((x) => x.article && x.title)
      .filter((x) => !isJunkRow(x));

    if (!incoming.length) {
      return new Response(JSON.stringify({ ok: false, error: 'Нет валидных строк (проверь лист "Чистый")' }), { status: 200 });
    }

    // антидубль
    const hash = priceHash(incoming);
    const already = await prisma.priceHash.findUnique({ where: { hash } }).catch(() => null);
    if (already) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Этот прайс уже был применён (антидубль). Обновите лист или измените данные.',
          reason: 'already_applied',
        }),
        { status: 200 }
      );
    }

    // индекс групп
    const groups = await prisma.group.findMany({ select: { id: true, title: true, categoryId: true } });
    const groupsIndex = groups.map((g) => ({ id: g.id, categoryId: g.categoryId, titleLower: String(g.title || '').toLowerCase() }));
    const pickBestGroup = (title) => {
      const t = String(title || '').toLowerCase();
      let best = null;
      for (const g of groupsIndex) {
        if (g.titleLower && t.includes(g.titleLower)) {
          if (!best || g.titleLower.length > best.titleLower.length) best = g;
        }
      }
      return best;
    };

    let created = 0;
    let updated = 0;
    let qtyIncreased = 0;

    const successful = new Set();
    const unresolved = [];

    for (const row of incoming) {
      const article = row.article;
      const title = row.title;
      const qty = Number.isFinite(row.qty) ? Math.max(0, Math.floor(row.qty)) : 0;
      let price = Number.isFinite(row.price) ? row.price : 0;
      if (applyFx) price *= applyFx;

      const existing = await prisma.product.findUnique({ where: { article } });

      if (existing) {
        const dataUpd = { title: title || existing.title, price: toMoneyString(price) };
        if (qty > 0) {
          dataUpd.count = (existing.count || 0) + qty;
          qtyIncreased += qty;
        }
        await prisma.product.update({ where: { id: existing.id }, data: dataUpd });
        updated += 1;
        successful.add(article);
      } else {
        const best = pickBestGroup(title);

        if (best) {
          await prisma.product.create({
            data: {
              title: title || 'Без названия',
              status: 'В наличии',
              count: qty,
              price: toMoneyString(price),
              article,
              groupId: best.id,
              categoryId: best.categoryId,
              isDeleted: false,
              images: [],
            },
          });
          created += 1;
          if (qty > 0) qtyIncreased += qty;
          successful.add(article);
        } else if (DEFAULT_CATEGORY_ID && DEFAULT_GROUP_ID) {
          await prisma.product.create({
            data: {
              title: title || 'Без названия',
              status: 'В наличии',
              count: qty,
              price: toMoneyString(price),
              article,
              groupId: DEFAULT_GROUP_ID,
              categoryId: DEFAULT_CATEGORY_ID,
              isDeleted: false,
              images: [],
            },
          });
          created += 1;
          if (qty > 0) qtyIncreased += qty;
          successful.add(article);
        } else {
          unresolved.push(row);
        }
      }
    }

    const stillUnresolved = incoming.filter((x) => !successful.has(x.article));

    if (successful.size > 0) {
      await prisma.priceHash.create({ data: { hash } }).catch(() => {});
    }

    const writeInfo = await writeBackUnresolved({
      spreadsheetId,
      sheetName,
      header,
      unresolved: stillUnresolved,
      source,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        mode: 'receive',
        created,
        updated,
        qtyIncreased,
        unresolved: stillUnresolved.length,
        unresolvedItems: stillUnresolved.map(x => ({
          title: x.title,
          article: x.article,
          price: x.price,
          qty: x.qty,
        })),
        writeBack: writeInfo.wrote ? 'updated_sheet' : writeInfo.reason,
      }),
      { status: 200 }
    );
  } catch (e) {
    console.error('sync error:', e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 500 });
  }
}
