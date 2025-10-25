// /app/api/admin/price/preview/route.js — СОЗДАЙ ФАЙЛ ПОЛНОСТЬЮ
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

function parseServiceKey() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is empty');
  const creds = JSON.parse(raw);
  if (creds.private_key?.includes('\\n')) {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }
  return creds;
}

async function readSheetAll() {
  const spreadsheetId = process.env.PRICE_SPREADSHEET_ID;
  const sheetName = process.env.PRICE_SHEET_NAME || 'Чистый';
  if (!spreadsheetId) throw new Error('PRICE_SPREADSHEET_ID is empty');

  const credentials = parseServiceKey();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:Z100000`,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  });
  return Array.isArray(data.values) ? data.values : [];
}

function findHeaderRow(rows) {
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i].map((x) => String(x ?? '').trim().toLowerCase());
    if (r.includes('товары') && r.includes('артикул')) return i;
  }
  return -1;
}

export async function GET() {
  try {
    const rows = await readSheetAll();
    if (!rows.length) {
      return new Response(JSON.stringify({ ok: true, items: [], total: 0 }), { status: 200 });
    }
    const headerIdx = findHeaderRow(rows);
    if (headerIdx === -1) {
      return new Response(JSON.stringify({ ok: true, items: [], total: 0, note: 'header not found' }), { status: 200 });
    }

    const table = rows.slice(headerIdx);
    const max = Number(process.env.NEXT_PUBLIC_PRICE_PREVIEW_MAX_ROWS || 500);
    const limited = table.slice(0, max + 1); // с заголовком
    const total = Math.max(0, table.length - 1);

    return new Response(JSON.stringify({ ok: true, items: limited, total }), { status: 200 });
  } catch (e) {
    console.error('preview error:', e);
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
}
