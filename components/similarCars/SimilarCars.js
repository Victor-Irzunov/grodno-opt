import { PrismaClient } from '@prisma/client';
import CauruselSimilar from './CauruselSimilar';

const prisma = new PrismaClient();

async function getData(price, id, year) {
  try {
    const minPrice = price * 0.7;
    const maxPrice = price * 1.3;
    const minYear = year - 3;
    const maxYear = year + 3;

    // Параллельные запросы для получения похожих по цене и по году
    const [carsByPrice, carsByYear] = await Promise.all([
      prisma.car.findMany({
        where: {
          priceUSD: { gte: minPrice, lte: maxPrice },
          NOT: { id: id },
        },
      }),
      prisma.car.findMany({
        where: {
          year: { gte: minYear, lte: maxYear },
          NOT: { id: id },
        },
      })
    ]);

    // Объединяем результаты и удаляем дубликаты
    const combinedCars = [...carsByPrice, ...carsByYear].reduce((acc, car) => {
      if (!acc.find(item => item.id === car.id)) {
        acc.push(car);
      }
      return acc;
    }, []);

    // Если найдено менее 3 похожих автомобилей, загружаем все авто
    if (combinedCars.length < 3) {
      console.warn("Меньше трех похожих автомобилей, загружаем все автомобили");
      return await prisma.car.findMany({
        where: {
          NOT: { id: id },
        },
      });
    }

    return combinedCars;
  } catch (error) {
    console.error("Ошибка при получении данных об автомобилях:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

const SimilarCars = async ({ price, id, year }) => {
  const data = await getData(price, id, year);

  if (!data || data.length === 0) {
    return (
      <div className='mt-10'>
        <p className='text-secondary/80 text-xl uppercase'>
          нет похожих автомобилей
        </p>
      </div>
    );
  }

  return (
    <section className='mt-8'>
      <div className='container mx-auto overflow-x-hidden'>
        <h3 className='sd:text-3xl xz:text-xl font-semibold text-center mb-8'>
          Похожие автомобили
        </h3>
        <CauruselSimilar data={data} />
      </div>
    </section>
  );
};

export default SimilarCars;
