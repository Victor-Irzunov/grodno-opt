import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function updateGoogleSheet(missingProducts) {
  console.log("🚀 🚀 🚀  _ updateGoogleSheet _ missingProducts:", missingProducts)
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    credentials.private_key = credentials.private_key.replace(/\\n/gm, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '19ZW3bldMwigzf-D1xTDM_PavpVieils_taYE1CpTpF4';

    const range = 'Лист1!A1:E999';

    // Данные для добавления в таблицу
    const values = missingProducts.map((product) => [
      '',
      product.article,
      product.title,
      product.count,
      product.price,
    ]);

    // Добавляем данные в таблицу
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Данные успешно добавлены в Google Таблицу');

    // Получаем начальную строку, куда добавлены данные
    const updatesRange = appendResponse.data.updates.updatedRange; // Пример: 'Лист1!A2:E6'
    const startRow = parseInt(updatesRange.match(/A(\d+):/)[1], 10);

    // Формируем запрос на изменение цвета ячеек
    const requests = [];
    for (let i = 0; i < missingProducts.length; i++) {
      const rowIndex = startRow + i - 1; // Начинаем с 0
      requests.push({
        repeatCell: {
          range: {
            sheetId: 0, // ID листа (обычно первый лист = 0, можно уточнить в таблице)
            startRowIndex: rowIndex,
            endRowIndex: rowIndex + 1,
            startColumnIndex: 1,
            endColumnIndex: 5, // A-D (не включая E)
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 1, green: 1, blue: 0 }, // Жёлтый фон
              textFormat: {
                foregroundColor: { red: 1, green: 0, blue: 0 }, // Красный текст
                bold: true,
              },
            },
          },
          fields: 'userEnteredFormat(backgroundColor, textFormat)',
        },
      });
    }

    // Выполняем запрос для форматирования
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });

    console.log('Форматирование таблицы успешно обновлено');
  } catch (error) {
    console.error('Ошибка при обновлении Google Таблицы:', error);
  }
}





// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const rawProducts = body.data;

//     if (!rawProducts || !Array.isArray(rawProducts)) {
//       return NextResponse.json(
//         { message: 'Продукты не предоставлены или неверный формат данных' },
//         { status: 400 }
//       );
//     }

//     // Генерация хеш-суммы для прайса
//     const hash = crypto.createHash('sha256').update(JSON.stringify(rawProducts)).digest('hex');

//     // Проверка наличия хеша в базе
//     const existingHash = await prisma.priceHash.findUnique({
//       where: { hash },
//     });

//     if (existingHash) {
//       return NextResponse.json(
//         { message: 'Этот прайс уже был загружен ранее', success: false },
//         { status: 400 }
//       );
//     }

//     // Сохранение нового хеша в базе
//     await prisma.priceHash.create({
//       data: { hash },
//     });

//     // Далее ваша логика обработки продуктов
//     const [headers, ...rows] = rawProducts;

//     if (!headers || headers.length < 5 || !rows.length) {
//       return NextResponse.json(
//         { message: 'Некорректный формат данных в прайсе' },
//         { status: 400 }
//       );
//     }

//     const products = rows.map((row) => ({
//       title: row[2]?.trim() || '',
//       article: row[1]?.trim() || '',
//       count: parseInt(row[3], 10) || 0,
//       price: parseFloat(row[4], 10) || 0,
//     }));

//     const categories = await prisma.category.findMany({
//       include: { groups: true },
//     });

//     const categoryMap = new Map();
//     categories.forEach((category) => {
//       category.groups.forEach((group) => {
//         categoryMap.set(`${category.title}-${group.title}`.toLowerCase(), {
//           category,
//           group,
//         });
//       });
//     });

//     const missingProducts = [];
//     const results = [];
//     const errors = [];

//     for (const product of products) {
//       try {
//         const { title, article, count, price } = product;

//         if (!title || !article || count <= 0 || price <= 0) {
//           throw new Error(`Некорректные данные для продукта: ${JSON.stringify(product)}`);
//         }

//         const unitPrice = price;

//         let matchedCategory = null;
//         let matchedGroup = null;

//         for (const [key, value] of categoryMap.entries()) {
//           const [categoryTitle, groupTitle] = key.split('-');
//           if (
//             title.toLowerCase().includes(categoryTitle) &&
//             title.toLowerCase().includes(groupTitle)
//           ) {
//             matchedCategory = value.category;
//             matchedGroup = value.group;
//             break;
//           }
//         }

//         if (!matchedCategory || !matchedGroup) {
//           missingProducts.push(product);
//           continue;
//         }

//         const existingProduct = await prisma.product.findUnique({
//           where: { article },
//         });

//         if (existingProduct) {
//           const updatedProduct = await prisma.product.update({
//             where: { article },
//             data: {
//               count: existingProduct.count + count,
//               price: unitPrice,
//             },
//           });
//           results.push(updatedProduct);
//         } else {
//           const newProduct = await prisma.product.create({
//             data: {
//               title,
//               article,
//               count,
//               price: unitPrice,
//               status: 'В наличии',
//               groupId: matchedGroup.id,
//               categoryId: matchedCategory.id,
//             },
//           });
//           results.push(newProduct);
//         }
//       } catch (error) {
//         errors.push({ product, error: error.message });
//       }
//     }

//     if (missingProducts.length > 0) {
//       await updateGoogleSheet(missingProducts);
//     }

//     return NextResponse.json({ success: results.length, missingProducts, errors }, { status: 200 });
//   } catch (error) {
//     console.error('Ошибка при обработке прайса:', error);
//     return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
//   }
// }

export async function POST(req) {
  try {
    const body = await req.json();
    const rawProducts = body.data;

    if (!rawProducts || !Array.isArray(rawProducts)) {
      return NextResponse.json(
        { message: 'Продукты не предоставлены или неверный формат данных' },
        { status: 400 }
      );
    }

    // Генерация хеш-суммы для прайса
    const hash = crypto.createHash('sha256').update(JSON.stringify(rawProducts)).digest('hex');

    // Проверка наличия хеша в базе
    const existingHash = await prisma.priceHash.findUnique({
      where: { hash },
    });

    if (existingHash) {
      return NextResponse.json(
        { message: 'Этот прайс уже был загружен ранее', success: false },
        { status: 400 }
      );
    }

    // Сохранение нового хеша в базе
    await prisma.priceHash.create({
      data: { hash },
    });

    const [headers, ...rows] = rawProducts;

    if (!headers || headers.length < 5 || !rows.length) {
      return NextResponse.json(
        { message: 'Некорректный формат данных в прайсе' },
        { status: 400 }
      );
    }

    const products = rows.map((row) => ({
      title: row[2]?.trim() || '',
      article: row[1]?.trim() || '',
      count: parseInt(row[3], 10) || 0,
      price: parseFloat(row[4], 10) || 0,
    }));

    const categories = await prisma.category.findMany({
      include: { groups: true },
    });

    const categoryMap = new Map();
    categories.forEach((category) => {
      category.groups.forEach((group) => {
        categoryMap.set(`${category.title}-${group.title}`.toLowerCase(), {
          category,
          group,
        });
      });
    });

    const missingProducts = [];
    const results = [];

    for (const product of products) {
      const { title, article, count, price } = product;

      let matchedCategory = null;
      let matchedGroup = null;

      for (const [key, value] of categoryMap.entries()) {
        const [categoryTitle, groupTitle] = key.split('-');
        if (
          title.toLowerCase().includes(categoryTitle) &&
          title.toLowerCase().includes(groupTitle)
        ) {
          matchedCategory = value.category;
          matchedGroup = value.group;
          break;
        }
      }

      if (!matchedCategory || !matchedGroup) {
        missingProducts.push(product);
        continue;
      }

      const existingProduct = await prisma.product.findUnique({ where: { article } });

      if (existingProduct) {
        const updatedProduct = await prisma.product.update({
          where: { article },
          data: {
            count: existingProduct.count + count,
            price,
          },
        });
        results.push(updatedProduct);
      } else {
        const newProduct = await prisma.product.create({
          data: {
            title,
            article,
            count,
            price,
            status: 'В наличии',
            groupId: matchedGroup.id,
            categoryId: matchedCategory.id,
            images: [],
          },
        });
        results.push(newProduct);
      }
    }

    if (missingProducts.length > 0) {
      await updateGoogleSheet(missingProducts);
      return NextResponse.json({
        message: 'Некоторые товары не имеют категорий или групп. Проверьте Google Таблицу.',
        success: false,
        missingProducts,
      }, { status: 400 });
    }

    return NextResponse.json({ success: results.length }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обработке прайса:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
