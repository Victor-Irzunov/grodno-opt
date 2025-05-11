import phoneNumbers from '@/config/config';
import React from 'react'

export const metadata = {
  title: "",
  description: `⭐  ☎ Звоните: ${phoneNumbers.phone1} — !`,
  keywords: "",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/oplata/`
  },
  ogTitle: "",
  ogDescription: `. Свяжитесь с нами по телефону: ${phoneNumbers.phone1}`,
  ogImage: '/logo/logo-jpg3.jpg',
  twitterTitle: "Контакты | Грузовичок.бел",
  twitterDescription: `. Звоните: ${phoneNumbers.phone1}`,
  twitterImage: '/logo/logo-jpg3.jpg'
};

const page = () => {
  return (
    <main className="sd:pt-8 xz:pt-9 pb-20">
      <section className=''>

        <div className='container mx-auto'>
          <div className='sd:pt-20 xz:pt-8'>
            <h1 className='sd:text-4xl xz:text-xl font-bold'>
              Оплата
            </h1>


            <div className='sd:text-base xz:text-sm'></div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default page