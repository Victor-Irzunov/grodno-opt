"use client"
import { MyContext } from "@/contexts/MyContextProvider";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export const AsideMenu = ({ data, setSelectedCategory, flex, selectedCategory, block, setIsOpen }) => {
  const [loadedData, setLoadedData] = useState([]);
  const { dataApp } = useContext(MyContext);

  useEffect(() => {
    if (data.length) {
      setLoadedData(data);
    }
  }, [data]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const hangleCategoryId = (id) => {
    dataApp.setCatalogId(id)
  }

  if (!loadedData.length) return null;

  return (
    <aside className={`${block ? 'w-full pt-16' : 'sd:block xz:hidden'} ${flex ? 'sd:w-1/5 xz:w-full' : ''}`}>
      <div className='sticky top-24'>
        <div className="flex space-x-2">
          <Image src="/svg/catalog.svg" alt="Каталог" width={12} height={12} />
          <span className="text-xs text-gray-500">
            Каталог
          </span>
        </div>
        <div className="mt-4">
          {
            flex ?
              <ul className="border text-sm text-gray-800 max-h-[900px] overflow-y-auto">
                <li
                  className={`p-2 border-b hover:bg-slate-50 hover-transition cursor-pointer ${selectedCategory === null ? 'font-bold' : ''}`}
                  onClick={() => handleCategoryClick(null)}
                >
                  <h2 className="flex space-x-1">Все товары</h2>
                </li>
                {loadedData.map((el) => (
                  <li
                    key={el.id}
                    className="p-1.5 text-xs border-b hover:bg-slate-50 hover-transition cursor-pointer"
                    onClick={() => handleCategoryClick(el.id)}
                  >
                    <h2 className={`flex space-x-1 ${selectedCategory === el.id ? 'font-bold' : ''}`}>{el.title}</h2>
                  </li>
                ))}
              </ul>
              :
              <div className=''>
                <ul className="border text-sm text-gray-800 max-h-[500px] overflow-y-auto">
                  <li
                    className={`p-2 border-b hover:bg-slate-50 hover-transition cursor-pointer ${selectedCategory === null ? 'font-bold' : ''}`}
                    onClick={() => {
                      setSelectedCategory(null);
                      if (setIsOpen) setIsOpen(false);
                    }}
                  >
                    <Link href="/catalog">
                      <h2 className="flex space-x-1 text-xs">Все товары</h2>
                    </Link>
                  </li>

                  {loadedData.map((el) => (
                    <li
                      key={el.id}
                      className="p-2 border-b hover:bg-slate-50 hover-transition cursor-pointer"
                      onClick={() => {
                        hangleCategoryId(el.id)
                        // setIsOpen(false)
                      }}
                    >
                      <Link href='/catalog'>
                        <h2 className={`flex space-x-1 text-xs ${selectedCategory === el.id ? 'font-bold' : ''}`}>
                          {el.title}
                        </h2>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

          }

        </div>
      </div>
    </aside>
  );
};
