// /lib/normalizeProduct.js
export function parseImagesSafe(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw == null || raw === '') return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function normalizeProduct(p) {
  return {
    ...p,
    price: p?.price?.toString?.() ?? p?.price ?? null,
    images: parseImagesSafe(p?.images),
  };
}

export function normalizeProducts(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeProduct);
}
