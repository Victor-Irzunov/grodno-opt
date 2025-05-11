"use client"

import { useState } from "react";
import Modal from "../modal/Modal";

const BtnComp = ({ title, index, center, red, name, wFull }) => {
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const handleOrderClick = (product) => {
		setSelectedProduct(product);
		document.getElementById(`my_modal_${index}`).showModal(); // Используем уникальный ID
	};

	const closeModal = () => {
		document.getElementById(`my_modal_${index}`).close();
	};

	return (
		<div className={`flex items-center ${center ? 'justify-center' : ''} ${wFull ? 'xz:w-full sd:w-auto': ''}`}>
			<button
				className={`${wFull ? 'w-full': ''} rounded-none text-white ${red ? 'btn-xs bg-green-500 border-none rounded-sm text-white xz:text-[10px] sd:text-xs': 'bg-gradient-to-r from-sky-500 to-indigo-500'} btn border-none  font-semibold`}
				onClick={() => handleOrderClick(name ? name : title)}
			>
				{title}
			</button>

			<Modal
				selectedProduct={selectedProduct}
				closeModal={closeModal}
				isFormSubmitted={isFormSubmitted}
				setIsFormSubmitted={setIsFormSubmitted}
				index={index}
			/>
		</div>
	)
}


export default BtnComp;
