"use client"
import UserCart from "@/components/userCart/UserCart";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Cart() {
	const [data, setData] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const router = useRouter();


	useEffect(() => {
		if (!loaded && typeof window !== "undefined") {
			fetchProducts();
		}
	}, [loaded]);

	const fetchProducts = async () => {
		try {
			const cartData = JSON.parse(localStorage.getItem("parts")) || [];
			setData(cartData)

		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleContinueShopping = () => {
		router.back();
	};



	return (
		<main className="">
			<div className='pt-10 container mx-auto'>
				<button
					className="btn btn-xs btn-ghost font-light"
					onClick={handleContinueShopping}
				>
					<Image src='/svg/arrow-left.svg' alt='Стрелка возврата' width={18} height={18} />
					назад
				</button>
			</div>
			{
				data && data.length ?
					<div className='container mx-auto py-10'>
						<UserCart data={data} setData={setData} />
					</div>
					:
					<div className="min-h-screen pt-16">
						<div className="flex justify-center">
							<Image src='/images/empty.webp' alt='Пустая корзина' className="sd:w-1/3 xz:w-2/3" width={800} height={600} />
						</div>
						<div className="text-center mt-5">
							<h1 className="mb-5 text-3xl font-bold uppercase">Пусто</h1>
							<p className="mb-5 text-gray-600 text-sm">
								В вашей корзине нет товаров
							</p>
						</div>
					</div>
			}
		</main>
	);
}

