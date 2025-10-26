// /app/api/price/route.js
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ── robust parser for GOOGLE_SERVICE_ACCOUNT_KEY ───────────────────────────────
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

  let key = String(creds.private_key || '');
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  key = key.split('').filter(ch => ch.charCodeAt(0) <= 127).join('');
  key = key.replace(/\r/g, '').replace(/\n{2,}/g, '\n').trim();

  if (!key.startsWith('-----BEGIN PRIVATE KEY-----')) throw new Error('Invalid PEM header');
  if (!key.endsWith('-----END PRIVATE KEY-----')) throw new Error('Invalid PEM footer');

  if (!creds.client_email) throw new Error('client_email missing');

  return { ...creds, private_key: key };
}

function makeAuth() {
  const credentials = parseServiceKey();
  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

export async function GET() {
  try {
    const spreadsheetId = process.env.PRICE_SPREADSHEET_ID;
    const sheetName = process.env.PRICE_SHEET_NAME || 'Чистый';
    if (!spreadsheetId) throw new Error('PRICE_SPREADSHEET_ID is empty');

    const auth = makeAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:E999`,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    const rows = res.data.values || [];
    return new Response(JSON.stringify({ data: rows }), { status: 200 });
  } catch (error) {
    console.error('price GET error:', error);
    return new Response(JSON.stringify({ error: String(error?.message || error) }), { status: 500 });
  }
}
