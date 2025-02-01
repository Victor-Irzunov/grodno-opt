"use client"
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { MyContext } from "@/contexts/MyContextProvider";
import { Search } from "../search/Search";
import { AsideMenu } from "../AsideMenu/AsideMenu";
import phoneNumbers from "@/config/config";
import Link from "next/link";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";
import { useSearchParams } from 'next/navigation';

const Catalog = observer(({ data }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const searchParams = useSearchParams();
  const { user, dataApp, handleCurrencyChange } = useContext(MyContext);
  console.log("🚀 🚀 🚀  _ Catalog _ dataApp:", dataApp)
  const inputRef = useRef(null);

  const search = searchParams.get('search');
  const categories = Array.from(new Map(data.map(item => [item.category.id, { id: item.category.id, title: item.category.title }])).values());


  useEffect(() => {
    if (search) {
      setSearchQuery(search);
      const results = data.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
      setSearchResults(results);
    }
  }, [search, data]);

  useEffect(() => {
    if (search && inputRef.current) {
      inputRef.current.focus();
    }
  }, [search]);

  const sortedProducts = (searchResults || data).sort((a, b) => {
    const nameA = a.title.toLowerCase();
    const nameB = b.title.toLowerCase();
    return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  const handleSortChange = (e) => setSortOrder(e.target.value);

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) + delta, 1),
    }));
  };

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("parts")) || [];
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantities[item.id] || 1;
    } else {
      cart.push({ ...item, quantity: quantities[item.id] || 1 });
    }
    localStorage.setItem("parts", JSON.stringify(cart));
    alert("Товар добавлен в корзину");
  };

  const convertPrice = (price) => {
    if (dataApp.currency === 'USD') {
      return (price / dataApp.OfficialRate).toFixed(2);
    }
    return price;
  };

  return (
    <section>
      <div className='py-4 border-b'>
        <div className='container mx-auto'>
          <Search
            inputRef={inputRef}
            searchQuery={searchQuery}
            handleSearchChange={(e) => setSearchQuery(e.target.value)}
            handleCurrencyChange={handleCurrencyChange}
            dataApp={dataApp}
          />
        </div>
      </div>
      <div className='container mx-auto mt-9'>
        <div className='flex justify-between space-x-2 relative'>
          <AsideMenu data={categories} />

          <div className='w-4/5'>
            <select onChange={handleSortChange} className="select select-sm max-w-xs text-xs rounded-sm">
              <option value="asc">По алфавиту (возрастание)</option>
              <option value="desc">По алфавиту (убывание)</option>
            </select>
            <ul className='text-sm font-light'>
              {sortedProducts.length
                ?
                sortedProducts.map(el => (
                  <li key={el.id} className='p-2 border mb-1 hover:bg-sky-50 hover:translate-x-1 hover:shadow-lg hover-transition'>
                    <div className='flex justify-between sd:flex-row xz:flex-col'>
                      <div className=''>
                        <Link href={`/catalog/${el.category.title}/${el.id}`}>
                          <h3>{el.title} ({el.article})</h3>
                        </Link>
                        <div className='flex items-center text-green-500 mt-1'>
                          <div className="w-1 h-1 rounded-full bg-green-500" />
                          <p className='ml-1 text-xs'>
                            В наличии
                          </p>
                        </div>
                      </div>
                      {
                        user?.isAuth ?
                          <div className='flex items-center justify-end space-x-3 sd:w-5/12 xz:w-full'>
                            <p className='font-semibold text-base mr-2'>
                              {dataApp.currency === 'USD' ? `$${convertPrice(el.price)}` : `${el.price} р`}
                            </p>
                            <div className="join rounded-sm">
                              <button
                                className="join-item btn btn-sm px-2 border border-gray-300"
                                onClick={() => handleQuantityChange(el.id, -1)}
                              >
                                <RiSubtractFill fontSize={20} />
                              </button>
                              <button
                                className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300"
                              >
                                {quantities[el.id] || 1}
                              </button>
                              <button
                                className="join-item btn btn-sm px-2 border border-gray-300"
                                onClick={() => handleQuantityChange(el.id, 1)}
                              >
                                <RiAddFill fontSize={20} />
                              </button>
                            </div>
                            <button
                              className="btn btn-primary btn-sm rounded-sm font-light text-white"
                              onClick={() => handleAddToCart(el)}
                            >
                              В корзину
                            </button>
                          </div>
                          :
                          null
                      }
                    </div>
                  </li>
                ))
                :
                <div className='text-center text-gray-300 text-xl pt-7'>
                  <p className='font-bold'>
                    ничего не найдено
                  </p>
                  <p className='text-sm mt-4'>
                    Если вы не нашли то, что искали, позвоните нам — мы обязательно вам поможем!
                  </p>
                  <a href={`tel:${phoneNumbers.mainPhoneLink}`} className={`font-semibold text-base`}>
                    {phoneNumbers.mainPhone}
                  </a>
                </div>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Catalog;
