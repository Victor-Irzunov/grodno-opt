// /lib/price/config.js — СОЗДАЙ ФАЙЛ
export const WANTED_HEADERS = [
  'Товары (работы, услуги)', // title
  'Артикул',                  // article
  'Цена',                     // price
  'Количество',               // qty
];

export const OUTPUT_HEADERS = ['Товары', 'Артикул', 'Цена', 'Количество'];

export const ITOGO_MATCH = (str) =>
  typeof str === 'string' && str.replace(/\s+/g, '').toLowerCase().startsWith('итого');
