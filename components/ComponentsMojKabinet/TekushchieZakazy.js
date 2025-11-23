// /components/ComponentsMojKabinet/TekushchieZakazy.jsx
import Link from "next/link";

const TekushchieZakazy = ({ data, setActiveComponent }) => {
  const orders =
    data?.wholesaleBuyer?.orders?.filter(
      (order) => order.status !== "completed"
    ) || [];

  return (
    <div className="pt-10">
      <h3 className="sd:text-2xl xz:text-xl font-semibold mb-6">
        {orders.length > 0 ? "Текущие заказы" : "Текущие заказы не найдены"}
      </h3>

      {orders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const itemsTotal = Number(order.totalAmount || 0);
            const delivery = Number(order.deliveryCost || 0);
            const totalWithDelivery = itemsTotal + delivery;

            const deliveryMethod =
              order.shippingInfo?.courier || "Самовывоз";

            return (
              <div key={order.id} className="border p-4 rounded-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">Заказ №{order.id}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm mb-1">
                  Статус:{" "}
                  <span className="font-semibold">{order.status}</span>
                </p>
                <p className="text-sm mb-1">
                  Статус доставки:{" "}
                  <span className="font-semibold">
                    {order.deliveryStatus}
                  </span>
                </p>
                <p className="text-sm mb-1">
                  Способ доставки:{" "}
                  <span className="font-semibold">{deliveryMethod}</span>
                </p>

                {order.shippingInfo && (
                  <p className="text-sm mb-1">
                    Трек-номер:{" "}
                    <span className="font-semibold">
                      {order.shippingInfo.trackingNumber || "Нет"}
                    </span>
                  </p>
                )}

                <div className="mt-4 overflow-x-auto">
                  <p className="text-sm font-semibold mb-2">Товары:</p>
                  <table className="min-w-full text-sm border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100 text-left sd:text-sm xz:text-[10px]">
                        <th className="p-2 border border-gray-300">№</th>
                        <th className="p-2 border border-gray-300">Название</th>
                        <th className="p-2 border border-gray-300">Кол-во</th>
                        <th className="p-2 border border-gray-300">
                          Цена за шт.
                        </th>
                        <th className="p-2 border border-gray-300">Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, index) => {
                        const price = parseFloat(item.price);
                        const quantity = item.quantity;
                        const total = (price * quantity).toFixed(2);

                        return (
                          <tr
                            key={item.id}
                            className="border-t border-gray-300 sd:text-base xz:text-[10px]"
                          >
                            <td className="p-2 border border-gray-300">
                              {index + 1}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {item.product.title}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {quantity}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {price} $
                            </td>
                            <td className="p-2 border border-gray-300">
                              {total} $
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="mt-4 text-sm">
                    <p className="mb-1">
                      Сумма товаров:{" "}
                      <span className="font-semibold">
                        {itemsTotal.toFixed(2)} $
                      </span>
                    </p>
                    <p className="mb-1">
                      Стоимость доставки:{" "}
                      <span className="font-semibold">
                        {delivery.toFixed(2)} $
                      </span>
                    </p>
                    <p className="mb-1 mt-2 font-bold">
                      Итого к оплате:{" "}
                      <span className="font-semibold">
                        {totalWithDelivery.toFixed(2)} $
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="border sd:p-6 xz:p-4 rounded-sm mt-8">
            <p
              onClick={() => setActiveComponent("IstoriyaZakazov")}
              className="font-bold text-primary text-sm cursor-pointer"
            >
              Посмотреть историю заказов
            </p>
          </div>
          <div className="border sd:p-6 xz:p-4 rounded-sm mt-4">
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/catalog`}
              className="font-semibold text-primary text-sm"
            >
              Перейти в каталог
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default TekushchieZakazy;
