// /components/FormsAdmin/EditUserDataAdminForm.jsx — ПОЛНОСТЬЮ
import { Button, Form, Input, InputNumber } from "antd";
import { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { sendOrderTelegram } from "@/http/telegramAPI";
import { editUserDataAdmin } from "@/http/adminAPI";

const EditUserDataAdminForm = ({ data, onSuccess, userId }) => {
  const [form] = Form.useForm();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Сохранение данных клиента (ФИО, почта, скидка и т.д.)
  const onFinish = async (values) => {
    try {
      const { addBalance, balance, ...restValues } = values;

      const response = await editUserDataAdmin(restValues);
      if (response) {
        form.resetFields();
        setToastMessage("Данные изменены!");
        setToastVisible(true);

        const messageForm = `
<b>Изменённые данные клиента:</b>\n
<b>ФИО:</b> ${restValues.fullName}\n
<b>Телефон:</b> <a href='tel:${restValues.phone}'>${restValues.phone}</a>\n
<b>Почта:</b> ${restValues.email}\n
<b>Адрес:</b> ${restValues.address}\n
<b>Новый пароль:</b> ${restValues.password || ""}\n
<b>Скидка:</b> ${restValues.discount}%\n
<b>Лимит:</b> ${restValues.limit} $
`;
        sendOrderTelegram(messageForm);

        setTimeout(() => {
          setToastVisible(false);
          setToastMessage("");
        }, 3000);

        if (onSuccess) onSuccess();
      } else {
        console.error("Ошибка редактирования клиента");
      }
    } catch (error) {
      console.error("Ошибка редактирования клиента:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Отдельное пополнение баланса
  const handleAddBalance = async () => {
    try {
      const amount = Number(form.getFieldValue("addBalance") || 0);

      if (!userId) {
        console.error("Не передан userId для пополнения баланса");
        setToastMessage("Ошибка: не найден ID клиента");
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
          setToastMessage("");
        }, 3000);
        return;
      }

      if (!amount || amount <= 0) {
        setToastMessage("Укажите сумму пополнения больше 0");
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
          setToastMessage("");
        }, 3000);
        return;
      }

      const res = await fetch("/api/user/add-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });

      const dataRes = await res.json();

      if (!res.ok) {
        console.error("Ошибка пополнения баланса:", dataRes);
        setToastMessage(dataRes.message || "Ошибка при пополнении баланса");
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
          setToastMessage("");
        }, 3000);
        return;
      }

      // Успех пополнения
      setToastMessage(`Баланс пополнен на ${amount} $`);
      setToastVisible(true);

      // Телеграм-уведомление
      const currentValues = form.getFieldsValue();
      const fullName = currentValues.fullName || data.fullName || "";
      const phone = currentValues.phone || data.phone || "";
      const email = currentValues.email || data.email || "";

      const tgMessage = `
<b>Пополнение баланса клиента:</b>\n
<b>ФИО:</b> ${fullName}\n
<b>Телефон:</b> <a href='tel:${phone}'>${phone}</a>\n
<b>Почта:</b> ${email}\n
<b>Сумма пополнения:</b> ${amount} $
`;
      sendOrderTelegram(tgMessage);

      // очищаем только поле пополнения
      form.setFieldValue("addBalance", null);

      setTimeout(() => {
        setToastVisible(false);
        setToastMessage("");
      }, 3000);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Ошибка соединения при пополнении баланса:", err);
      setToastMessage("Ошибка соединения при пополнении");
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        setToastMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <Form
        form={form}
        name="editUser"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={data}
        className="grid sd:grid-cols-2 xz:grid-cols-1 sd:gap-6 xz:gap-0"
      >
        <Form.Item
          label={
            <span style={{ color: "white" }}>Фамилия Имя Отчество</span>
          }
          name="fullName"
          rules={[{ required: true, message: "Пожалуйста, введите ФИО" }]}
        >
          <Input
            placeholder="Полное ФИО"
            className="placeholder-white/45"
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>E-mail</span>}
          name="email"
          rules={[
            { required: true, message: "Пожалуйста, введите E-mail" },
            { type: "email", message: "Введите корректный E-mail" },
          ]}
        >
          <Input
            placeholder="Почта клиента"
            className="placeholder-white/45"
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Пароль</span>}
          name="password"
          tooltip={{
            title: "Придумайте клиенту пароль",
            color: "#191919",
            styles: { root: { color: "white" } },
            icon: <QuestionCircleOutlined style={{ color: "white" }} />,
          }}
        >
          <Input.Password
            style={{ backgroundColor: "#191919", color: "white" }}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: "white" }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: "white" }} />
              )
            }
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Телефон</span>}
          name="phone"
          rules={[
            { required: true, message: "Пожалуйста, введите телефон" },
          ]}
        >
          <Input
            placeholder="+375 29 491-19-11"
            className="placeholder-white/45"
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        <div className="flex space-x-4">
          <Form.Item
            label={<span style={{ color: "white" }}>Скидка</span>}
            name="discount"
            rules={[
              { required: true, message: "Пожалуйста, введите скидку" },
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => (value ? value.replace("%", "") : "")}
              style={{ backgroundColor: "#191919", color: "white" }}
              className="white-text"
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "white" }}>Лимит $</span>}
            name="limit"
            rules={[
              { required: true, message: "Пожалуйста, введите лимит" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ backgroundColor: "#191919", color: "white" }}
              className="white-text"
            />
          </Form.Item>
        </div>

        {/* Текущий баланс (readonly) */}
        <Form.Item
          label={<span style={{ color: "white" }}>Текущий баланс $</span>}
          name="balance"
        >
          <InputNumber
            disabled
            style={{ backgroundColor: "#191919", color: "white" }}
            className="white-text"
          />
        </Form.Item>

        {/* Сумма пополнения + отдельная кнопка */}
        <Form.Item
          label={<span style={{ color: "white" }}>Пополнить баланс $</span>}
          name="addBalance"
          tooltip="Опционально. Сумма будет добавлена к текущему балансу."
        >
          <div className="flex items-center gap-3">
            <InputNumber
              min={0}
              step={0.01}
              style={{ backgroundColor: "#191919", color: "white" }}
              className="white-text white-placeholder"
              placeholder="Сумма пополнения"
            />
            <Button type="primary" onClick={handleAddBalance}>
              Пополнить баланс
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Адрес</span>}
          name="address"
          rules={[
            { required: true, message: "Пожалуйста, введите адрес" },
          ]}
        >
          <Input
            className="placeholder-white/45"
            placeholder="Адрес клиента"
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        <Form.Item className="sd:mt-7 xz:mt-1">
          <Button
            type="primary"
            htmlType="submit"
            color="primary"
            variant="outlined"
            style={{ width: "100%", backgroundColor: "#191919" }}
          >
            Сохранить
          </Button>
        </Form.Item>
      </Form>

      {toastVisible && (
        <div className="toast toast-center toast-middle">
          <div className="alert alert-success">
            <span className="text-white font-bold">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUserDataAdminForm;
