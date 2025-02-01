"use client";

import { useState } from "react";
import { useSearchParams } from 'next/navigation';
import LoginForm from "@/components/Form/FormLogin";
import RegistrationForm from "@/components/Form/RegistrationForm";

export default function LoginRegistration() {
	const [isActive, setIsActive] = useState(true);
	const searchParams = useSearchParams();
	const search = searchParams.get('from');

	return (
		<div className='container mx-auto'>
			{isActive ? (
				<div>
					<h1 className='text-2xl'>Войти</h1>
					<LoginForm setIsActive={setIsActive} search={search} />
				</div>
			) : (
				<div>
					<h1 className='text-2xl'>Зарегистрироваться</h1>
					<RegistrationForm setIsActive={setIsActive} search={search} />
				</div>
			)}
		</div>
	);
}
