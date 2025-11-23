// my-app/app/api/admin/product/route.js
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
// import crypto from 'crypto';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

async function updateGoogleSheet(missingProducts) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    credentials.private_key = credentials.private_key.replace(/\\n/gm, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1YIgHohucNa1urtDPTrNAAMYzvOZellSWDdHDCX_XM7w';
    const range = 'Лист1!A1:E999';

    const values = missingProducts.map((product) => [
      '',
      product.article,
      product.title,
      product.count,
      product.price,
    ]);

    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    const updatesRange = appendResponse.data.updates.updatedRange;
    const startRow = parseInt(updatesRange.match(/A(\d+):/)[1], 10);

    const requests = [];
    for (let i = 0; i < missingProducts.length; i++) {
      const rowIndex = startRow + i - 1;
      requests.push({
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: rowIndex,
            endRowIndex: rowIndex + 1,
            startColumnIndex: 1,
            endColumnIndex: 5,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 1, green: 1, blue: 0 },
              textFormat: {
                foregroundColor: { red: 1, green: 0, blue: 0 },
                bold: true,
              },
            },
          },
          fields: 'userEnteredFormat(backgroundColor, textFormat)',
        },
      });
    }

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

export async function POST(req) {
  try {
    const body = await req.json();
    const { data: rawProducts, currency, exchangeRate } = body;

    if (!rawProducts || !Array.isArray(rawProducts)) {
      return NextResponse.json(
        { message: 'Продукты не предоставлены или неверный формат данных' },
        { status: 400 }
      );
    }

    if (!currency || !exchangeRate || isNaN(exchangeRate) || exchangeRate <= 0) {
      return NextResponse.json(
        { message: 'Некорректный курс обмена или валюта' },
        { status: 400 }
      );
    }

    const hash = crypto.createHash('sha256').update(JSON.stringify(rawProducts)).digest('hex');
    const existingHash = await prisma.priceHash.findUnique({ where: { hash } });

    if (existingHash) {
      return NextResponse.json(
        { message: 'Этот прайс уже был загружен ранее', success: false },
        { status: 400 }
      );
    }

    await prisma.priceHash.create({ data: { hash } });

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
      price: parseFloat(row[4]) || 0,
    }));

    const categories = await prisma.category.findMany({
      include: { groups: true },
    });

    const missingProducts = [];
    const results = [];

    for (const product of products) {
      const { title, article, count, price } = product;
      const lowerTitle = title.toLowerCase();

      let matchedCategory = null;
      let matchedGroup = null;

      // Сначала ищем точное совпадение по категории и группе
      outer: for (const category of categories) {
        for (const group of category.groups) {
          if (
            lowerTitle.includes(category.title.toLowerCase()) &&
            lowerTitle.includes(group.title.toLowerCase())
          ) {
            matchedCategory = category;
            matchedGroup = group;
            break outer;
          }
        }
      }

      // Если точного совпадения нет — ищем совпадение только по группе
      if (!matchedGroup) {
        for (const category of categories) {
          for (const group of category.groups) {
            if (lowerTitle.includes(group.title.toLowerCase())) {
              matchedCategory = category;
              matchedGroup = group;
              break;
            }
          }
          if (matchedGroup) break;
        }
      }

      // Если вообще ничего не нашли
      if (!matchedCategory || !matchedGroup) {
        missingProducts.push(product);
        continue;
      }

      let priceInUSD;
      switch (currency) {
        case 'RUB':
          priceInUSD = parseFloat((price * exchangeRate / 100).toFixed(3));
          break;
        case 'CNY':
          priceInUSD = parseFloat((price * exchangeRate / 10).toFixed(3));
          break;
        case 'BYN':
          priceInUSD = parseFloat((price / exchangeRate).toFixed(3));
          break;
        default:
          return NextResponse.json(
            { message: 'Некорректная валюта' },
            { status: 400 }
          );
      }

      const existingProduct = await prisma.product.findUnique({ where: { article } });

      if (existingProduct) {
        const updatedProduct = await prisma.product.update({
          where: { article },
          data: {
            count: existingProduct.count + count,
            price: priceInUSD,
          },
        });
        results.push(updatedProduct);
      } else {
        const newProduct = await prisma.product.create({
          data: {
            title,
            article,
            count,
            price: priceInUSD,
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
      return NextResponse.json(
        {
          message: 'Некоторые товары не имеют категорий или групп.',
          success: false,
          missingProducts,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: results.length }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обработке прайса:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}
