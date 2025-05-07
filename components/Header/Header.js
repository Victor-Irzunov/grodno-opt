"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite'
import { MyContext } from "@/contexts/MyContextProvider";
import { usePathname } from 'next/navigation';
import { data } from "@/constans/Data";
import phoneNumbers from "@/config/config";
import { Affix } from "antd";
import BtnComp from "../btn/BtnComp";

const Header = observer(() => {
	const { dataApp, user, products } = useContext(MyContext);
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = useState(false);
	const [menuOpen2, setMenuOpen2] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [submenuOpen, setSubmenuOpen] = useState(null);
	const [submenuMobilOpen, setSubmenuMobilOpen] = useState(null);
	const [scrollPosition, setScrollPosition] = useState(0);
	// const [isActive, setIsActive] = useState(false);
	const searchInputRef = useRef(null);
	//   const [categories, setCategories] = useState([]);



	const categories = Array.from(new Map(products.map(item => [item.category.id, { id: item.category.id, title: item.category.title }])).values());


	const getBasePath = (pathname) => {
		const parts = pathname.split('/');
		return `/${parts[1]}/${parts[2]}/`;
	};

	const basePath = getBasePath(pathname);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
		setMenuOpen2(!menuOpen);
		setSubmenuMobilOpen(null)
		setSubmenuOpen(null);
		setSearchQuery('');
		if (searchOpen) {
			setSearchOpen(false);
		}
	};

	const toggleSearch = () => {
		setSearchOpen(!searchOpen);
		setMenuOpen(true);
		setSubmenuMobilOpen(null)
		if (menuOpen) {
			setMenuOpen(false);
		}
	};

	useEffect(() => {
		if (searchOpen) {
			searchInputRef.current.focus();
		}
	}, [searchOpen]);

	const handleMouseEnter = (menu) => {
		setSubmenuOpen(menu);
	};

	const handleMouseLeave = (e) => {
		if (e) {
			e.stopPropagation();
		}
		setSubmenuOpen(null);
		setSearchQuery('');
	};
	const handleClick = () => {
		setSubmenuOpen(null);
	};


	const handleClickMenuMobil = (menu) => {
		setSubmenuMobilOpen(menu)
	}
	const handleExitMenuMobil = () => {
		setSubmenuMobilOpen(null)
	}


	const handleScroll = () => {
		setScrollPosition(window.scrollY);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const searchProducts = (query) => {
		if (!query) return [];
		const lowerCaseQuery = query.toLowerCase();
		const filteredProducts = data.reduce((acc, item) => {
			const matchingProducts = item.products.filter((product) =>
				product.title.toLowerCase().includes(lowerCaseQuery) ||
				(product.titleRu && product.titleRu.toLowerCase().includes(lowerCaseQuery))
			);
			return [...acc, ...matchingProducts];
		}, []);
		return filteredProducts;
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const exitUser = () => {
		localStorage.removeItem('token_grodno', data.token)
		user.setIsAuth(false)
		user.setUserData({})
		user.setUser({})
	}

	const hangleCategoryId = (id) => {
		dataApp.setCatalogId(id)
	}


	const filteredProducts = searchProducts(searchQuery);

	return (
		<header className={`${pathname === '/super-admin' ? 'hidden' : 'block'}`}>
			<div className={`sd:py-1.5 xz:py-0.5 bg-blue-500 text-white`}
			>
				<div className='container mx-auto flex justify-between items-center'>

					<p className='sd:text-xs xz:text-[9px] font-light sd:tracking-widest xz:tracking-normal '>
						г. Гродно, пр-т Космонавтов 9, каб. 3
					</p>

					<div className='flex xz:justify-between sd:justify-end items-center space-x-3'>

						<a href={`tel:${phoneNumbers.mainPhoneLink}`} className={`sd:flex xz:hidden btn btn-xs sd:bg-white xz:bg-transparent sd:text-black xz:text-white border-none rounded-sm xz:text-[10px] sd:text-xs font-light`}>
							<Image src='/svg/phone-black.svg' alt='Телефон' width={18} height={18} />
							{phoneNumbers.mainPhone}
						</a>
					
						<div className={`${pathname === '/' ? 'sd:flex xz:hidden' : 'sd:hidden xz:hidden'}`}>
							<BtnComp title='Купить оптом' red index={358} />
						</div>

						{
							user.isAuth ?
								<div className="dropdown dropdown-end dropdown-hover">
									<div tabIndex={0} role="button" className="m-1">
										<div className='flex items-center cursor-pointer btn btn-xs bg-white border-none rounded-sm'>
											<Image src='/svg/user2.svg' alt='Кабинет пользователя' width={17} height={17} />
											<span className="font-light sd:text-xs xz:text-[10px] uppercase">
												Мой кабинет
											</span>
										</div>
									</div>
									<ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-sm text-black z-[1] w-52 p-2 shadow">
										<li>
											{
												user?.userData?.isAdmin ?
													<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/super-admin/`}>
														Админка
													</Link>
													:
													<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/moj-kabinet/`}>
														Мой кабинет
													</Link>
											}

										</li>
										<li>
											<div
												className='flex items-center'
												onClick={exitUser}
											>
												<Image src='/svg/exit.svg' alt='Выйти' width={15} height={15} />
												<p className=''>
													Выйти
												</p>
											</div>
										</li>
									</ul>
								</div>
								:
								<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/login/`} className={``}>
									<div className='flex items-center cursor-pointer btn btn-xs bg-white border-none rounded-sm'>
										<Image src='/svg/user-login.svg' alt='Войти' width={17} height={17} />
										<span className="font-light text-xs uppercase">
											Войти
										</span>
									</div>
								</Link>
						}
					</div>
				</div>
			</div>

			<div className={`h-screen w-full absolute top-20 left-0 ${submenuOpen ? 'block backdrop-blur-xl bg-gradient-to-b from-white/85 to-white/0' : 'hidden'}`} />

			{/* desktop */}
			<Affix offsetTop={0} className="">
				<nav
					className={`py-1 sd:block xz:hidden cursor-pointer relative bg-white`}
				>
					<div className='container mx-auto'>
						<ul className='flex justify-between items-center w-full text-xs'>
							<li className="">
								<div className=''>
									<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/`} className="">
										<Image
											src={`/logo/logo.webp`}
											alt='Логотип - оптовая продажа запасных частей'
											width={150} height={150}
										/>
									</Link>
								</div>
							</li>
							<li
								className=''
								onMouseEnter={() => handleMouseEnter('katalog')}
							>
								<Link
									href={`${process.env.NEXT_PUBLIC_BASE_URL}/catalog`}
									onClick={handleClick}
									className={`text-black`}
								>
									<div className='flex items-center space-x-2'>
										<Image src='/svg/catalog.svg' alt='Каталог' width={19} height={19} />
										<span className="">
											Каталог
										</span>
									</div>
								</Link>
								<div
									className={`submenu ${submenuOpen === 'katalog' ? 'open' : ''} z-50`}
									onMouseLeave={handleMouseLeave}
								>
									<div className='container mx-auto px-10 py-16'>
										<p className='font-light text-xs mb-3 text-gray-500'>
											Каталог
										</p>
										<ul className="text-gray-700 grid grid-cols-3">
											{
												categories && categories.length ?
													categories.map(el => {
														return (
															<li
																key={el.id}
																className="mb-2 cursor-pointer hover:text-primary"
																onClick={() => {
																	hangleCategoryId(el.id)
																}}
															>
																<Link href='/catalog' className="cursor-pointer text-sm">
																	{el.title}
																</Link>
															</li>
														)
													})
													:
													<p className=''>
														Загрузка категории....
													</p>
											}

										</ul>
									</div>
								</div>
							</li>
							<li
								className=''
							>
								<Link
									href={`${process.env.NEXT_PUBLIC_BASE_URL}/oplata/`}
									className={`text-black`}
								>
									Оплата
								</Link>
							</li>
							<li
								className={`text-black`}
							>
								<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/dostavka/`}>
									Доставка
								</Link>
							</li>
							<li
								className={`text-black`}
							>
								<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/garantiya/`}>
									Гарантия
								</Link>
							</li>
							<li
								className={`text-black`}
							>
								<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/garantiya/`}>
									Оптовикам
								</Link>
							</li>
							<li
								className={`text-black`}
							>
								<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/kontakty/`}>
									Контакты
								</Link>
							</li>

							<li
								className=''
								onClick={() => handleMouseEnter('search')}
							>
								{/* <Image
									src={`/svg/search.svg`}
									onClick={toggleSearch}
									className="cursor-pointer"
									alt='Поиск товара по сайту'
									width={20} height={20}
								/> */}

								{/* desktop search */}
								{submenuOpen === 'search' && (
									<div
										className='absolute top-10 
									right-0 left-0 w-full h-auto pt-28 pb-20 bg-white
									flex justify-center items-center z-50'
									// onMouseLeave={handleMouseLeave}
									>
										<button
											className="btn btn-lg btn-circle btn-ghost absolute right-40 top-5 z-50"
											onClick={handleMouseLeave}
										>
											✕
										</button>

										<div className='container mx-auto'>
											<label className="input input-bordered flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 16 16"
													fill="currentColor"
													className="h-4 w-4 opacity-70">
													<path
														fillRule="evenodd"
														d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
														clipRule="evenodd" />
												</svg>
												<input type="text"
													className="grow"
													placeholder="Поиск ..."
													ref={searchInputRef}
													value={searchQuery}
													onChange={handleSearchChange}
												/>
											</label>
											{/* Display search results */}
											{filteredProducts.length > 0 ? (
												<div className='search-results mt-10 overflow-y-scroll max-h-[50vh]'>
													<ul>
														{filteredProducts.map((product, idx) => {
															if (product.type !== 'all') {
																return (
																	<li key={product.id} className="flex mb-5 text-lg space-x-5 items-center">
																		<Image
																			src={product.img}
																			alt={product.title}
																			width={50}
																			height={50}
																		/>
																		<Link
																			href={`${process.env.NEXT_PUBLIC_BASE_URL}${product.link}/${product.type}/${product.memory ? product.memory.toLowerCase() : ''}`}
																			className="underline"
																			onClick={handleMouseLeave}
																		>
																			{product.title}
																		</Link>
																	</li>
																)
															}
														})}
													</ul>
													<div className="text-center mt-5 text-sm text-gray-400">
														больше результатов нет
													</div>
												</div>
											)
												:
												<div className='mt-14'>
													{
														searchQuery ?
															<p className='ext-center mt-5 text-sm text-gray-400'>
																Ничего нет
															</p>
															:
															null
													}

												</div>
											}
										</div>
									</div>
								)}
							</li>
							<li
								className=''
								onMouseLeave={handleMouseLeave}
							>
								<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/korzina`}>
									<div className="indicator">
										{
											dataApp.dataKorzina.length ?
												<span className="indicator-item w-4 h-4 flex justify-center items-center text-[8px] bg-secondary text-white rounded-full">
													{dataApp.dataKorzina.length}
												</span>
												:
												null
										}
										<Image
											src={`/svg/cart.svg`}
											onClick={toggleSearch}
											className="cursor-pointer"
											alt='Корзина'
											width={23} height={23} />
									</div>
								</Link>
							</li>
						</ul>
					</div>
				</nav>
			</Affix>

			{/* mobile */}
			<Affix offsetTop={0} className="">
				<nav className={`sd:py-3.5 xz:py-0 relative xz:block sd:hidden bg-white shadow-xl`}
				>
					<div className='container mx-auto flex justify-between items-center'>
						<div className=''>
							<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/`}>
								<Image
									src={`/logo/logo.webp`}
									alt='Логотип магазина техники Apple - яблоки бай (yabloki.by)'
									className="sd:w-[150px] xz:w-[100px] z-50"
									width={150} height={150}
								/>
							</Link>
						</div>

						<div className='flex items-center'>
							<div className='mr-5'>
								<Image
									src={`/svg/search.svg`}
									alt='Поиск товара по сайту'
									width={19} height={19}
									onClick={toggleSearch}
									className="cursor-pointer"
								/>
							</div>
							<div className='mr-5'>
								<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/korzina`}>
									<div className="indicator">
										{
											dataApp.dataKorzina.length ?
												<span className="indicator-item w-4 h-4 flex justify-center items-center text-[8px] bg-secondary text-white rounded-full">
													{dataApp.dataKorzina.length}
												</span>
												:
												null
										}
										<Image
											src={`/svg/cart.svg`}
											className="cursor-pointer pt-0.5"
											alt='Корзина'
											width={22} height={22}
										/>
									</div>
								</Link>
							</div>

							<div className='flex items-center'>
								<p className='font-light text-sm mr-1 uppercase'>
									Меню
								</p>
								<div
									className={`menu-icon ${menuOpen ? 'active' : ''} z-50`}
									onClick={() => {
										toggleMenu()
										handleMouseLeave()
									}}
								>
									<div>
										<span></span>
										<span></span>
									</div>
								</div>
							</div>


						</div>
					</div>

					{/* Search mobile panel */}
					<div className={`search-panel ${searchOpen ? 'open pt-20' : ''} z-50`}>
						<div className='container mx-auto'>
							<label className="input input-bordered flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									className="h-4 w-4 opacity-70">
									<path
										fillRule="evenodd"
										d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
										clipRule="evenodd" />
								</svg>
								<input type="text"
									className="grow" placeholder="Поиск ..."
									ref={searchInputRef}
									value={searchQuery}
									onChange={handleSearchChange}
								/>
							</label>
							{/* Display mobil results */}
							{filteredProducts.length > 0 ? (
								<div className='search-results mt-10 overflow-y-scroll max-h-[70vh]'>
									<ul>
										{filteredProducts.map((product, idx) => {
											if (product.type !== 'all') {
												return (
													<li key={product.id} className="flex mb-5 text-sm space-x-5 items-center">
														<Image
															src={product.img}
															alt={product.title}
															width={40}
															height={40}
														/>
														<Link
															href={`${process.env.NEXT_PUBLIC_BASE_URL}${product.link}/${product.type}/${product.memory ? product.memory.toLowerCase() : ''}`}
															className="underline"
															onClick={toggleMenu}
														>
															{product.title}
														</Link>
													</li>
												)
											}
										})}
									</ul>
									<div className="text-center mt-5 text-sm text-gray-400">
										больше результатов нет
									</div>
								</div>
							)
								:
								<div className='mt-14'>
									{
										searchQuery ?
											<p className='ext-center mt-5 text-sm text-gray-400'>
												Ничего нет
											</p>
											:
											null
									}
								</div>
							}
						</div>
					</div>


					{/* Mobile menu */}

					<div className={`mobile-menu ${menuOpen2 ? 'open' : ''} z-40`}>
						<div className='container mx-auto px-7 pt-16 h-[90vh] relative'>
							<ul className={`text-xl font-semibold ${submenuMobilOpen ? 'hidden' : ''}`}>
								{
									categories && categories.length ?
										categories.map(el => {
											return (
												<li
													key={el.id}
													className="mb-2 cursor-pointer hover:text-primary"
													onClick={() => {
														hangleCategoryId(el.id)
													}}

												>
													<Link
														onClick={toggleMenu}
														href='/catalog'
														className="cursor-pointer text-sm"
													>
														{el.title}
													</Link>
												</li>
											)
										})
										:
										<p className=''>
											Загрузка категории....
										</p>
								}

							</ul>
							

							<div className='absolute bottom-7 right-4 text-right'>
								<p className='mb-1 text-xs text-gray-400 font-light'>
									Есть вопросы?
								</p>
								<p className='uppercase text-gray-600 text-[9px] mb-1'>
									Телефон магазина
								</p>
								<div className='text-sm'>
									<a href={`tel:${phoneNumbers.mainPhoneLink}`} className={`xz:text-[10px] sd:text-xs font-light flex`}>
										<Image src='/svg/phone-black.svg' alt='Телефон' width={18} height={18} className="mr-1" />
										{phoneNumbers.mainPhone}
									</a>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</Affix>
		</header>
	);
})




export default Header;
