"use client"
import IstoriyaZakazov from '@/components/ComponentsMojKabinet/IstoriyaZakazov';
import LichnyeDannye from '@/components/ComponentsMojKabinet/LichnyeDannye';
import LichnyjSchet from '@/components/ComponentsMojKabinet/LichnyjSchet';
import MojKabinet from '@/components/ComponentsMojKabinet/MojKabinet';
import TekushchieZakazy from '@/components/ComponentsMojKabinet/TekushchieZakazy';
import { Search } from '@/components/search/Search';
import { data } from '@/constans/Data';
import { MyContext } from '@/contexts/MyContextProvider';
import { observer } from 'mobx-react-lite';
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

const page = observer(() => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState(null);
	const { user, dataApp, handleCurrencyChange } = useContext(MyContext);
	const [activeTitle, setActiveTitle] = useState('Мой кабинет')
	const [activeComponent, setActiveComponent] = useState(<MojKabinet />);
	const router = useRouter();

	useEffect(() => {
		setActiveComponent(<MojKabinet setActiveComponent={setActiveComponent} />);
	}, [])


	const asideMenu = [
		{
			id: 1,
			title: 'Мой кабинет',
			render: () => <MojKabinet setActiveComponent={setActiveComponent} />,
		},
		{
			id: 2,
			title: 'Текущие заказы',
			render: () => <TekushchieZakazy setActiveComponent={setActiveComponent} />,
		},
		{
			id: 3,
			title: 'Личный счёт',
			render: () => <LichnyjSchet setActiveComponent={setActiveComponent} />,
		},
		{
			id: 4,
			title: 'Личные данные',
			render: () => <LichnyeDannye setActiveComponent={setActiveComponent} />,
		},
		{
			id: 5,
			title: 'История заказов',
			render: () => <IstoriyaZakazov setActiveComponent={setActiveComponent} />,
		},
		{
			id: 8,
			title: 'Выйти',
			exit: true,
		},
	];



	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);

		if (query.length > 0) {
			router.push(`/catalog?search=${query}`);
		}
	};

	const exitUser = () => {
		localStorage.removeItem('token_grodno', data.token)
		user.setIsAuth(false)
		user.setUserData({})
		user.setUser({})
	}

	return (
		<main className='pt-20'>
			<section className='border-b pb-10'>
				<div className='container mx-auto'>
					<div className='flex sd:flex-row xz:flex-col justify-between sd:items-center xz:items-start sd:space-x-6 xz:space-x-0'>

						<div className='flex space-x-2 items-center mr-5 sd:mb-0 xz:mb-6'>
							<Image src='/svg/user2.svg' alt='Кабинет пользователя' width={20} height={20} />
							<h1 className="font-semibold text-lg">
								Кабинет
							</h1>
						</div>

						<Search
							searchQuery={searchQuery}
							handleSearchChange={handleSearchChange}
							handleCurrencyChange={handleCurrencyChange}
							dataApp={dataApp}
						/>

					</div>
				</div>
			</section>

			<section className='pt-2'>
				<div className='container mx-auto'>
					<div className='flex sd:flex-row xz:flex-col justify-between sd:items-start xz:items-center sd:space-x-5 xz:space-x-0'>

						<aside className='sd:block xz:hidden w-1/5'>
							<ul className='border text-sm text-gray-800'>
								{asideMenu.map((el, idx) => {
									return (
										<li
											onClick={() => {
												if (el.exit) {
													exitUser();
												} else {
													setActiveComponent(el.render());
													setActiveTitle(el.title);
												}
											}}
											key={el.id}
											className={`p-2 ${idx === asideMenu.length - 1 ? '' : 'border-b'} hover:bg-slate-50 hover-transition cursor-pointer`}>
											<h3>{el.title}</h3>
										</li>
									);
								})}
							</ul>
						</aside>

						<div className='sd:hidden xz:flex justify-between w-full items-center mb-8'>
							<div className=''>
								<h4 className='text-xl font-semibold'>
									{activeTitle}
								</h4>
							</div>

							<div className="dropdown dropdown-end">
								<div tabIndex={0} role="button" className="btn">
									<Image src='/svg/menu.svg' alt='Меню кабинета' width={40} height={40} />
								</div>
								<ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
									{asideMenu.map((el, idx) => {
										return (
											<li
												onClick={() => {
													if (el.exit) {
														exitUser();
													} else {
														setActiveComponent(el.render());
														setActiveTitle(el.title)
													}
												}}
												key={el.id}
												className={`p-2 ${idx === asideMenu.length - 1 ? '' : 'border-b'} hover:bg-slate-50 hover-transition cursor-pointer`}>
												<h3 className=''>
													{el.title}
												</h3>
											</li>
										);
									})}
								</ul>
							</div>
						</div>

						<div className='sd:w-4/5 xz:w-full'>
							{activeComponent}
						</div>

					</div>
				</div>
			</section>
		</main>
	)
});

export default page;