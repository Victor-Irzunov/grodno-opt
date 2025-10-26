// /app/super-admin/page.jsx
"use client";
import AddCategoryAdmin from "@/components/CompAdmin/AddCategoryAdmin";
import AddGroupAdmin from "@/components/CompAdmin/AddGroupAdmin";
import AddOneProductAdmin from "@/components/CompAdmin/AddOneProductAdmin";
import BalanceAdmin from "@/components/CompAdmin/BalanceAdmin";
import EditDiscountGroupAdmin from "@/components/CompAdmin/EditDiscountGroupAdmin";
import MainAdmin from "@/components/CompAdmin/MainAdmin";
import OrdersOneClient from "@/components/CompAdmin/OrdersOneClient";
import ProductAdmin from "@/components/CompAdmin/ProductAdmin";
import RegistrationAdmin from "@/components/CompAdmin/RegistrationAdmin";
import TekushchieZakazyAdmin from "@/components/CompAdmin/TekushchieZakazyAdmin";
import UpdateOneProductAdmin from "@/components/CompAdmin/UpdateOneProductAdmin";
import UserDataAdmin from "@/components/CompAdmin/UserDataAdmin";
import ContactRequestsAdmin from "@/components/CompAdmin/ContactRequestsAdmin";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


function Page() {
  const [activeComponent, setActiveComponent] = useState("main");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "main": return <MainAdmin />;
      case "addCategory": return <AddCategoryAdmin />;
      case "addGroup": return <AddGroupAdmin />;
      case "AddProductPrice": return <ProductAdmin />;
      case "AddOneProductAdmin": return <AddOneProductAdmin />;
      case "UpdateOneProductAdmin": return <UpdateOneProductAdmin />;
      case "EditDiscountGroupAdmin": return <EditDiscountGroupAdmin />;
      case "userData": return <UserDataAdmin />;
      case "registration": return <RegistrationAdmin />;
      case "orders": return <TekushchieZakazyAdmin />;
      case "balance": return <BalanceAdmin />;
      case "ordersOneClient": return <OrdersOneClient />;
      case "contactRequests": return <ContactRequestsAdmin />;
      default: return <MainAdmin />;
    }
  };

  return (
    <main>
      <section className="flex justify-between min-h-screen relative">
        <div className="w-1/5 bg-[#202020] border-r border-[#2B2B2B] pt-6 px-8">
          <aside className="sticky top-10">
            <div className="mb-7">
              <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/`} className="cursor-pointer">
                <Image src="/logo/logo-blue.webp" alt="Логотип" width={150} height={150} />
              </Link>
            </div>

           

            <div className='my-8'>
              <Link href='/' className="text-blue-500">
                На главную
              </Link>
            </div>

            <ul className="text-[#C1C1C1] font-light space-y-3 text-sm mt-20 cursor-pointer">
              <li onClick={() => setActiveComponent("main")}
                className={`flex space-x-3 items-center hover:bg-[#191919] py-2 px-3 rounded-md ${activeComponent === "main" ? "border border-primary rounded-md py-2 px-2.5 text-primary bg-[#317bff1a]" : ""}`}>
                <Image src="/svg/main.svg" alt="Главная" width={20} height={20} />
                <p>Главная</p>
              </li>

              <li className="hover:bg-[#191919] py-1 px-1 rounded-md">
                <div className="collapse">
                  <input type="checkbox" />
                  <div className="collapse-title flex space-x-2.5 items-center">
                    <Image src="/svg/product.svg" alt="Товар" width={20} height={20} />
                    <p>Товар</p>
                  </div>
                  <div className="collapse-content pl-10 text-sm">
                    <div onClick={() => setActiveComponent("addCategory")}
                      className={`pl-0.5 ${activeComponent === "addCategory" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Добавить категорию</span>
                    </div>
                    <div><Image src="/svg/vertical-line.svg" alt="" width={10} height={60} /></div>
                    <div onClick={() => setActiveComponent("addGroup")}
                      className={`pl-0.5 ${activeComponent === "addGroup" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Добавить группу</span>
                    </div>
                    <div><Image src="/svg/vertical-line.svg" alt="" width={10} height={60} /></div>
                    <div onClick={() => setActiveComponent("AddProductPrice")}
                      className={`pl-0.5 ${activeComponent === "AddProductPrice" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Загрузить прайс</span>
                    </div>
                    <div><Image src="/svg/vertical-line.svg" alt="" width={10} height={60} /></div>
                    <div onClick={() => setActiveComponent("AddOneProductAdmin")}
                      className={`pl-0.5 ${activeComponent === "AddOneProductAdmin" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Добавить товар</span>
                    </div>
                    <div><Image src="/svg/vertical-line.svg" alt="" width={10} height={60} /></div>
                    <div onClick={() => setActiveComponent("UpdateOneProductAdmin")}
                      className={`pl-0.5 ${activeComponent === "UpdateOneProductAdmin" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Редактировать товар</span>
                    </div>
                    <div><Image src="/svg/vertical-line.svg" alt="" width={10} height={60} /></div>
                    <div onClick={() => setActiveComponent("EditDiscountGroupAdmin")}
                      className={`pl-0.5 ${activeComponent === "EditDiscountGroupAdmin" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Скидка группы</span>
                    </div>
                  </div>
                </div>
              </li>

              <li className="hover:bg-[#191919] py-1 px-1 rounded-md">
                <div className="collapse">
                  <input type="checkbox" />
                  <div className="collapse-title flex space-x-2.5 items-center">
                    <Image src="/svg/user-data.svg" alt="Клиенты" width={20} height={20} />
                    <p>Клиенты</p>
                  </div>
                  <div className="collapse-content pl-10 text-sm">
                    <div onClick={() => setActiveComponent("registration")}
                      className={`pl-0.5 ${activeComponent === "registration" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Регистрация клиента</span>
                    </div>
                    <div><Image src="/svg/vertical-line.svg" alt="" width={10} height={60} /></div>
                    <div onClick={() => setActiveComponent("userData")}
                      className={`pl-0.5 ${activeComponent === "userData" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Данные клиентов</span>
                    </div>
                  </div>
                </div>
              </li>

              <li className="hover:bg-[#191919] py-1 px-1 rounded-md">
                <div className="collapse">
                  <input type="checkbox" />
                  <div className="collapse-title flex space-x-2.5 items-center">
                    <Image src="/svg/orders.svg" alt="Заказы" width={20} height={20} />
                    <p>Заказы</p>
                  </div>
                  <div className="collapse-content pl-10 text-sm">
                    <div onClick={() => setActiveComponent("orders")}
                      className={`pl-0.5 ${activeComponent === "orders" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Текущие заказы</span>
                    </div>
                    <div><Image src="/svg/vertical-line.svg" alt="" width={10} height={60} /></div>
                    <div onClick={() => setActiveComponent("ordersOneClient")}
                      className={`pl-0.5 ${activeComponent === "ordersOneClient" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Заказы клиента</span>
                    </div>
                  </div>
                </div>
              </li>

              <li className="hover:bg-[#191919] py-1 px-1 rounded-md">
                <div className="collapse">
                  <input type="checkbox" />
                  <div className="collapse-title flex space-x-2.5 items-center">
                    <Image src="/svg/money.svg" alt="Баланс" width={20} height={20} />
                    <p>Баланс</p>
                  </div>
                  <div className="collapse-content pl-10 text-sm">
                    <div onClick={() => setActiveComponent("balance")}
                      className={`pl-0.5 ${activeComponent === "balance" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}>
                      • <span>Пополнить баланс</span>
                    </div>
                  </div>
                </div>
              </li>

              <li onClick={() => setActiveComponent("contactRequests")}
                className={`flex space-x-3 items-center hover:bg-[#191919] py-2 px-3 rounded-md ${activeComponent === "contactRequests" ? "border border-primary rounded-md py-2 px-2.5 text-primary bg-[#317bff1a]" : ""}`}>
                <Image src="/svg/user-plus.svg" alt="Заявки" width={20} height={20} />
                <p>Заявки на сотрудничество</p>
              </li>
            </ul>
          </aside>
        </div>

        <div className="w-4/5 bg-[#191919] pt-6">{renderActiveComponent()}</div>
      </section>
    </main>
  );
}

export default Page;
