// /components/OneProductPage/OneProductPage.jsx
"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { AsideMenu } from "../AsideMenu/AsideMenu";
import GalleryComponent from "../GalleryComponent/GalleryComponent";
import { Search } from "../search/Search";
import { MyContext } from "@/contexts/MyContextProvider";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import Image from "next/image";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";
import { message } from "antd";
import phoneNumbers from "@/config/config";
import { transliterate } from "@/transliterate/transliterate";

/**
 * Нормализуем изображения:
 * - если в БД лежит JSON (массив объектов { original, thumbnail })
 * - или строка JSON
 */
function normalizeImages(images) {
  if (!images) return [];

  let parsed = images;

  if (typeof images === "string") {
    try {
      parsed = JSON.parse(images);
    } catch (e) {
      console.error("Ошибка парсинга images на странице товара:", e);
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  // ожидаем объекты вида { original, thumbnail, ... }
  return parsed
    .filter((img) => img && typeof img === "object")
    .map((img, index) => ({
      ...img,
      // на всякий случай uid для галереи, если она его использует
      uid: img.uid || `prod-img-${index}`,
    }));
}

const OneProductPage = observer(({ categories, data, dataAllProduct }) => {
  const { user, dataApp, handleCurrencyChange, updateIsState } =
    useContext(MyContext);

  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [filteredData, setFilteredData] = useState(dataAllProduct || []);
  const [quantities, setQuantities] = useState({});

  // Нормализованные изображения для галереи
  const galleryImages = normalizeImages(data?.images);

  useEffect(() => {
    if (searchQuery) {
      if (Array.isArray(filteredData)) {
        setSearchResults(
          filteredData.filter(
            (item) =>
              item.title
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.article
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults(null);
    }
  }, [searchQuery, filteredData]);

  const handleAddToCart = (item) => {
    const quantityToAdd = quantities[item.id] || 1;
    if (item.count && quantityToAdd > item.count) {
      message.error("Нельзя добавить больше, чем есть в наличии");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("parts")) || [];
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    if (existingItemIndex !== -1) {
      const newQuantity = cart[existingItemIndex].quantity + quantityToAdd;
      if (item.count && newQuantity > item.count) {
        message.error("Нельзя добавить больше, чем есть в наличии");
        return;
      }
      cart[existingItemIndex].quantity = newQuantity;
    } else {
      cart.push({ ...item, quantity: quantityToAdd });
    }
    localStorage.setItem("parts", JSON.stringify(cart));
    updateIsState();
    message.success("Товар добавлен в корзину");
  };

  const convertPrice = (price) => {
    if (dataApp.currency === "BYN") {
      return (price * dataApp.OfficialRate).toFixed(2);
    }
    return price;
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

  const handleQuantityChange = (productId, delta, maxCount) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId] || 1;
      let newQuantity = currentQuantity + delta;
      newQuantity = Math.max(1, newQuantity);
      if (maxCount && newQuantity > maxCount) {
        newQuantity = maxCount;
      }
      return {
        ...prevQuantities,
        [productId]: newQuantity,
      };
    });
  };

  return (
    <section className="rdataative">
      <div className="container mx-auto">
        <Search
          inputRef={inputRef}
          searchQuery={searchQuery}
          handleSearchChange={(e) => setSearchQuery(e.target.value)}
          handleCurrencyChange={handleCurrencyChange}
          dataApp={dataApp}
        />
        <div className="grid sd:grid-cols-5 xz:grid-cols-1 gap-4 rdataative mt-16">
          <AsideMenu data={categories} />

          <div className="sd:col-span-4 xz:col-span-1 border">
            {searchQuery ? (
              <ul className="text-sm font-light">
                {searchResults && searchResults.length ? (
                  searchResults.map((el) => (
                    <li
                      key={el.id}
                      className="p-2 border mb-1 hover:bg-sky-50 hover:translate-x-0.5 hover:shadow-lg hover-transition"
                    >
                      <div className="flex justify-between sd:flex-row xz:flex-col">
                        <div className="">
                          <Link
                            href={`/catalog/${linkTransliterate(
                              el.category.title
                            )}/${linkTransliterate(el.title)}/${linkTransliterate(
                              el.article
                            )}/`}
                          >
                            <h3>
                              {el.title} ({el.article})
                            </h3>
                          </Link>
                          <div className="flex items-center mt-1">
                            <div
                              className={`w-1 h-1 rounded-full ${
                                el.count > 0 ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                            <p
                              className={`ml-1 text-xs ${
                                el.count > 0 ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {el.count > 0
                                ? "В наличии"
                                : "Нет в наличии"}
                            </p>
                            {el.images ? (
                              <div className="ml-6 cursor-pointer">
                                <Image
                                  src="/svg/images.svg"
                                  alt="Изображение"
                                  width={20}
                                  height={20}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                        {/* Цена/корзина для списка — оставлена без изменений (если добавишь позже) */}
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="text-center text-gray-300 text-xl pt-7">
                    <p className="font-bold">ничего не найдено</p>
                    <p className="text-sm mt-4">
                      Если вы не нашли то, что искали, позвоните нам — мы
                      обязательно вам поможем!
                    </p>
                    <a
                      href={`tel:${phoneNumbers.mainPhoneLink}`}
                      className="font-semibold text-base"
                    >
                      {phoneNumbers.mainPhone}
                    </a>
                  </div>
                )}
              </ul>
            ) : (
              <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-4">
                {/* Левый основной блок с галереей */}
                <div className="sd:col-span-2 xz:col-span-1 bg-white/85 rounded-3xl sd:py-8 xz:py-5 sd:px-10 xz:px-2">
                  <h1 className="sd:text-2xl xz:text-lg xy:text-xl font-semibold px-2">
                    {data.title} ({data.article})
                  </h1>
                  <p className="pl-2 text-gray-400 text-xs uppercase mt-2">
                    id: {data.id}
                  </p>

                  <GalleryComponent
                    images={galleryImages}
                    title={data.title}
                  />

                  {/* ===== Новый блок «Описание товара» (моб/левый блок) ===== */}
                  {data?.description ? (
                    <div className="mt-8 border bg-white/90">
                      <div className="px-4 py-3 border-b">
                        <h2 className="text-base font-semibold text-gray-800">
                          Описание товара
                        </h2>
                      </div>
                      <div className="px-4 py-4">
                        <div className="prose max-w-none whitespace-pre-wrap text-sm text-gray-700">
                          {data.description}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {/* ===== Конец блока описания ===== */}
                </div>

                {/* Правый инфо-блок (десктоп) */}
                <article className="sd:block xz:hidden bg-slate-50 sd:py-8 xz:py-5 sd:px-6 xz:px-2">
                  <div className="mb-4">
                    <h2 className="text-xs text-gray-700">
                      Артикул: <span className="font-semibold">{data.article}</span>
                    </h2>
                  </div>

                  {user?.isAuth ? (
                    <p
                      className={`text-4xl font-semibold text-gray-800 ${
                        data.count > 0 ? "block" : "hidden"
                      }`}
                    >
                      {dataApp.currency === "USD"
                        ? `$${data.price}`
                        : `${convertPrice(data.price)} BYN`}
                    </p>
                  ) : (
                    <Link
                      href="/login"
                      className="flex underline text-sm text-gray-700"
                    >
                      Узнать цену{" "}
                      <Image
                        src="/svg/arrow-right.svg"
                        className="-rotate-45 ml-2"
                        alt="Переход для регистрации"
                        width={15}
                        height={15}
                      />
                    </Link>
                  )}

                  <div
                    className={`flex items-center ${
                      data.count > 0 ? "text-green-500" : "text-red-500"
                    } mt-3`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${
                        data.count > 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <p className="ml-1 text-xs">
                      {data.count > 0 ? "В наличии" : "Нет в наличии"}
                    </p>
                  </div>

                  {user?.isAuth && data.count > 0 && (
                    <div className="flex space-x-2 mt-8">
                      <div className="join rounded-sm">
                        <button
                          className="join-item btn btn-sm px-2 border border-gray-300"
                          onClick={() =>
                            handleQuantityChange(data.id, -1, data.count)
                          }
                          disabled={(quantities[data.id] || 1) <= 1}
                        >
                          <RiSubtractFill fontSize={20} />
                        </button>
                        <button className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300">
                          {quantities[data.id] || 1}
                        </button>
                        <button
                          className="join-item btn btn-sm px-2 border border-gray-300"
                          onClick={() =>
                            handleQuantityChange(data.id, 1, data.count)
                          }
                          disabled={(quantities[data.id] || 1) >= data.count}
                        >
                          <RiAddFill fontSize={20} />
                        </button>
                      </div>

                      {dataApp.dataKorzina.some(
                        (item) => item.id === data.id
                      ) ? (
                        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/korzina`}>
                          <button className="btn btn-success btn-sm rounded-sm font-light text-white">
                            В корзине
                          </button>
                        </Link>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm rounded-sm font-light text-white"
                          onClick={() => handleAddToCart(data)}
                        >
                          В корзину
                        </button>
                      )}
                    </div>
                  )}

                  {/* Дублируем описание справа (десктоп) */}
                  {data?.description ? (
                    <div className="mt-8">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Описание товара
                      </h3>
                      <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                        {data.description}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-8">
                    <p className="text-xs font-light text-gray-500 mt-5">
                      Цена действительна только для партнеров
                    </p>
                  </div>
                </article>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export default OneProductPage;
