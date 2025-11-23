// /components/Form/FormLogin.jsx
"use client";

import { MyContext } from "@/contexts/MyContextProvider";
import { login, dataUser } from "@/http/userAPI";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const LoginForm = ({ setIsActive, search }) => {
  const { user } = useContext(MyContext);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // antd message через hook, чтобы не было Warning про static function
  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((s) => !s);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tokenData = await login(formData);

      if (tokenData?.error) {
        messageApi.error(tokenData.error);
        setLoading(false);
        return;
      }

      const userDataFull = await dataUser();
      user.setIsAuth(true);
      user.setUserData(userDataFull);

      messageApi.success("Вы авторизованы!");
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        if (tokenData?.isAdmin) {
          router.push("/super-admin");
        } else if (search === "korzina") {
          router.push("/korzina");
        } else {
          router.push("/moj-kabinet");
        }
      }, 400);
    } catch (err) {
      messageApi.error("Ошибка авторизации. Повторите попытку.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Логин (почта)</span>
            <span className="label-text-alt">Обязательное поле</span>
          </label>
          <input
            type="email"
            name="email"
            autoComplete="username"
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
              autoComplete="current-password"
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
          <button
            type="submit"
            className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
