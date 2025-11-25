// /components/CompAdmin/OrderPrint.jsx
"use client";


import { Button, message } from "antd";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { sendOrderTelegram } from "@/http/telegramAPI";

const OrderPrint = ({ order, user }) => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Заказ №${order.id}`,
    removeAfterPrint: true,
  });

  const totalSum = order.orderItems.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price),
    0
  );
  const deliveryCost = parseFloat(order.deliveryCost || 0);
  const fullTotal = (totalSum + deliveryCost).toFixed(2);

  const handleSendToTelegram = async () => {
    // ❌ убираем артикул из текста накладной для Telegram
    const productList = order.orderItems
      .map(
        (item) =>
          `• ${item.product?.title} — ${parseFloat(item.price).toFixed(
            2
          )} $ x ${item.quantity} шт.`
      )
      .join("\n");

    const messageText = `
<b>📦 Накладная (Заказ №${order.id})</b>\n
<b>👤 Клиент:</b> ${user?.userData?.fullName || "—"}\n
<b>📞 Телефон:</b> ${user?.userData?.phone || "—"}\n
<b>📍 Адрес:</b> ${
      order.shippingInfo?.address || user?.userData?.address || "—"
    }\n
<b>🚚 Доставка:</b> ${order.shippingInfo?.courier || "Самовывоз"}\n
<b>💬 Комментарий:</b> ${order.message || "—"}\n\n
<b>🛒 Товары:</b>\n${productList}\n
${
  deliveryCost > 0
    ? `<b>🚚 Доставка:</b> ${deliveryCost.toFixed(2)} $`
    : ""
}
<b>💰 Общая сумма:</b> ${fullTotal} $
`;

    try {
      await sendOrderTelegram(messageText);
      message.success("Накладная отправлена в Telegram");
    } catch (err) {
      console.error("Ошибка при отправке в Telegram:", err);
      message.error("Ошибка отправки в Telegram");
    }
  };

  return (
    <div className="mb-8 mt-9">
      {/* Печатная версия накладной — без столбца "Артикул" */}
      <div
        ref={printRef}
        className="p-8 bg-white text-black text-sm w-[210mm] h-auto shadow mx-auto print:w-full"
      >
        <h1 className="text-xl font-bold mb-2">
          Накладная заказа №{order.id}
        </h1>
        <p className="mb-1">Клиент: {user?.userData?.fullName}</p>
        <p className="mb-1">Телефон: {user?.userData?.phone}</p>
        <p className="mb-1">
          Адрес: {order.shippingInfo?.address || user?.userData?.address}
        </p>
        <p className="mb-4">
          Способ доставки: {order.shippingInfo?.courier || "Самовывоз"}
        </p>

        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black px-2 py-1 text-left">Товар</th>
              {/* УДАЛЁН СТОЛБЕЦ "Артикул" */}
              <th className="border border-black px-2 py-1 text-left">
                Кол-во
              </th>
              <th className="border border-black px-2 py-1 text-left">Цена</th>
              <th className="border border-black px-2 py-1 text-left">
                Итого
              </th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => (
              <tr key={item.id}>
                <td className="border border-black px-2 py-1">
                  {item.product?.title}
                </td>
                {/* УДАЛЁН СТОЛБЕЦ С АРТИКУЛОМ */}
                <td className="border border-black px-2 py-1">
                  {item.quantity}
                </td>
                <td className="border border-black px-2 py-1">
                  {parseFloat(item.price).toFixed(2)} $
                </td>
                <td className="border border-black px-2 py-1">
                  {(item.quantity * parseFloat(item.price)).toFixed(2)} $
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {order.shippingInfo?.courier !== "Самовывоз" && (
          <p className="mb-2">
            Стоимость доставки: <strong>{deliveryCost.toFixed(2)} $</strong>
          </p>
        )}

        <p className="text-right font-semibold text-base mt-4">
          Общая сумма: {fullTotal} $
        </p>
      </div>

      <div className="mt-7 flex gap-4 justify-end pr-11">
        <Button onClick={handlePrint} className="mb-4">
          🖨️ Печать заказа
        </Button>
        <Button
          onClick={handleSendToTelegram}
          className="mb-4"
          type="primary"
        >
          📤 Отправить в Telegram
        </Button>
      </div>
    </div>
  );
};

export default OrderPrint;
