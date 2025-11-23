// /app/kontakty/page.jsx
"use client";

import React from "react";
import phoneNumbers from "@/config/config";
import FormOrder from "@/components/Form/FormOrder";

export default function Page() {
  return (
    <main className="pt-20">
      <section>
        <div className="container mx-auto">
          <h1 className="sd:text-3xl xz:text-xl font-semibold">Контакты</h1>

          <div className="mt-8 grid sd:grid-cols-2 xz:grid-cols-1 gap-8">
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Телефон:</p>
              <a
                href={`tel:${phoneNumbers.mainPhoneLink}`}
                className="btn sd:bg-black xz:bg-black sd:text-white xz:text-white border-none rounded-sm font-light w-fit"
              >
                {phoneNumbers.mainPhone}
              </a>

              <div className="divider"></div>

              <h2 className="text-xl font-semibold">Заявка на сотрудничество</h2>

              {/* Форма "Стать партнёром" / "Заявка на сотрудничество" */}
              <div className="mt-4 max-w-lg">
                <FormOrder
                  selectedProduct="Заявка на сотрудничество"
                  closeModal={null}
                  setIsFormSubmitted={null}
                  title={null}
                  btn="Отправить заявку"
                  no={false}
                  user={null}
                />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>
                Мы работаем с оптовыми клиентами. Оставьте заявку — менеджер свяжется
                с вами, расскажет условия сотрудничества и поможет подключить доступ к
                личному кабинету.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
