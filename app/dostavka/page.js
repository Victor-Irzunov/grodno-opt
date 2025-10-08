// /app/dostavka/page.jsx
import phoneNumbers from '@/config/config';
import React from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://hi3310.ru';

export const metadata = {
  metadataBase: new URL(BASE),
  title: 'Способы доставки | hi3310.ru',
  description: `Способы доставки запчастей для смартфонов. ☎ Звоните: ${phoneNumbers.mainPhone}`,
  keywords: ['доставка', 'опт', 'запчасти для телефонов', 'hi3310.ru'],
  alternates: {
    canonical: '/dostavka',
  },
  openGraph: {
    title: 'Способы доставки | hi3310.ru',
    description: `Свяжитесь с нами по телефону: ${phoneNumbers.mainPhone}`,
    url: '/dostavka',
    siteName: 'hi3310.ru',
    images: ['/logo/logo-jpg3.jpg'],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Способы доставки | hi3310.ru',
    description: `Звоните: ${phoneNumbers.mainPhone}`,
    images: ['/logo/logo-jpg3.jpg'],
  },
};

const DeliveryOptions = () => {
  const options = [
    {
      title: 'Отправить курьером',
      description:
        'Мы доставим заказ курьером по Минску и пригороду. Возможна оплата наличными или картой при получении. Срок доставки — от 2 до 24 часов в зависимости от загруженности.',
    },
    {
      title: 'Отправить такси',
      description:
        'Быстрая доставка через городской сервис такси. Удобно, если нужно получить товар в течение часа. Стоимость рассчитывается по тарифам службы такси.',
    },
    {
      title: 'Отправить почтой',
      description:
        'Доставка по всей Беларуси через Белпочту или другие службы. Срок доставки — от 2 до 5 рабочих дней. Предоплата или наложенный платёж по договорённости.',
    },
    {
      title: 'Отправить автолайт',
      description:
        "Удобный способ для доставки в другие города. Мы отправим ваш заказ через сервис 'Автолайт' — быстрая доставка в пределах Беларуси от двери до двери.",
    },
    {
      title: 'Отправить ближайшей маршруткой',
      description:
        'Экспресс-доставка через междугородние маршрутки. Мы договоримся с водителем, вы получаете посылку на ближайшей остановке вашего города. Уточняйте возможность по телефону.',
    },
  ];

  return (
    <div className="mt-6 space-y-6">
      {options.map((option, index) => (
        <div key={index}>
          <h2 className="sd:text-base xz:text-sm font-semibold mb-2">{option.title}</h2>
          <p className="text-sm text-gray-700 sd:text-sm xz:text-xs">{option.description}</p>
        </div>
      ))}
    </div>
  );
};

const page = () => {
  return (
    <main className="sd:pt-8 xz:pt-9 pb-20">
      <section>
        <div className="container mx-auto">
          <div className="sd:pt-20 xz:pt-8">
            <h1 className="sd:text-3xl xz:text-xl font-bold">Доставка</h1>

            <div className="mt-8">
              <DeliveryOptions />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
