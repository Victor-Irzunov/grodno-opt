"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Импортируем компонент динамически и отключаем SSR
const LoginRegistration = dynamic(() => import('../../components/Comp/LoginRegistration'), { ssr: false });

const Page = () => {
	return (
		<section className="min-h-screen py-32 relative">
			<Suspense fallback={<div>Загрузка...</div>}>
				<LoginRegistration />
			</Suspense>
		</section>
	);
};

export default Page;
