// /components/Form/RegistrationForm.jsx
"use client";

import { registration } from "@/http/userAPI";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const RegistrationForm = ({ setIsActive, search }) => {
  const router = useRouter();
  const [isActiveAlert, setIsActiveAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleTogglePassword = () => setShowPassword((s) => !s);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    registration(formData)
      .then((data) => {
        if (data) {
          setIsActiveAlert(true);
          setFormData({ email: "", password: "" });
          setTimeout(() => {
            setIsActiveAlert(false);
            if (search === "korzina") {
              router.push("/korzina");
            } else {
              router.push("/moj-kabinet");
            }
          }, 1500);
        }
      })
      .catch(() => {
        // Ничего не выводим здесь (сообщения об ошибке обрабатываются в API/обёртках при необходимости)
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Логин (почта)</span>
            <span className="label-text-alt">Обязательное поле</span>
          </label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Введите ваш логин (почту)"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Пароль</span>
            <span className="label-text-alt">Обязательное поле</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full pr-10"
              placeholder="Введите пароль"
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/70 hover:text-base-content"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>
        </div>

        <div className="form-control pt-2">
          <button type="submit" className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}>
            {loading ? "Регистрируем..." : "Зарегистрироваться"}
          </button>
        </div>
      </form>

      {isActiveAlert ? (
        <div role="alert" className="alert alert-success mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Вы успешно зарегистрированы!</span>
        </div>
      ) : null}
    </>
  );
};

export default RegistrationForm;
