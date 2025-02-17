"use client"
import { useState } from "react";
import AddProductPrice from "../FormsAdmin/AddProductPrice"

const ProductAdmin = () => {
	const [data, setData] = useState([]);

	return (
		<div className="pt-10 px-12 text-white pb-24">
			<p className='text-3xl mb-16'>
				Добавить товар (прайс)
			</p>
			<AddProductPrice setData={setData} data={data} />
			<div className='mt-20'>

				{
					Array.isArray(data) && data.length ? (
						<table className="table-auto border-collapse border border-gray-600 text-xs">
							<thead>
								<tr>
									{data[0].map((header, index) => (
										<th key={index} className="border border-gray-500 p-2">
											{header}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data.slice(1).map((row, rowIndex) => (
									<tr key={rowIndex}>
										{row.map((cell, cellIndex) => (
											<td key={cellIndex} className="border border-gray-500 p-2">
												{cell}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					) :
						<div className={`${Object.keys(data).length ? 'hidden' : 'flex justify-center'}`}>
							<button className="btn bg-transparent border-none text-white">
								<span className="loading loading-spinner"></span>
								загрузка ...
							</button>
						</div>
				}

				{
					!Array.isArray(data) && Object.keys(data).length ?
						<div className='mt-16 text-sm text-white/65'>
							<p className=''>
								Загружено: {data?.success?.length === 0 ? '0' : data?.success}
							</p>
							<p className=''>
								Не загружено: {data?.missingProducts?.length === 0 ? '0' : data?.missingProducts}
							</p>
							<p className=''>
								Ошибка: {data?.errors?.length === 0 ? '0' : data?.errors}
							</p>
						</div>
						:
						null
				}

			</div>
		</div>
	)
}

export default ProductAdmin