export const getPrintableHTML = (order, user) => {
	const totalSum = order.orderItems.reduce(
	  (sum, item) => sum + item.quantity * parseFloat(item.price),
	  0
	);
 
	const deliveryCost = parseFloat(order.deliveryCost || 0).toFixed(2);
	const grandTotal = (totalSum + parseFloat(deliveryCost)).toFixed(2);
 
	const rows = order.orderItems.map(
	  (item) => `
		 <tr>
			<td style="border:1px solid #000;padding:4px">${item.product?.title}</td>
			<td style="border:1px solid #000;padding:4px">${item.product?.article}</td>
			<td style="border:1px solid #000;padding:4px">${item.quantity}</td>
			<td style="border:1px solid #000;padding:4px">${item.price} $</td>
			<td style="border:1px solid #000;padding:4px">${(item.quantity * parseFloat(item.price)).toFixed(2)} $</td>
		 </tr>
	  `
	).join('');
 
	return `
	  <div style="padding:32px;font-family:sans-serif;font-size:12px;color:#000;width:210mm;background:#fff">
		 <h1 style="font-size:18px;margin-bottom:12px;">Накладная заказа №${order.id}</h1>
		 <p>Клиент: ${user?.userData?.fullName}</p>
		 <p>Телефон: ${user?.userData?.phone}</p>
		 <p>Адрес: ${order.shippingInfo?.address || user?.userData?.address}</p>
		 <p style="margin-bottom:16px;">Способ доставки: ${order.shippingInfo?.courier || "Самовывоз"}</p>
 
		 <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:16px">
			<thead>
			  <tr>
				 <th style="border:1px solid #000;padding:4px">Товар</th>
				 <th style="border:1px solid #000;padding:4px">Артикул</th>
				 <th style="border:1px solid #000;padding:4px">Кол-во</th>
				 <th style="border:1px solid #000;padding:4px">Цена</th>
				 <th style="border:1px solid #000;padding:4px">Итого</th>
			  </tr>
			</thead>
			<tbody>${rows}</tbody>
		 </table>
 
		 ${order.shippingInfo?.courier !== "Самовывоз"
			? `<p>Стоимость доставки: <strong>${deliveryCost} $</strong></p>`
			: ''}
 
		 <p style="text-align:right;margin-top:24px;font-weight:bold;font-size:14px">
			Общая сумма: ${grandTotal} $
		 </p>
	  </div>
	`;
 };