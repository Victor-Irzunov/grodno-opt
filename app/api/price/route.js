import { google } from 'googleapis';

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1YIgHohucNa1urtDPTrNAAMYzvOZellSWDdHDCX_XM7w';
    const range = 'Лист1!A1:E999';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ message: 'No data found.' }), { status: 200 });
    }

    return new Response(JSON.stringify({ data: rows }), { status: 200 });
  } catch (error) {
    console.error("🚀 🚀 🚀  _ GET _ error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
