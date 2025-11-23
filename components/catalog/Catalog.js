// /components/catalog/Catalog.js
"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { MyContext } from "@/contexts/MyContextProvider";
import { Search } from "../search/Search";
import { AsideMenu } from "../AsideMenu/AsideMenu";
import phoneNumbers from "@/config/config";
import Link from "next/link";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";
import { transliterate } from "@/transliterate/transliterate";
import { sendOrderTelegram } from "@/http/telegramAPI";

const Catalog = observer(({ data, searchParams }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalImage, setModalImage] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user, dataApp, handleCurrencyChange, updateIsState } =
    useContext(MyContext);

  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const orderRef = useRef(null);
  const [prod, setProd] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [orderQty, setOrderQty] = useState("1");

  const search = searchParams.get("search");
  const categories = Array.from(
    new Map(
      data.map((item) => [
        item.category.id,
        { id: item.category.id, title: item.category.title },
      ])
    ).values()
  );

  useEffect(() => {
    if (search) setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    let results = data;

    if (searchQuery) {
      const terms = searchQuery.toLowerCase().split(" ").filter(Boolean);
      results = results.filter((item) => {
        const haystack = `${item.title} ${item.article}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      });
    }

    if (selectedCategory) {
      results = results.filter(
        (item) => item.category.id === selectedCategory
      );
    }

    setFilteredData(results);
  }, [searchQuery, selectedCategory, data]);

  useEffect(() => {
    if (dataApp.catalogId) {
      setFilteredData(
        data.filter((item) => item.category.id === dataApp.catalogId)
      );
      setSelectedCategory(dataApp.catalogId);
      dataApp.setCatalogId(null);
    } else if (selectedCategory) {
      setFilteredData(
        data.filter((item) => item.category.id === selectedCategory)
      );
    } else {
      setFilteredData(data);
    }
  }, [dataApp.catalogId, selectedCategory, data]);

  const sortedProducts = (searchResults || filteredData).sort((a, b) => {
    const nameA = a.title.toLowerCase();
    const nameB = b.title.toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  // Разбиение по группам (как в админке), но без смены светлой темы
  const groupedProducts = sortedProducts.reduce((acc, item) => {
    const groupTitle = item.group?.title || "Без группы";
    let group = acc.find((g) => g.groupTitle === groupTitle);
    if (!group) {
      group = { groupTitle, items: [] };
      acc.push(group);
    }
    group.items.push(item);
    return acc;
  }, []);

  const handleSortChange = (e) => setSortOrder(e.target.value);

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const product = data.find((item) => item.id === id);
      const maxCount = product?.count || 1;

      let newQuantity = current + delta;
      if (newQuantity < 1) newQuantity = 1;
      if (newQuantity > maxCount) newQuantity = maxCount;

      return {
        ...prev,
        [id]: newQuantity,
      };
    });
  };

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("parts")) || [];
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    const groupDiscount = item.group?.discount
      ? parseFloat(item.group.discount)
      : 0;
    const discountedPrice = item.price * (1 - groupDiscount / 100);
    const maxCount = item.count;
    const addingQuantity = quantities[item.id] || 1;

    if (existingItemIndex !== -1) {
      const existingQuantity = cart[existingItemIndex].quantity;
      const totalQuantity = Math.min(
        existingQuantity + addingQuantity,
        maxCount
      );
      cart[existingItemIndex].quantity = totalQuantity;
    } else {
      const quantityToAdd = Math.min(addingQuantity, maxCount);
      cart.push({
        ...item,
        price: discountedPrice.toFixed(2),
        quantity: quantityToAdd,
      });
    }

    localStorage.setItem("parts", JSON.stringify(cart));
    updateIsState();

    setProd({
      ...item,
      discountedPrice: discountedPrice.toFixed(2),
    });

    modalRef.current?.showModal();
    setTimeout(() => {
      modalRef.current?.close();
    }, 4000);
  };

  const convertPrice = (price) => {
    if (dataApp.currency === "BYN") {
      return (price * dataApp.OfficialRate).toFixed(2);
    }
    return price;
  };

  const handleImageClick = (imageData) => {
    try {
      const images = JSON.parse(imageData);
      if (Array.isArray(images) && images.length > 0) {
        setModalImage(images[0].original);
      }
    } catch (e) {
      console.error("Ошибка парсинга images в каталоге:", e);
    }
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

  const handleOrderClick = (product) => {
    setProd(product);
    setOrderQty("1");
    orderRef.current?.showModal();
  };

  const handleSendOrder = async () => {
    const qty = Number(orderQty);
    if (!qty || qty < 1) {
      alert("Введите корректное количество");
      return;
    }

    const text =
      `\u{1F4E2} <b>Заказ клиента</b> ` +
      `<b>ID:</b>${user.userData.id}` +
      `<b>, Клиент:</b> ${user.userData?.userData?.fullName}` +
      `<b>, Товар:</b> ${prod.title}` +
      `<b>, Количество:</b> ${qty}`;

    try {
      await sendOrderTelegram(text);
      alert("Заявка отправлена");
    } catch (err) {
      console.error(err);
      alert("Ошибка отправки");
    }
    orderRef.current?.close();
  };

  return (
    <section>
      <div className="py-4 border-b">
        <div className="container mx-auto">
          <Search
            inputRef={inputRef}
            searchQuery={searchQuery}
            handleSearchChange={(e) => setSearchQuery(e.target.value)}
            handleCurrencyChange={handleCurrencyChange}
            dataApp={dataApp}
          />
        </div>
      </div>

      <div className="container mx-auto mt-9">
        <div
          className="sd:hidden xz:flex justify-end"
          onClick={() => setIsOpen(true)}
        >
          <p className="mr-1 text-xs">Каталог</p>
          <Image
            src="/svg/catalog.svg"
            alt="Меню каталога"
            width={20}
            height={20}
          />
        </div>

        <div className="flex justify-between sd:space-x-2 xz:space-x-0 relative">
          <AsideMenu
            data={categories}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            flex
          />

          <div className="sd:w-4/5 xz:w-full">
            <div className="-mt-2 mb-2">
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="select select-sm max-w-xs text-xs rounded-sm mb-4"
              >
                <option value="asc" className="text-sm">
                  По алфавиту (возрастание)
                </option>
                <option value="desc" className="text-sm">
                  По алфавиту (убывание)
                </option>
              </select>
            </div>

            <ul className="text-sm font-light">
              {groupedProducts.length ? (
                groupedProducts.map((group) => (
                  <li key={group.groupTitle} className="mb-6">
                    <h3 className="text-base font-semibold mb-2">
                      {group.groupTitle}
                    </h3>

                    <ul>
                      {group.items.map((el) => (
                        <li
                          key={el.id}
                          className="p-2 border mb-1 hover:bg-sky-50 hover:translate-x-0.5 hover:shadow-lg hover-transition"
                        >
                          <div className="flex justify-between sd:flex-row xz:flex-col">
                            <div>
                              <Link
                                href={`/catalog/${linkTransliterate(
                                  el.category.title
                                )}/${linkTransliterate(
                                  el.title
                                )}/${linkTransliterate(el.article)}/`}
                              >
                                <p>
                                  {el.title} ({el.article})
                                </p>
                              </Link>

                              {/* СТРОКА: точка, статус и иконка изображения — всё в один ряд */}
                              <div
                                className={`mt-1 flex items-center gap-2 ${
                                  el.count > 0
                                    ? "text-green-500"
                                    : "text-blue-500"
                                }`}
                              >
                                <span
                                  className={`inline-block rounded-full ${
                                    el.count > 0
                                      ? "bg-green-500"
                                      : "bg-transparent"
                                  }`}
                                  style={{ width: 6, height: 6 }}
                                />
                                <span className="text-xs">{el.status}</span>

                                {typeof el.images === "string" &&
                                el.images !== "[]" &&
                                el.images !== "[]".toString() ? (
                                  <button
                                    type="button"
                                    className="ml-2 flex items-center justify-center"
                                    onClick={() =>
                                      handleImageClick(el.images)
                                    }
                                  >
                                    <Image
                                      src="/svg/images.svg"
                                      alt="Изображение"
                                      width={20}
                                      height={20}
                                    />
                                  </button>
                                ) : null}
                              </div>
                            </div>

                            {user?.isAuth && (
                              <div className="flex items-center justify-end space-x-4 sd:w-5/12 xz:w-full sd:mt-0 xz:mt-3">
                                {el.count > 0 ? (
                                  <>
                                    <span className="font-semibold sd:text-base xz:text-sm mr-2">
                                      {(() => {
                                        const price = el.price;
                                        const groupDiscount =
                                          el.group?.discount
                                            ? parseFloat(el.group.discount)
                                            : 0;
                                        const discountedPrice =
                                          price * (1 - groupDiscount / 100);
                                        return dataApp.currency === "USD"
                                          ? `$${discountedPrice.toFixed(2)}`
                                          : `${convertPrice(
                                              discountedPrice
                                            )} BYN`;
                                      })()}
                                    </span>
                                    <div className="join rounded-sm">
                                      <button
                                        className="join-item btn btn-sm px-2 border border-gray-300"
                                        onClick={() =>
                                          handleQuantityChange(el.id, -1)
                                        }
                                      >
                                        <RiSubtractFill fontSize={20} />
                                      </button>
                                      <button className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300">
                                        {quantities[el.id] || 1}
                                      </button>
                                      <button
                                        className="join-item btn btn-sm px-2 border border-gray-300"
                                        onClick={() =>
                                          handleQuantityChange(el.id, 1)
                                        }
                                        disabled={
                                          (quantities[el.id] || 1) >= el.count
                                        }
                                      >
                                        <RiAddFill fontSize={20} />
                                      </button>
                                    </div>
                                    {dataApp.dataKorzina.some(
                                      (item) => item.id === el.id
                                    ) ? (
                                      <Link href="/korzina">
                                        <button className="btn btn-success btn-sm rounded-sm font-light text-white">
                                          В корзине
                                        </button>
                                      </Link>
                                    ) : (
                                      <button
                                        className="btn btn-primary btn-sm rounded-sm font-light text-white"
                                        onClick={() => handleAddToCart(el)}
                                      >
                                        В корзину
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <div className="flex items-center space-x-4">
                                    <span className="text-red-500 font-medium text-sm">
                                      Нет в наличии
                                    </span>
                                    <div>
                                      <button
                                        className="btn bg-white text-primary btn-sm rounded-none"
                                        onClick={() => handleOrderClick(el)}
                                      >
                                        Заказать
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
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
          </div>
        </div>
      </div>

      {modalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <button
              className="absolute top-1 right-3"
              onClick={() => setModalImage(null)}
            >
              <span className="text-4xl text-red-600 bg-white rounded-full p-3 h-12 w-12 flex items-center justify-center cursor-pointer">
                &times;
              </span>
            </button>
            <Image
              src={`/uploads/${modalImage}`}
              alt="Просмотр изображения"
              width={800}
              height={600}
            />
          </div>
        </div>
      )}

      <dialog ref={modalRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <p className="font-bold text-lg mb-3">
            Товар добавлен в корзину
          </p>
          <p className="font-bold text-lg">{prod.title}</p>
          <div className="flex items-center justify-between">
            <div className="w-[7rem] h-[7rem] mt-5 mb-3 rounded-lg overflow-hidden border border-gray-300">
              {prod.images && prod.images.length ? (
                <img
                  src={`/uploads/${JSON.parse(prod.images)[0].original}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src="/svg/image-grey.svg"
                  alt="изображение"
                  width={100}
                  height={100}
                />
              )}
            </div>
            <strong className="text-2xl font-medium text-gray-800">
              {dataApp.currency === "USD"
                ? `$${prod.discountedPrice}`
                : `${convertPrice(prod.discountedPrice)} BYN`}
            </strong>
          </div>
          <div className="modal-action">
            <Link href="/korzina" className="btn">
              Перейти в корзину
            </Link>
            <form method="dialog">
              <button className="btn">Продолжить покупки</button>
            </form>
          </div>
        </div>
      </dialog>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <button
            className="btn btn-xl btn-circle absolute left-4 top-4"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <AsideMenu
            data={categories}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            block
            setIsOpen={setIsOpen}
          />
        </div>
      </div>

      <dialog ref={orderRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Заказ товара</h3>
          <p>{prod.title}</p>
          <input
            type="number"
            min="1"
            value={orderQty}
            onChange={(e) => setOrderQty(e.target.value)}
            className="input input-bordered w-full mt-4"
          />

          <div className="modal-action">
            <button className="btn" onClick={handleSendOrder}>
              Отправить
            </button>
            <form method="dialog">
              <button className="btn">Отмена</button>
            </form>
          </div>
        </div>
      </dialog>
    </section>
  );
});

export default Catalog;
