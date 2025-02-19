"use client";
import AddCategoryAdmin from "@/components/CompAdmin/AddCategoryAdmin";
import AddGroupAdmin from "@/components/CompAdmin/AddGroupAdmin";
import AddOneProductAdmin from "@/components/CompAdmin/AddOneProductAdmin";
import EditDiscountGroupAdmin from "@/components/CompAdmin/EditDiscountGroupAdmin";
import MainAdmin from "@/components/CompAdmin/MainAdmin";
import ProductAdmin from "@/components/CompAdmin/ProductAdmin";
import UpdateOneProductAdmin from "@/components/CompAdmin/UpdateOneProductAdmin";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Page() {
	const [activeComponent, setActiveComponent] = useState("main");

	const renderActiveComponent = () => {
		switch (activeComponent) {
			case "main":
				return <MainAdmin />;
			case "addCategory":
				return <AddCategoryAdmin />;
			case "addGroup":
				return <AddGroupAdmin />;
			case "AddProductPrice":
				return <ProductAdmin />;
			case "AddOneProductAdmin":
				return <AddOneProductAdmin />;
			case "UpdateOneProductAdmin":
				return <UpdateOneProductAdmin />;
			case "EditDiscountGroupAdmin":
				return <EditDiscountGroupAdmin />;
			default:
				return <MainAdmin />;
		}
	};

	return (
		<main>
			<section className="flex justify-between min-h-screen">

				<aside className="w-1/5 bg-[#202020] border-r border-[#2B2B2B] pt-6 px-8">
					<div>
						<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/`} className="">
							<Image src="/logo/logo-blue.webp" alt="Логотип" width={150} height={150} />
						</Link>
					</div>

					<ul className="text-[#C1C1C1] font-light space-y-3 text-sm mt-10 cursor-pointer">
						<li
							onClick={() => setActiveComponent("main")}
							className={`flex space-x-3 items-center hover:bg-[#191919] py-2 px-3 rounded-md
								 ${activeComponent === "main" ? "border border-primary rounded-md py-2 px-2.5 text-primary bg-[#317bff1a]" : ""}
								 `}
						>
							<Image src="/svg/main.svg" alt="Главная" width={20} height={20} />
							<p>Главная</p>
						</li>
						<li className="hover:bg-[#191919] py-1 px-1 rounded-md">
							<div className="collapse">
								<input type="checkbox" />

								<div className="collapse-title flex space-x-2.5 items-center">
									<Image src="/svg/product.svg" alt="Товар" width={20} height={20} />
									<p>Товар</p>
								</div>

								<div className="collapse-content pl-10 text-sm">
									<div
										onClick={() => setActiveComponent("addCategory")}
										className={`pl-0.5 ${activeComponent === "addCategory" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}
									>
										• <span>Добавить категорию</span>
									</div>

									<div>
										<Image src="/svg/vertical-line.svg" alt="Вертикальная линия меню" width={10} height={60} />
									</div>

									<div
										onClick={() => setActiveComponent("addGroup")}
										className={`pl-0.5 ${activeComponent === "addGroup" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}
									>
										• <span>Добавить группу</span>
									</div>

									<div>
										<Image src="/svg/vertical-line.svg" alt="Вертикальная линия меню" width={10} height={60} />
									</div>

									<div
										onClick={() => setActiveComponent("AddProductPrice")}
										className={`pl-0.5 ${activeComponent === "AddProductPrice" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}
									>
										• <span>Загрузить прайс</span>
									</div>

									<div>
										<Image src="/svg/vertical-line.svg" alt="Вертикальная линия меню" width={10} height={60} />
									</div>

									<div
										onClick={() => setActiveComponent("AddOneProductAdmin")}
										className={`pl-0.5 ${activeComponent === "AddOneProductAdmin" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}
									>
										• <span>Добавить товар</span>
									</div>

									<div>
										<Image src="/svg/vertical-line.svg" alt="Вертикальная линия меню" width={10} height={60} />
									</div>

									<div
										onClick={() => setActiveComponent("UpdateOneProductAdmin")}
										className={`pl-0.5 ${activeComponent === "UpdateOneProductAdmin" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}
									>
										• <span>Редактировать товар</span>
									</div>

									<div>
										<Image src="/svg/vertical-line.svg" alt="Вертикальная линия меню" width={10} height={60} />
									</div>

									<div
										onClick={() => setActiveComponent("EditDiscountGroupAdmin")}
										className={`pl-0.5 ${activeComponent === "EditDiscountGroupAdmin" ? "border border-primary rounded-md text-primary bg-[#317bff1a]" : ""}`}
									>
										• <span>Скидка группы</span>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</aside>

				<div className="w-4/5 bg-[#191919] pt-6">
					{renderActiveComponent()}
				</div>
			</section>
		</main>
	);
}

export default Page;
