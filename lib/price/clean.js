// /lib/price/clean.js — СОЗДАЙ ФАЙЛ
export function normValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') {
    const trimmed = v.trim();
    const numeric = trimmed.replace(/\s+/g, '').replace(',', '.');
    if (/^-?\d+(\.\d+)?$/.test(numeric)) return parseFloat(numeric);
    return trimmed;
  }
  return v;
}

export function isRowEmpty(row) {
  return row.every((c) => c === '' || c === null || c === undefined);
}

export function buildIndexByHeader(headerRow, wantedHeaders) {
  const idx = {};
  wantedHeaders.forEach((h) => {
    const i = headerRow.indexOf(h);
    if (i === -1) throw new Error('Колонка не найдена: ' + h);
    idx[h] = i;
  });
  return idx;
}

export function cleanRow(rawRow, idx) {
  const r = rawRow.map(normValue);
  return [
    String(r[idx['Товары (работы, услуги)']] ?? '').trim(), // title
    String(r[idx['Артикул']] ?? '').trim(),                 // article
    r[idx['Цена']],                                         // price
    r[idx['Количество']] ?? 0,                              // qty
  ];
}
