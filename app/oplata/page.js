// /app/oplata/page.jsx
import phoneNumbers from '@/config/config';
import React from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://hi3310.ru';

export const metadata = {
  metadataBase: new URL(BASE),
  title: 'Оплата | hi3310.ru',
  description: `Способы оплаты для оптовых клиентов. ⭐ Звоните: ${phoneNumbers.mainPhone} — поможем выбрать удобный вариант!`,
  keywords: ['оплата', 'безналичная оплата', 'наличные', 'счет на оплату', 'опт', 'запчасти для телефонов', 'hi3310.ru'],
  alternates: {
    canonical: '/oplata',
  },
  openGraph: {
    title: 'Оплата | hi3310.ru',
    description: `Свяжитесь с нами по телефону: ${phoneNumbers.mainPhone}`,
    url: '/oplata',
    siteName: 'hi3310.ru',
    images: ['/logo/logo-jpg3.jpg'],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Оплата | hi3310.ru',
    description: `Звоните: ${phoneNumbers.mainPhone}`,
    images: ['/logo/logo-jpg3.jpg'],
  },
};

const page = () => {
  return (
    <main className="sd:pt-8 xz:pt-9 pb-20">
      <section>
        <div className="container mx-auto">
          <div className="sd:pt-20 xz:pt-8">
            <h1 className="sd:text-4xl xz:text-xl font-bold">Оплата</h1>

            <div className="mt-8 sd:text-base xz:text-sm space-y-8">
              <div>
                <h2 className="font-semibold sd:text-xl xz:text-base">Доступные варианты оплаты</h2>
                <ul className="list-disc pl-5 space-y-3 mt-4">
                  <li>
                    <span className="font-medium">Наличный расчёт.</span> Оплата при получении в Гродно и пригороде,
                    при доставке курьером или самовывозе.
                  </li>
                  <li>
                    <span className="font-medium">Безналичный расчёт (для ИП и юр. лиц).</span> Выставим счёт, оплату
                    принимаем на расчётный счёт. Закрывающие документы предоставляем.
                  </li>
                  <li>
                    <span className="font-medium">Банковская карта.</span> Возможна оплата картой при самовывозе или у
                    курьера (уточняйте при оформлении заказа).
                  </li>
                  <li>
                    <span className="font-medium">Предоплата/частичная предоплата.</span> Для резервирования позиции с
                    большим спросом.
                  </li>
                  <li>
                    <span className="font-medium">Перевод по реквизитам/QR.</span> По запросу пришлём реквизиты и QR для
                    быстрого платежа.
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border rounded p-5">
                <h3 className="font-semibold sd:text-lg xz:text-base">Счёт на оплату</h3>
                <p className="mt-3">
                  Если вы оформляете заказ как компания/ИП, отправьте реквизиты и список позиций. Мы выставим счёт в
                  течение рабочего дня. Отгрузка — после поступления средств или по согласованному графику.
                </p>
              </div>

              <div>
                <h3 className="font-semibold sd:text-lg xz:text-base">Комиссии и налоги</h3>
                <p className="mt-3">
                  Комиссия платёжных систем (при её наличии) оплачивается согласно тарифам банка/провайдера. Итоговая
                  стоимость заказа указывается в счёте.
                </p>
              </div>

              <div className="rounded border p-5">
                <h3 className="font-semibold sd:text-lg xz:text-base">Есть вопросы по оплате?</h3>
                <p className="mt-3">
                  Свяжитесь с нами: <br />
                  <a href={`tel:${phoneNumbers.mainPhoneLink}`} className="link link-primary">
                    {phoneNumbers.mainPhone}
                  </a>
                 
                </p>
                <p className="mt-2 text-gray-600">
                  Менеджер подскажет удобный способ оплаты и подготовит документы.
                </p>
              </div>

              <div className="text-xs text-gray-500">
                * Информация носит справочный характер. Актуальные условия оплаты и документы подтверждаются менеджером
                при оформлении заказа.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
