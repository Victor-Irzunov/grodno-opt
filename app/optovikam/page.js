import BtnComp from '@/components/btn/BtnComp';
import phoneNumbers from '@/config/config';

export const metadata = {
  title: "Сотрудничество с ProParts | Оптовикам",
  description: `⭐ Станьте партнёром ProParts — получайте доступ к оптовым ценам, резервированию деталей и гарантиям! ☎ Звоните: ${phoneNumbers.phone1}`,
  keywords: "оптовикам, сотрудничество, автозапчасти оптом, ProParts, партнёрство, доставка автозапчастей, автосервис, мастерская",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/oplata/`
  },
  ogTitle: "Сотрудничество с ProParts — Оптовикам",
  ogDescription: `Партнёрство с ProParts — доступ к оптовым ценам, гарантии, резервирование деталей. Свяжитесь с нами: ${phoneNumbers.phone1}`,
  ogImage: '/logo/logo-jpg3.jpg',
  twitterTitle: "Сотрудничество с ProParts | Оптовикам",
  twitterDescription: `Станьте партнёром ProParts и получайте преимущества. Звоните: ${phoneNumbers.phone1}`,
  twitterImage: '/logo/logo-jpg3.jpg'
};


const page = () => {
  return (
    <main className="sd:pt-8 xz:pt-9 pb-20">
      <section className=''>

        <div className='container mx-auto'>
          <div className='sd:pt-20 xz:pt-8'>
            <h1 className='sd:text-3xl xz:text-xl font-bold'>
              Оптовикам
            </h1>

            <div className='mt-10'>
              <h2 className='sd:text-lg xz:text-base font-semibold'>
                Станьте партнером компании ProParts и получите:
              </h2>
              <ul className='sd:text-sm xz:text-xs mt-3'>
                <li className='mb-0.5'>
                  - возможность видеть оптовые цены
                </li>
                <li className='mb-0.5'>
                  -  гарантию на все 4 месяца (даже после установки)
                </li>
                <li className='mb-0.5'>
                  - личный кабинет для контроля покупок
                </li>
                <li className='mb-0.5'>
                  - контроль движения денег
                </li>
                <li className='mb-0.5'>
                  - резервирование деталей
                </li>
              </ul>

              <p className='mt-4 font-semibold'>
                Наличие мастерской обязательно!
              </p>

              <p className='mt-4 sd:text-base xz:text-sm'>
                Мы тесно сотрудничаем с многими мастерскими по всей Беларуси. Предлагаем удобную доставку деталей и аксессуаров до мастерской в кратчайшие сроки.
              </p>

              <div className='w-full mt-7 flex sd:flex-row xz:flex-col items-center sd:space-x-4 xz:space-x-0 xz:space-y-4 sd:space-y-0'>
                <BtnComp title='Заявка на сотрудничество' index={359} wFull />
                <div className='xz:w-full sd:w-auto text-center'>
                  <a
                    href="/api/export-excel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white w-full sd:px-4 xz:px-10 py-3.5 text-sm hover:bg-green-700 transition"
                  >
                    Скачать Прайс Excel
                  </a>
                </div>
              </div>



              <div className='mt-6 font-bold'>
                Звоните: 	<a href={`tel:${phoneNumbers.mainPhoneLink}`} className={``}>
                  {phoneNumbers.mainPhone}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}

export default page