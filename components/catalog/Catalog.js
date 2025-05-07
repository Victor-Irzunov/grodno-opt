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
import { transliterate } from "@/transliterate/transliterate";

const Catalog = observer(({ data }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalImage, setModalImage] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchParams = useSearchParams();
  const { user, dataApp, handleCurrencyChange, updateIsState } = useContext(MyContext);
  const inputRef = useRef(null);
  const [prod, setProd] = useState({})
  const [isOpen, setIsOpen] = useState(false);


  const search = searchParams.get('search');
  const categories = Array.from(new Map(data.map(item => [item.category.id, { id: item.category.id, title: item.category.title }])).values());

  useEffect(() => {
    if (search) {
      setSearchQuery(search);
    }
  }, [search]);

  useEffect(() => {
    let results = data;
    if (searchQuery) {
      results = results.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.article.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      results = results.filter(item => item.category.id === selectedCategory);
    }
    setFilteredData(results);
  }, [searchQuery, selectedCategory, data]);


  useEffect(() => {
    if (dataApp.catalogId) {
      setFilteredData(data.filter(item => item.category.id === dataApp.catalogId));
      setSelectedCategory(dataApp.catalogId);
      dataApp.setCatalogId(null);
    } else if (selectedCategory) {
      setFilteredData(data.filter(item => item.category.id === selectedCategory));
    } else {
      setFilteredData(data);
    }
  }, [dataApp.catalogId, selectedCategory, data]);

  const sortedProducts = (searchResults || filteredData).sort((a, b) => {
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

  // const handleAddToCart = (item, img) => {
  //   const cart = JSON.parse(localStorage.getItem("parts")) || [];
  //   const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  //   if (existingItemIndex !== -1) {
  //     cart[existingItemIndex].quantity += quantities[item.id] || 1;
  //   } else {
  //     cart.push({ ...item, quantity: quantities[item.id] || 1 });
  //   }
  //   localStorage.setItem("parts", JSON.stringify(cart));
  //   updateIsState()
  //   document.getElementById('my_modal_1').showModal()
  //   setTimeout(() => {
  //     document.getElementById('my_modal_1').close()
  //   }, 4000)
  // };

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("parts")) || [];
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    const groupDiscount = item.group?.discount ? parseFloat(item.group.discount) : 0;
    const discountedPrice = item.price * (1 - groupDiscount / 100);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantities[item.id] || 1;
    } else {
      cart.push({ ...item, price: discountedPrice.toFixed(2), quantity: quantities[item.id] || 1 });
    }
    localStorage.setItem("parts", JSON.stringify(cart));
    updateIsState();
    document.getElementById('my_modal_1').showModal();
    setTimeout(() => {
      document.getElementById('my_modal_1').close();
    }, 4000);
  };


  const convertPrice = (price) => {
    if (dataApp.currency === 'BYN') {
      return (price * dataApp.OfficialRate).toFixed(2);
    }
    return price;
  };

  const handleImageClick = (imageData) => {
    const images = JSON.parse(imageData);
    if (images.length > 0) {
      setModalImage(images[0].original);
    }
  };

  // const oneProduct = (el) => {
  //   setProd(el)
  // }

  const oneProduct = (el) => {
    const discountRate = el.group.discount ? parseFloat(el.group.discount) : 0; // Получаем скидку, если она есть
    const originalPrice = parseFloat(el.price); // Начальная цена
    const discountedPrice = originalPrice * (1 - discountRate / 100); // Пересчет цены со скидкой
    
    const productWithDiscount = {
      ...el,
      discountedPrice: discountedPrice.toFixed(2), // Сохраняем цену со скидкой
    };
  
    setProd(productWithDiscount); // Обновляем состояние с новым объектом
  };
  

  const linkTransliterate = (title) => {
    return transliterate(title)
      .replace(/[^a-zA-Z0-9\s\(\)-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/\(\s*(.*?)\s*\)/g, "-$1")
      .replace(/-+/g, "-")
      .replace(/\s?-\s?/g, "-")
      .toLowerCase();
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

        <div className='sd:hidden xz:flex justify-end' onClick={() => setIsOpen(true)}>
          <p className='mr-1 text-xs'>
            Каталог
          </p>
          <Image src='/svg/catalog.svg' alt='Меню каталога' width={20} height={20} />
        </div>


        <div className='flex justify-between sd:space-x-2 xz:space-x-0 relative'>
          <AsideMenu data={categories} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} flex />

          <div className='sd:w-4/5 xz:w-full'>
            <select value={sortOrder} onChange={handleSortChange} className="select select-sm max-w-xs text-xs rounded-sm">
              <option value="asc">По алфавиту (возрастание)</option>
              <option value="desc">По алфавиту (убывание)</option>
            </select>
            <ul className='text-sm font-light'>
              {sortedProducts.length
                ?
                sortedProducts.map(el => (
                  <li key={el.id} className='p-2 border mb-1 hover:bg-sky-50 hover:translate-x-0.5 hover:shadow-lg hover-transition'>
                    <div className='flex justify-between sd:flex-row xz:flex-col'>
                      <div className=''>
                        <Link href={`/catalog/${linkTransliterate(el.category.title)}/${linkTransliterate(el.title)}/${linkTransliterate(el.article)}/`}>
                          <h3>{el.title} ({el.article})</h3>
                        </Link>
                        <div className='flex items-center text-green-500 mt-1'>
                          <div className="w-1 h-1 rounded-full bg-green-500" />
                          <p className='ml-1 text-xs'>
                            В наличии
                          </p>
                          {typeof el.images === "string" && el.images !== "[]" && el.images !== "[]".toString() ? (
                            <div className='ml-6 cursor-pointer' onClick={() => handleImageClick(el.images)}>
                              <Image src='/svg/images.svg' alt='Изображение' width={20} height={20} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {
                        user?.isAuth ?
                          <div className='flex items-center justify-end space-x-3 sd:w-5/12 xz:w-full sd:mt-0 xz:mt-3'>
                            {/* <p className='font-semibold sd:text-base xz:text-sm mr-2'>
                              {dataApp.currency === 'USD' ? `$${el.price}` : `${convertPrice(el.price)} BYN`}
                            </p> */}
                            <p className='font-semibold sd:text-base xz:text-sm mr-2'>
                              {(() => {
                                const price = el.price;
                                const groupDiscount = el.group?.discount ? parseFloat(el.group.discount) : 0; // Приведение к числу
                                const discountedPrice = price * (1 - groupDiscount / 100); // Применение скидки

                                return dataApp.currency === 'USD'
                                  ? `$${discountedPrice.toFixed(2)}`
                                  : `${convertPrice(discountedPrice)} BYN`;
                              })()}
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
                            {
                              dataApp.dataKorzina.some(item => item.id === el.id)
                                ?

                                <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/korzina`}>
                                  <button
                                    className="btn btn-success btn-sm rounded-sm font-light text-white"
                                  >
                                    В корзине
                                  </button>
                                </Link>
                                :
                                <button
                                  className="btn btn-primary btn-sm rounded-sm font-light text-white"
                                  onClick={() => {
                                    handleAddToCart(el)
                                    oneProduct(el)
                                  }}
                                >
                                  В корзину
                                </button>
                            }
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

      {modalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <button className="absolute top-1 right-3 text-red-600 text-3xl" onClick={() => setModalImage(null)}>
              &times;
            </button>
            <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${modalImage}`} alt="Просмотр изображения" width={800} height={600} />
          </div>
        </div>
      )}


      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <p className="font-bold text-lg mb-3">Товар добавлен в корзину</p>
          <p className="font-bold text-lg">
            {prod.title}
          </p>
          <div className='flex items-center justify-between'>
            <div className="w-[7rem] h-[7rem] mt-5 mb-3 rounded-lg overflow-hidden border border-gray-300">
              {
                !Object.keys(prod).length || !prod.images.length ?
                  <Image src='/svg/image-grey.svg' alt='изображение' width={100} height={100} />
                  :
                  <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${Object.keys(prod).length && prod.images.length && JSON.parse(prod.images)[0].original}`} alt="" className="w-full h-full object-cover" />
              }
            </div>
            <strong className="text-2xl font-medium text-gray-800">
              {dataApp.currency === 'USD' ? `$${prod.discountedPrice}` : `${convertPrice(prod.discountedPrice)} BYN`}
            </strong>
          </div>
          <div className="modal-action">
            <Link href='/korzina' className="btn">
              Перейти в корзину
            </Link>
            <form method="dialog">
              <button className="btn">Продолжить покупки</button>
            </form>
          </div>
        </div>
      </dialog>


      <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}></div>
      <div className={`fixed right-0 top-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='p-4'>
          <button className='btn btn-sm btn-circle absolute left-2 top-2' onClick={() => setIsOpen(false)}>✕</button>

          <AsideMenu
            data={categories}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            block
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </section>
  );
});



export default Catalog;
