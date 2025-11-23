// /components/Form/FormLichnyeDannye.jsx — ПОЛНОСТЬЮ
import { useState } from "react";
import { Form, Input, Button } from "antd";
import { dataUser2 } from "@/http/userAPI";

export const FormLichnyeDannye = ({ user, myStyle }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [form] = Form.useForm();

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  const onFinish = async (values) => {
    try {
      const { newPassword, ...restValues } = values;

      // 1. сохраняем основные данные пользователя
      const response = await dataUser2({
        ...restValues,
        phone: restValues.phone,
      });

      if (!response) {
        showToast("Не удалось сохранить данные");
        console.log("Failed to save user data");
        return;
      }

      let finalMessage = "Данные сохранены";

      // 2. смена пароля (если введён)
      if (newPassword && String(newPassword).trim().length > 0) {
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("token_grodno")
              : null;

          const headers = { "Content-Type": "application/json" };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const passRes = await fetch("/api/user/change-password", {
            method: "POST",
            headers,
            body: JSON.stringify({ newPassword }),
          });

          const passData = await passRes
            .json()
            .catch(() => ({ ok: false, message: "" }));

          if (passRes.ok && passData?.ok) {
            finalMessage = "Данные сохранены, пароль изменён";
          } else {
            finalMessage =
              passData?.message ||
              "Данные сохранены, но пароль изменить не удалось";
          }
        } catch (err) {
          console.error("Ошибка смены пароля:", err);
          finalMessage =
            "Данные сохранены, но пароль изменить не удалось (ошибка соединения)";
        }
      }

      showToast(finalMessage);
      form.resetFields();
    } catch (err) {
      console.log("Failed:", err);
      showToast("Ошибка при сохранении данных");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Form
        form={form}
        name="lichnye_dannye"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          email: user?.email,
          fullName: user?.userData?.fullName,
          phone: user?.userData?.phone,
          address: user?.userData?.address,
        }}
        className="grid sd:grid-cols-2 xz:grid-cols-1 sd:gap-6 xz:gap-0"
      >
        <Form.Item
          label={
            <span
              style={myStyle ? { color: "white" } : { color: "black" }}
            >
              Фамилия Имя Отчество
            </span>
          }
          name="fullName"
          rules={[{ required: true, message: "Пожалуйста, введите ФИО" }]}
        >
          <Input
            placeholder={
              myStyle
                ? ""
                : "Заполните, чтобы мы знали, как к вам обращаться"
            }
            style={
              myStyle
                ? { backgroundColor: "#191919", color: "white" }
                : { borderRadius: "2px" }
            }
          />
        </Form.Item>

        <Form.Item
          label={
            <span
              style={myStyle ? { color: "white" } : { color: "black" }}
            >
              E-mail
            </span>
          }
          name="email"
          rules={[
            { required: true, message: "Пожалуйста, введите E-mail" },
            { type: "email", message: "Введите корректный E-mail" },
          ]}
        >
          <Input
            placeholder="Для отправки уведомлений о статусе заказа"
            style={
              myStyle
                ? { backgroundColor: "#191919", color: "white" }
                : { borderRadius: "2px" }
            }
          />
        </Form.Item>

        <Form.Item
          label={
            <span
              style={myStyle ? { color: "white" } : { color: "black" }}
            >
              Телефон
            </span>
          }
          name="phone"
          rules={[{ required: true, message: "Пожалуйста, введите телефон" }]}
        >
          <Input
            placeholder="+375 29 491-19-11"
            style={
              myStyle
                ? { backgroundColor: "#191919", color: "white" }
                : { width: "100%", borderRadius: "2px" }
            }
          />
        </Form.Item>

        <Form.Item
          label={
            <span
              style={myStyle ? { color: "white" } : { color: "black" }}
            >
              Адрес
            </span>
          }
          name="address"
          rules={[{ required: true, message: "Пожалуйста, введите адрес" }]}
        >
          <Input
            placeholder="Город, улица, дом"
            style={
              myStyle
                ? { backgroundColor: "#191919", color: "white" }
                : { width: "100%", borderRadius: "2px" }
            }
          />
        </Form.Item>

        {/* Ряд: НОВЫЙ ПАРОЛЬ + КНОПКА НА ОДНОМ УРОВНЕ */}
        <div className="sd:col-span-2">
          <Form.Item
            label={
              <span
                style={myStyle ? { color: "white" } : { color: "black" }}
              >
                Новый пароль
              </span>
            }
            style={{ marginBottom: 0 }}
          >
            <div className="grid sd:grid-cols-[minmax(0,1fr)_auto] xz:grid-cols-1 sd:gap-6 xz:gap-2 items-end">
              <Form.Item
                name="newPassword"
                rules={[
                  {
                    min: 6,
                    message:
                      "Новый пароль должен быть не менее 6 символов",
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  placeholder="Оставьте пустым, если не хотите менять пароль"
                  style={
                    myStyle
                      ? { backgroundColor: "#191919", color: "white" }
                      : { width: "100%", borderRadius: "2px" }
                  }
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  color="primary"
                  variant={myStyle ? "outlined" : ""}
                  style={
                    myStyle
                      ? { width: "100%", backgroundColor: "#191919" }
                      : { width: "100%", borderRadius: "2px" }
                  }
                >
                  Сохранить изменения
                </Button>
              </Form.Item>
            </div>
          </Form.Item>
        </div>
      </Form>

      {toastVisible && (
        <div className="toast toast-center toast-middle">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormLichnyeDannye;
