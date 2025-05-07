import { useState } from "react";
import { Input, Select, Button, message } from "antd";

const { TextArea } = Input;

const ShippingPanel = ({ orderId, address, orderItems, onSuccess, onCancel }) => {
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("");
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState(
    (orderItems || []).map(item => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
      price: parseFloat(item.price)
    }))
  );

  const handlePriceChange = (id, value) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, price: parseFloat(value) || 0 } : item));
  };

  const handleShippingSubmit = async () => {
    if (!courier) {
      message.error("Выберите способ доставки");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/order/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          courier,
          trackingNumber,
          address,
          deliveryCost,
          status: courier === "Самовывоз" ? "completed" : "shipped",
          items
        })
      });

      const result = await response.json();
      if (response.ok) {
        message.success("Заказ успешно оформлен");
        onSuccess();
      } else {
        message.error(result.message || "Ошибка при оформлении");
      }
    } catch (err) {
      console.error("Ошибка отправки данных:", err);
      message.error("Ошибка при оформлении заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow text-black mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Оформление заказа №{orderId}</h2>

      <label className="block mb-2 font-medium">Способ доставки</label>
      <Select
        className="w-full mb-4"
        placeholder="Выберите способ доставки"
        onChange={(value) => {
          setCourier(value);
          if (value === "Самовывоз") {
            setTrackingNumber("");
            setDeliveryCost("");
          }
        }}
        options={[
          { value: "Самовывоз", label: "Самовывоз Космонавтов 9, каб 3" },
          { value: "Курьер", label: "Отправить курьером" },
          { value: "Такси", label: "Отправить такси" },
          { value: "Почта", label: "Отправить почтой" },
          { value: "Автолайт", label: "Отправить автолайт" },
          { value: "Маршрутка", label: "Отправить ближайшей маршруткой" },
        ]}
      />


      {courier !== "Самовывоз" && (
        <>
          <label className="block mb-2 font-medium">Трек-номер</label>
          <Input
            className="mb-4"
            placeholder="Введите трек-номер (если есть)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />

          <label className="block mb-2 font-medium">Адрес доставки</label>
          <TextArea
            rows={2}
            className="mb-4"
            value={address}
            onChange={() => { }}
            disabled
          />

          <label className="block mb-2 font-medium">Стоимость доставки ($)</label>
          <Input
            type="number"
            className="mb-6"
            placeholder="0.00"
            value={deliveryCost}
            onChange={(e) => setDeliveryCost(e.target.value)}
          />
        </>
      )}

      <h3 className="font-medium mb-2">Товары:</h3>
      <div className='bg-slate-50 px-4 py-1'>
        <table className="table-auto w-full mb-4 text-xs text-left">
          <thead>
            <tr>
              <th>Название</th>
              <th>Кол-во</th>
              <th>Цена $</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.product?.title}</td>
                <td>{item.quantity}</td>
                <td>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 justify-end">
        <Button loading={loading} onClick={onCancel}>
          Отмена
        </Button>
        <Button type="primary" loading={loading} onClick={handleShippingSubmit}>
          {courier === "Самовывоз" ? "Завершить заказ" : "Отправить заказ"}
        </Button>
      </div>
    </div>
  );
};

export default ShippingPanel;
