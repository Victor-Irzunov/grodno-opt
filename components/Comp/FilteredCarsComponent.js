"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllFilterCars } from '@/http/adminAPI';
import { Catalog } from '../catalog/Catalog';
import phoneNumbers from '@/config/config';

export default function FilteredCarsComponent({ brand, model }) {
  const searchParams = useSearchParams();
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    const fetchFilteredCars = async () => {
      const queryParams = {
        brand: brand || null,
        model: model || null,
        generation: searchParams.get('generation') || null,
        yearFrom: searchParams.get('yearFrom') || null,
        yearTo: searchParams.get('yearTo') || null,
        priceFrom: searchParams.get('priceFrom') || null,
        priceTo: searchParams.get('priceTo') || null,
        currency: searchParams.get('currency') || null,
      };

      try {
        const cars = await getAllFilterCars(queryParams);
        setFilteredCars(cars);
      } catch (error) {
        console.error("Ошибка загрузки отфильтрованных автомобилей:", error);
      }
    };

    fetchFilteredCars();
  }, [searchParams, brand, model]);

  return (
    <>
      {
        filteredCars.length ?
          <Catalog data={filteredCars} />
          :
          <div className='mt-14 text-center'>
            <p className='sd:text-5xl xz:text-2xl'>
              ничего не найдено
            </p>
            <div className='mt-10'>
              <p className=''>
                Если вы не нашли то, что искали, позвоните нам — мы обязательно вам поможем!
              </p>

              <a href={`tel:${phoneNumbers.mainPhoneLink}`} className="sd:text-3xl xz:text-xl">
                {phoneNumbers.mainPhone}
              </a>
            </div>
          </div>
      }
    </>
  )

}
