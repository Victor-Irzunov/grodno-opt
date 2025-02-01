"use client"
import { GetGoogle } from '@/http/adminAPI';
import React, { useEffect, useState } from 'react'

const page = () => {
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await GetGoogle();
				console.log("🚀 🚀 🚀  _ fetchData _ response:", response)
				setData(response.data);
			} catch (err) {
				console.error("🚀 🚀 🚀  _ fetchData _ err:", err);
				setError(err.message || 'Failed to fetch data');
			}
		}
		fetchData();
	}, []);
	return (
		<div className='pt-20'>
			<div className='container mx-auto'>
				{error && <div className="text-red-500">Error: {error}</div>}

				{data.length > 0 ? (
					<table className="table-auto border-collapse border border-gray-400">
						<thead>
							<tr>
								{data[0].map((header, index) => (
									<th key={index} className="border border-gray-300 p-2">
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.slice(1).map((row, rowIndex) => (
								<tr key={rowIndex}>
									{row.map((cell, cellIndex) => (
										<td key={cellIndex} className="border border-gray-300 p-2">
											{cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div>Loading...</div>
				)}
			</div>
		</div>
	)
}

export default page