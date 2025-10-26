// /app/api/admin/price/preview/route.js — ФАЙЛ ПОЛНОСТЬЮ
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ====== ПАРАМЕТРЫ ТАБЛИЦЫ ======
const SHEET_ID = process.env.PRICE_SPREADSHEET_ID || '1uPqnr0Z50aLmjpMi83W0bYLy5N3UWzpj1q_ig_icU-w';
const SHEET_NAME = process.env.PRICE_SHEET_NAME || 'Чистый';
const SHEET_GID = process.env.PRICE_SHEET_GID || '1910543310'; // из URL
const PREVIEW_MAX = Number(process.env.NEXT_PUBLIC_PRICE_PREVIEW_MAX_ROWS || 500);

// ====== CSV fallback (без ключей) ======
async function fetchCsvFallback() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  const text = await res.text();
  return parseCsv(text);
}

// Простой CSV-парсер (кавычки/запятые/переносы)
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"'; i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell); cell = '';
      } else if (ch === '\n') {
        row.push(cell); rows.push(row); row = []; cell = '';
      } else if (ch === '\r') {
        // skip
      } else {
        cell += ch;
      }
    }
  }
  row.push(cell);
  rows.push(row);
  return rows;
}

// ====== Service Account ======
function parseServiceKey() {
  let raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is empty');

  raw = raw.trim();
  if (
    (raw.startsWith('`') && raw.endsWith('`')) ||
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) raw = raw.slice(1, -1);
  if (/^BASE64:/i.test(raw)) raw = Buffer.from(raw.replace(/^BASE64:/i, ''), 'base64').toString('utf8');

  const creds = JSON.parse(raw);

  let key = String(creds.private_key || '');
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  key = key.split('').filter(c => c.charCodeAt(0) <= 127).join('').replace(/\r/g, '').trim();

  if (!key.startsWith('-----BEGIN PRIVATE KEY-----') || !key.endsWith('-----END PRIVATE KEY-----'))
    throw new Error('Invalid private key');

  if (!creds.client_email) throw new Error('client_email missing');
  return { ...creds, private_key: key };
}

async function readViaApi() {
  const credentials = parseServiceKey();
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:Z100000`,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  });
  return Array.isArray(data.values) ? data.values : [];
}

// ====== Поиск «правильной» шапки ======
function findHeaderRow(rows) {
  for (let i = 0; i < rows.length; i++) {
    const r = (rows[i] || []).map((x) => String(x ?? '').trim().toLowerCase());
    if (r.includes('товары') && r.includes('артикул')) return i;
  }
  return -1;
}

// ====== Фильтр мусорных «шапок» внутри данных ======
function isFalseHeaderRow(row, headerLower) {
  // Нормализуем
  const c0 = String(row?.[0] ?? '').trim().toLowerCase();
  const c1 = String(row?.[1] ?? '').trim().toLowerCase();
  const c2 = String(row?.[2] ?? '').trim();
  const c3 = String(row?.[3] ?? '').trim();

  // 1) точный повтор названий колонок
  const header0 = headerLower?.[0] ?? '';
  const header1 = headerLower?.[1] ?? '';
  const looksLikeHeader =
    (c0 === header0 && c1 === header1) ||
    (c0.startsWith('товары') && c1 === 'артикул');

  // 2) часто в таких ложных строках цена/кол-во = 0/0
  const zeros = (c2 === '0' || c2 === '') && (c3 === '0' || c3 === '');

  return looksLikeHeader || (c0.startsWith('товары') && c1 === 'артикул') || (looksLikeHeader && zeros);
}

// ====== Handler ======
export async function GET() {
  try {
    let rows = [];
    // 1) API
    try {
      rows = await readViaApi();
    } catch (e) {
      // 2) fallback CSV
      console.warn('[price/preview] API failed, fallback to CSV:', e?.message || e);
      rows = await fetchCsvFallback();
    }

    if (!rows.length) {
      return new Response(JSON.stringify({ ok: true, items: [], total: 0 }), { status: 200 });
    }

    const headerIdx = findHeaderRow(rows);
    if (headerIdx === -1) {
      const limited = rows.slice(0, Math.min(rows.length, PREVIEW_MAX + 1));
      return new Response(JSON.stringify({ ok: true, items: limited, total: Math.max(0, rows.length - 1), note: 'header not found' }), { status: 200 });
    }

    // Таблица начиная с первой шапки
    const header = rows[headerIdx];
    const headerLower = (header || []).map((x) => String(x ?? '').trim().toLowerCase());

    const dataRows = rows
      .slice(headerIdx + 1)
      // выкидываем «ложные шапки» внутри данных
      .filter((r) => !isFalseHeaderRow(r, headerLower));

    // ограничиваем превью
    const limited = [header, ...dataRows.slice(0, PREVIEW_MAX)];
    const total = Math.max(0, dataRows.length);

    return new Response(JSON.stringify({ ok: true, items: limited, total }), { status: 200 });
  } catch (e) {
    console.error('preview error:', e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 500 });
  }
}
