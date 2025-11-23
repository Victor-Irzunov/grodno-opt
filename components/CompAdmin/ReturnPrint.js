// /components/CompAdmin/ReturnPrint.jsx
"use client";

import { Button, message } from "antd";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { sendOrderTelegram } from "@/http/telegramAPI";

const ReturnPrint = ({ buyer, returns }) => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Возвраты клиента ${buyer?.user?.userData?.fullName || buyer?.user?.email || buyer?.id}`,
    removeAfterPrint: true,
  });

  const user = buyer?.user;
  const userData = user?.userData;

  const fullName =
    userData?.fullName?.trim() ||
    user?.email?.trim() ||
    `Клиент ID ${buyer?.id}`;
  const phone = userData?.phone || "-";
  const address = userData?.address || "-";
  const email = user?.email || "-";

  const rows = [];
  returns.forEach((ret) => {
    ret.returnItems.forEach((ri) => {
      rows.push({
        returnId: ret.id,
        orderId: ret.orderId,
        date: new Date(ret.createdAt).toLocaleDateString(),
        status: ret.status,
        productTitle: ri.product?.title || "Товар",
        article: ri.product?.article || "",
        quantity: ri.quantity,
        refundAmount: Number(ri.refundAmount),
      });
    });
  });

  const totalRefundAll = returns.reduce(
    (sum, ret) => sum + Number(ret.totalRefund),
    0
  );

  const handleSendToTelegram = async () => {
    if (!returns || returns.length === 0) {
      message.error("Нет возвратов для отправки");
      return;
    }

    const lines = returns.map((ret) => {
      const header = `Возврат №${ret.id} по заказу #${ret.orderId} от ${new Date(
        ret.createdAt
      ).toLocaleDateString()} (статус: ${ret.status})`;
      const itemsText = ret.returnItems
        .map(
          (ri) =>
            `• ${ri.product?.title || "Товар"} (арт. ${
              ri.product?.article || "-"
            }) — ${ri.quantity} шт., сумма: ${Number(
              ri.refundAmount
            ).toFixed(2)} $`
        )
        .join("\n");
      const total = `Сумма по возврату: ${Number(ret.totalRefund).toFixed(
        2
      )} $`;

      return `${header}\n${itemsText}\n${total}`;
    });

    const msg = `
<b>🔁 Лист возвратов клиента</b>\n
<b>👤 Клиент:</b> ${fullName}
<b>📧 Email:</b> ${email}
<b>📞 Телефон:</b> ${phone}
<b>📍 Адрес:</b> ${address}\n
<b>Количество возвратов:</b> ${returns.length}
<b>Общая сумма возврата:</b> ${totalRefundAll.toFixed(2)} $\n
${lines.join("\n\n")}
`.trim();

    try {
      await sendOrderTelegram(msg);
      message.success("Лист возвратов отправлен в Telegram");
    } catch (err) {
      console.error("Ошибка при отправке в Telegram:", err);
      message.error("Ошибка отправки в Telegram");
    }
  };

  return (
    <div className="mt-6">
      <div
        ref={printRef}
        className="p-8 bg-white text-black text-sm w-[210mm] h-auto shadow mx-auto print:w-full"
      >
        <h1 className="text-xl font-bold mb-2">
          Лист возвратов клиента
        </h1>
        <p className="mb-1">
          Клиент: <strong>{fullName}</strong>
        </p>
        <p className="mb-1">
          Email: <strong>{email}</strong>
        </p>
        <p className="mb-1">
          Телефон: <strong>{phone}</strong>
        </p>
        <p className="mb-4">
          Адрес: <strong>{address}</strong>
        </p>

        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black px-2 py-1 text-left">
                № возв.
              </th>
              <th className="border border-black px-2 py-1 text-left">
                № заказа
              </th>
              <th className="border border-black px-2 py-1 text-left">
                Дата
              </th>
              <th className="border border-black px-2 py-1 text-left">
                Статус
              </th>
              <th className="border border-black px-2 py-1 text-left">
                Товар
              </th>
              <th className="border border-black px-2 py-1 text-left">
                Артикул
              </th>
              <th className="border border-black px-2 py-1 text-left">
                Кол-во
              </th>
              <th className="border border-black px-2 py-1 text-left">
                Сумма $
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={`${row.returnId}-${idx}`}>
                <td className="border border-black px-2 py-1">
                  {row.returnId}
                </td>
                <td className="border border-black px-2 py-1">
                  {row.orderId}
                </td>
                <td className="border border-black px-2 py-1">
                  {row.date}
                </td>
                <td className="border border-black px-2 py-1">
                  {row.status}
                </td>
                <td className="border border-black px-2 py-1">
                  {row.productTitle}
                </td>
                <td className="border border-black px-2 py-1">
                  {row.article}
                </td>
                <td className="border border-black px-2 py-1">
                  {row.quantity}
                </td>
                <td className="border border-black px-2 py-1">
                  {row.refundAmount.toFixed(2)} $
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-right font-semibold text-base mt-4">
          Общая сумма по возвратам: {totalRefundAll.toFixed(2)} $
        </p>
      </div>

      <div className="mt-4 flex gap-4 justify-end">
        <Button onClick={handlePrint}>🖨️ Печать возвратов</Button>
        <Button type="primary" onClick={handleSendToTelegram}>
          📤 Отправить в Telegram
        </Button>
      </div>
    </div>
  );
};

export default ReturnPrint;
