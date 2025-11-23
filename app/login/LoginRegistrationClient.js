// /app/login/LoginRegistrationClient.jsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/Form/FormLogin";
import RegistrationForm from "@/components/Form/RegistrationForm";
import FormOrder from "@/components/Form/FormOrder";

export default function LoginRegistrationClient() {
  const searchParams = useSearchParams();
  const search = searchParams.get("from");

  // tabs: 'login' | 'register' | 'partner'
  const [tab, setTab] = useState("login");

  // для совместимости с LoginForm / RegistrationForm,
  // которым мы раньше передавали setIsActive(true/false)
  const setIsActive = (val) => {
    setTab(val ? "login" : "register");
  };

  const isLogin = tab === "login";

  return (
    <main className="sd:pt-8 xz:pt-9 pb-20">
      <section>
        <div className="container mx-auto">
          <div className="sd:pt-16 xz:pt-8 max-w-xl mx-auto">
            {/* Toggle header */}
            <div className="flex items-center justify-center space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  tab === "login"
                    ? "bg-primary text-white"
                    : "bg-base-200 text-base-content hover:bg-base-300"
                }`}
                onClick={() => setTab("login")}
              >
                Вход
              </button>
              {/* <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  tab === "register"
                    ? "bg-primary text-white"
                    : "bg-base-200 text-base-content hover:bg-base-300"
                }`}
                onClick={() => setTab("register")}
              >
                Регистрация
              </button> */}
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  tab === "partner"
                    ? "bg-primary text-white"
                    : "bg-base-200 text-base-content hover:bg-base-300"
                }`}
                onClick={() => setTab("partner")}
              >
                Стать партнёром
              </button>
            </div>

            <div className="mt-8 card bg-base-100 shadow-md">
              <div className="card-body">
                {tab === "login" && (
                  <>
                    <h1 className="text-2xl font-semibold">Войти</h1>
                    <LoginForm setIsActive={setIsActive} search={search} />
                    <div className="mt-4 text-sm text-center">
                      Нет аккаунта?{" "}
                      <button
                        className="link link-primary"
                        onClick={() => setTab("partner")}
                      >
                        Стать партнёром
                      </button>
                    </div>
                  </>
                )}

                {tab === "register" && (
                  <>
                    <h1 className="text-2xl font-semibold">
                      Зарегистрироваться
                    </h1>
                    <RegistrationForm
                      setIsActive={setIsActive}
                      search={search}
                    />
                    <div className="mt-4 text-sm text-center">
                      Уже есть аккаунт?{" "}
                      <button
                        className="link link-primary"
                        onClick={() => setTab("login")}
                      >
                        Войти
                      </button>
                    </div>
                  </>
                )}

                {tab === "partner" && (
                  <>
                    <h1 className="text-2xl font-semibold text-center">
                      Стать партнёром
                    </h1>
                    <p className="mt-3 text-sm text-center text-gray-600">
                      Оставьте телефон и e-mail, и мы свяжемся с вами,
                      расскажем условия оптового сотрудничества и подключим
                      доступ к личному кабинету.
                    </p>

                    <div className="mt-6">
                      <FormOrder
                        title="Стать партнёром"
                        btn="Отправить заявку"
                        no={false}
                        user={null}
                        selectedProduct="Заявка на партнёрство"
                        closeModal={null}
                        setIsFormSubmitted={null}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
