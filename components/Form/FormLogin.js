"use client"
import { MyContext } from '@/contexts/MyContextProvider';
import { login, dataUser } from '@/http/userAPI';
import { message } from 'antd';
import { useRouter } from "next/navigation";
import { useContext, useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';


const LoginForm = ({ setIsActive, search }) => {
	const { user } = useContext(MyContext);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	const handleTogglePassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const tokenData = await login(formData);

		if (tokenData?.error) {
			message.error(tokenData.error)
			return;
		}

		const userDataFull = await dataUser(); // ВАЖНО: обновляем mobx данными
		user.setIsAuth(true);
		user.setUserData(userDataFull);

		message.success('Вы авторизованы!');
		setFormData({ email: '', password: '' });

		setTimeout(() => {
			if (tokenData.isAdmin) {
				router.push('/super-admin');
			} else {
				router.push('/moj-kabinet');
			}
		}, 500);
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="form-control mt-3 relative">
					<label className="label">
						<span className="label-text">Логин (почта)</span>
						<span className="label-text-alt">Обязательное поле</span>
					</label>
					<input
						type="text"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="input input-bordered"
						placeholder="Введите ваш логин (почту)"
						required
					/>
				</div>
				<div className="form-control mt-3 relative">
					<label className="label">
						<span className="label-text">Пароль</span>
						<span className="label-text-alt">Обязательное поле</span>
					</label>
					<div className="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="input input-bordered pr-10 w-full"
							placeholder="Введите пароль"
							required
						/>
						<button
							type="button"
							onClick={handleTogglePassword}
							className="absolute inset-y-0 right-0 pr-3 flex items-center"
						>
							{showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
						</button>
					</div>
				</div>
				<div className="form-control mt-6">
					<button type="submit" className="btn btn-primary">
						Войти
					</button>
				</div>
			</form>
			{
				user.userData?.isAdmin ?
					<div className='mt-5'>
						У вас нет аккаунта? <button
							className="btn btn-link"
							onClick={() => setIsActive(false)}
						>
							Зарегистрироваться
						</button>
					</div>
					:
					null
			}


		</>
	);
};
export default LoginForm;
