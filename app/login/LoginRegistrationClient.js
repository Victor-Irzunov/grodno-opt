// /app/login/LoginRegistrationClient.jsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/Form/FormLogin";
import RegistrationForm from "@/components/Form/RegistrationForm";

export default function LoginRegistrationClient() {
  const [isActive, setIsActive] = useState(true); // true = login, false = registration
  const searchParams = useSearchParams();
  const search = searchParams.get("from");

  return (
    <main className="sd:pt-8 xz:pt-9 pb-20">
      <section>
        <div className="container mx-auto">
          <div className="sd:pt-16 xz:pt-8 max-w-xl mx-auto">
            {/* Toggle header */}
            <div className="flex items-center justify-center space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-base-200 text-base-content hover:bg-base-300"
                }`}
                onClick={() => setIsActive(true)}
              >
                Вход
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  !isActive
                    ? "bg-primary text-white"
                    : "bg-base-200 text-base-content hover:bg-base-300"
                }`}
                onClick={() => setIsActive(false)}
              >
                Регистрация
              </button>
            </div>

            <div className="mt-8 card bg-base-100 shadow-md">
              <div className="card-body">
                {isActive ? (
                  <>
                    <h1 className="text-2xl font-semibold">Войти</h1>
                    <LoginForm setIsActive={setIsActive} search={search} />
                    <div className="mt-4 text-sm text-center">
                      Нет аккаунта?{" "}
                      <button
                        className="link link-primary"
                        onClick={() => setIsActive(false)}
                      >
                        Зарегистрироваться
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-semibold">Зарегистрироваться</h1>
                    <RegistrationForm setIsActive={setIsActive} search={search} />
                    <div className="mt-4 text-sm text-center">
                      Уже есть аккаунт?{" "}
                      <button
                        className="link link-primary"
                        onClick={() => setIsActive(true)}
                      >
                        Войти
                      </button>
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
