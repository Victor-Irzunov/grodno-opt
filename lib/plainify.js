// /lib/plainify.js
// Превращаем Prisma Decimal/Date/BigInt и вложенные структуры в plain JS.
// По умолчанию Decimal -> number (можно переключить на string).

let DecimalCtor = null;
try {
  // В Prisma 5/6 Decimal лежит здесь
  ({ Decimal: DecimalCtor } = require('@prisma/client/runtime/library'));
} catch (_) {
  // fallback: без прямого импорта попробуем по признакам у объекта
  DecimalCtor = null;
}

const isDecimal = (v) => {
  if (!v || typeof v !== 'object') return false;
  if (DecimalCtor && v instanceof DecimalCtor) return true;
  // эвристика на случай отсутствия импорта
  return typeof v.toNumber === 'function' && typeof v.toFixed === 'function';
};

export function plainify(value, { decimal = 'number' } = {}) {
  if (value == null) return value;

  // Decimal
  if (isDecimal(value)) {
    return decimal === 'string' ? value.toString() : value.toNumber();
  }

  // Date
  if (value instanceof Date) return value.toISOString();

  // BigInt
  if (typeof value === 'bigint') return Number.isSafeInteger(Number(value)) ? Number(value) : value.toString();

  // Array
  if (Array.isArray(value)) return value.map((v) => plainify(v, { decimal }));

  // Object (включая Prisma Json)
  if (typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) {
      out[k] = plainify(value[k], { decimal });
    }
    return out;
  }

  // Примитивы
  return value;
}
