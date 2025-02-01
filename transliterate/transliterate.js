import CyrillicToTranslit from 'cyrillic-to-translit-js';

const cyrillicToTranslit = new CyrillicToTranslit();

// Транслитерация: кириллица в латиницу
export function transliterate(text) {
  return cyrillicToTranslit.transform(text);
}

// Обратная транслитерация: латиница в кириллицу
export function reverseTransliterate(text) {
  // Словарь для обратного сопоставления (латиница -> кириллица)
  const translitMap = {
    'ya': 'я', 'yo': 'ё', 'yu': 'ю', 'zh': 'ж', 'kh': 'х', 'ts': 'ц',
    'ch': 'ч', 'sh': 'ш', 'shch': 'щ', 'e': 'э', 'a': 'а', 'b': 'б',
    'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'z': 'з', 'i': 'и', 'y': 'й',
    'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р',
    's': 'с', 't': 'т', 'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'ch': 'ч',
    'ya': 'я', 'ye': 'е', 'yu': 'ю', 'yo': 'ё'
  };

  // Сортируем ключи по длине, чтобы сначала обрабатывать более длинные комбинации
  const translitKeys = Object.keys(translitMap).sort((a, b) => b.length - a.length);

  // Заменяем тире на пробелы
  let result = text.replace(/-/g, ' ');

  // Преобразование латиницы в кириллицу, заменяя по словарю
  translitKeys.forEach((key) => {
    const regex = new RegExp(key, 'gi');
    result = result.replace(regex, (match) =>
      match === match.toLowerCase()
        ? translitMap[key]
        : translitMap[key].toUpperCase()
    );
  });

  return result;
}
