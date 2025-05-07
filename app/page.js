"use client"
import BtnComp from '@/components/btn/BtnComp';
import phoneNumbers from '@/config/config';
import { MyContext } from '@/contexts/MyContextProvider';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

export default function Home() {
  const { dataApp, user, products } = useContext(MyContext);

  return (
    <main className="">
      <section className='relative'>
        <div className=''>
          <div className='sd:max-h-[60vh] xz:max-w-full overflow-y-hidden -z-10'>
            <Image
              src='/fon/fon.webp'
              alt='запчасти для смартфонов оптом'
              width={2560}
              height={1383}
              className='bg-cover'
            />
            <div className='sd:block xz:hidden absolute inset-0 bg-black bg-opacity-50 z-0' />
          </div>
        </div>

        <div className='container mx-auto'>
          <div className='sd:absolute xz:static top-1/2 sd:mt-0 xz:mt-28 -translate-y-1/2 sd:text-white xz:text-black'>
            <h1 className='sd:text-3xl xz:text-xl font-semibold'>
              ПроПартс — оптовый магазин
            </h1>

            <div className='mt-8 flex sd:flex-row xz:flex-col items-center sd:space-x-3 xz:space-x-0 sd:space-y-0 xz:space-y-3'>

              <a href={`tel:${phoneNumbers.mainPhoneLink}`} className="btn sd:bg-white xz:bg-black sd:text-black xz:text-white border-none rounded-sm font-light sd:w-auto xz:w-full">
                <Image src='/svg/phone-black.svg' alt='Телефон для заказа оптом запчастей' width={20} height={20} className='sd:block xz:hidden' />
                <Image src='/svg/phone-white.svg' alt='Телефон для заказа оптом запчастей' width={20} height={20} className='sd:hidden xz:block' />
                {phoneNumbers.mainPhone}
              </a>


              <div className=''>
                <BtnComp title='Стать партнером' index={359} />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className='sd:py-16 xz:py-0 xz:-mt-12 sd:mt-5'>
        <div className='container mx-auto'>
          <div className='py-16'>
            <div className='flex sd:flex-row xz:flex-col sd:space-x-8 xz:space-x-0 sd:space-y-0 xz:space-y-8'>


              <div className=''>
                <p className='uppercase text-gray-400 text-xs'>
                  оптовый магазин
                </p>
                <h2 className='sd:text-5xl xz:text-3xl font-semibold mt-3 uppercase'>
                  proparts.by
                </h2>

                <p className='mt-7 text-gray-500 text-sm sd:max-w-2xl xz:max-w-full'>
                  Добро пожаловать в Proparts.by – ваш надежный оптовый поставщик запасных частей для мобильных телефонов. Мы предлагаем широкий ассортимент качественных комплектующих по выгодным ценам. Надежность и оперативность – наши главные приоритеты!
                </p>

                {
                  user.isAuth ?
                    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/moj-kabinet`} className='btn btn-primary rounded-sm text-white mt-7'>
                      Личный кабинет
                    </Link>
                    :
                    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/login`} className='btn btn-primary rounded-sm text-white mt-7'>
                      Личный кабинет
                    </Link>
                }
              </div>


              <div className='sd:w-1/2 xz:w-full'>
                <Image src='/fon/fon2.webp' alt='Фоновое изображение' width={1733} height={1080} className='rounded-sm' />
              </div>
            </div>


          </div>
        </div>
      </section>
    </main>
  );
}
