// /app/api/admin/fx/route.js
export const dynamic = 'force-dynamic';

async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Bad status ${res.status} for ${url}`);
  return res.json();
}

export async function GET() {
  try {
    const data = await fetchJSON('https://api.nbrb.by/exrates/rates?periodicity=0');
    const get = (abbr) => data.find((r) => r?.Cur_Abbreviation === abbr)?.Cur_OfficialRate;
    const rateRUB = get('RUB');
    const rateCNY = get('CNY');
    const rateUSD = get('USD');

    if (!rateUSD) throw new Error('USD rate missing');

    const payload = {
      RUBtoUSD: rateRUB && rateUSD ? rateRUB / rateUSD : null,
      CNYtoUSD: rateCNY && rateUSD ? rateCNY / rateUSD : null,
      BYNperUSD: rateUSD, // 1 USD = X BYN
      at: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ ok: true, ...payload }), { status: 200 });
  } catch (e) {
    console.error('fx error:', e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 500 });
  }
}
