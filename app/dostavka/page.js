import phoneNumbers from '@/config/config';
import React from 'react'

export const metadata = {
  title: "Способы доставки | Грузовичок.бел",
  description: `Узнайте о способах доставки и самовывоза на Грузовичок.бел. ⭐ Быстро, удобно и надёжно! ☎ Звоните: ${phoneNumbers.phone1}`,
  keywords: "доставка, самовывоз, Грузовичок.бел, отправка курьером, почтовая доставка, такси, автолайт, маршрутка",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/oplata/`
  },
  ogTitle: "Способы доставки | Грузовичок.бел",
  ogDescription: `Подробно о вариантах доставки и самовывоза. Свяжитесь с нами по телефону: ${phoneNumbers.phone1}`,
  ogImage: '/logo/logo-jpg3.jpg',
  twitterTitle: "Способы доставки | Грузовичок.бел",
  twitterDescription: `Удобные варианты получения вашего заказа. Звоните: ${phoneNumbers.phone1}`,
  twitterImage: '/logo/logo-jpg3.jpg'
};

const DeliveryOptions = () => {
  const options = [
    {
      title: "Самовывоз — Космонавтов 9, каб. 3",
      description: "Вы можете самостоятельно забрать заказ по адресу: г. Минск, ул. Космонавтов 9, каб. 3. Рабочее время: Пн–Пт с 9:00 до 18:00. Перед приездом рекомендуем позвонить для подтверждения готовности заказа."
    },
    {
      title: "Отправить курьером",
      description: "Мы доставим заказ курьером по Минску и пригороду. Возможна оплата наличными или картой при получении. Срок доставки — от 2 до 24 часов в зависимости от загруженности."
    },
    {
      title: "Отправить такси",
      description: "Быстрая доставка через городской сервис такси. Удобно, если нужно получить товар в течение часа. Стоимость рассчитывается по тарифам службы такси."
    },
    {
      title: "Отправить почтой",
      description: "Доставка по всей Беларуси через Белпочту или другие службы. Срок доставки — от 2 до 5 рабочих дней. Предоплата или наложенный платёж по договорённости."
    },
    {
      title: "Отправить автолайт",
      description: "Удобный способ для доставки в другие города. Мы отправим ваш заказ через сервис 'Автолайт' — быстрая доставка в пределах Беларуси от двери до двери."
    },
    {
      title: "Отправить ближайшей маршруткой",
      description: "Экспресс-доставка через междугородние маршрутки. Мы договоримся с водителем, вы получаете посылку на ближайшей остановке вашего города. Уточняйте возможность по телефону."
    }
  ];

  return (
    <div className="mt-6 space-y-6">
      {options.map((option, index) => (
        <div key={index} className="">
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
        <div className='container mx-auto'>
          <div className='sd:pt-20 xz:pt-8'>
            <h1 className='sd:text-3xl xz:text-xl font-bold'>
              Доставка
            </h1>

            <div className='mt-8'>
              <DeliveryOptions />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default page
