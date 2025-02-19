"use client"
import { useContext, useEffect, useRef, useState } from 'react'
import { AsideMenu } from '../AsideMenu/AsideMenu'
import GalleryComponent from '../GalleryComponent/GalleryComponent'
import { Search } from '../search/Search'
import { MyContext } from '@/contexts/MyContextProvider'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import Image from 'next/image'
import { RiAddFill, RiSubtractFill } from "react-icons/ri";
import { message, Tabs } from 'antd'
import { tabsContent } from '@/constans/Tabs'
import phoneNumbers from '@/config/config'
import { transliterate } from "@/transliterate/transliterate";

const OneProductPage = observer(({ categories, data, dataAllProduct }) => {
	const { user, dataApp, handleCurrencyChange, updateIsState } = useContext(MyContext);

	const inputRef = useRef(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState(null);
	const [filteredData, setFilteredData] = useState(dataAllProduct || []);
	const [quantities, setQuantities] = useState({});

	useEffect(() => {
		if (searchQuery) {
			if (Array.isArray(filteredData)) {
				setSearchResults(filteredData.filter(item =>
					item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.article.toLowerCase().includes(searchQuery.toLowerCase())
				));
			} else {
				setSearchResults([]);
			}
		} else {
			setSearchResults(null);
		}
	}, [searchQuery, filteredData]);


	const handleAddToCart = (item) => {
		const cart = JSON.parse(localStorage.getItem("parts")) || [];
		const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
		if (existingItemIndex !== -1) {
			cart[existingItemIndex].quantity += quantities[item.id] || 1;
		} else {
			cart.push({ ...item, quantity: quantities[item.id] || 1 });
		}
		localStorage.setItem("parts", JSON.stringify(cart));
		updateIsState()
		message.success("Товар добавлен в корзину");
	};

	const convertPrice = (price) => {
		if (dataApp.currency === 'BYN') {
			return (price * dataApp.OfficialRate).toFixed(2);
		}
		return price;
	};

	const linkTransliterate = (title) => {
		return transliterate(title)
			.replace(/[^a-zA-Z0-9\s\(\)-]/g, "")
			.trim()
			.replace(/\s+/g, "-")
			.replace(/\(\s*(.*?)\s*\)/g, "-$1")
			.replace(/-+/g, "-")
			.replace(/\s?-\s?/g, "-")
			.toLowerCase();
	};


	return (
		<section className='rdataative'>
			<div className='container mx-auto'>
				<Search
					inputRef={inputRef}
					searchQuery={searchQuery}
					handleSearchChange={(e) => setSearchQuery(e.target.value)}
					handleCurrencyChange={handleCurrencyChange}
					dataApp={dataApp}
				/>
				<div className='grid sd:grid-cols-5 xz:grid-cols-1 gap-4 rdataative mt-16'>
					<AsideMenu data={categories} />

					<div className='sd:col-span-4 xz:col-span-1 border'>
						{
							searchQuery ?
								<ul className='text-sm font-light'>
									{searchResults && searchResults.length
										?
										searchResults.map(el => (
											<li key={el.id} className='p-2 border mb-1 hover:bg-sky-50 hover:translate-x-0.5 hover:shadow-lg hover-transition'>
												<div className='flex justify-between sd:flex-row xz:flex-col'>
													<div className=''>
														<Link href={`/catalog/${linkTransliterate(el.category.title)}/${linkTransliterate(el.title)}/${linkTransliterate(el.article)}/`}>
															<h3>{el.title} ({el.article})</h3>
														</Link>
														<div className='flex items-center text-green-500 mt-1'>
															<div className="w-1 h-1 rounded-full bg-green-500" />
															<p className='ml-1 text-xs'>
																В наличии
															</p>
															{typeof el.images === "string" && el.images !== "[]" && el.images !== "[]".toString() ? (
																<div className='ml-6 cursor-pointer' onClick={() => handleImageClick(el.images)}>
																	<Image src='/svg/images.svg' alt='Изображение' width={20} height={20} />
																</div>
															) : null}
														</div>
													</div>
													{
														user?.isAuth ?
															<div className='flex items-center justify-end space-x-3 sd:w-5/12 xz:w-full'>
																<p className='font-semibold text-base mr-2'>
																	{dataApp.currency === 'USD' ? `$${el.price}` : `${convertPrice(el.price)} BYN`}
																</p>
																<div className="join rounded-sm">
																	<button
																		className="join-item btn btn-sm px-2 border border-gray-300"
																		onClick={() => handleQuantityChange(el.id, -1)}
																	>
																		<RiSubtractFill fontSize={20} />
																	</button>
																	<button
																		className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300"
																	>
																		{quantities[el.id] || 1}
																	</button>
																	<button
																		className="join-item btn btn-sm px-2 border border-gray-300"
																		onClick={() => handleQuantityChange(el.id, 1)}
																	>
																		<RiAddFill fontSize={20} />
																	</button>
																</div>

																{
																	dataApp.dataKorzina.some(item => item.id === el.id)
																		?

																		<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/korzina`}>
																			<button
																				className="btn btn-success btn-sm rounded-sm font-light text-white"
																			>
																				В корзине
																			</button>
																		</Link>
																		:
																		<button
																			className="btn btn-primary btn-sm rounded-sm font-light text-white"
																			onClick={() => handleAddToCart(el)}
																		>
																			В корзину
																		</button>
																}
															</div>
															:
															null
													}
												</div>
											</li>
										))
										:
										<div className='text-center text-gray-300 text-xl pt-7'>
											<p className='font-bold'>
												ничего не найдено
											</p>
											<p className='text-sm mt-4'>
												Если вы не нашли то, что искали, позвоните нам — мы обязательно вам поможем!
											</p>
											<a href={`tel:${phoneNumbers.mainPhoneLink}`} className={`font-semibold text-base`}>
												{phoneNumbers.mainPhone}
											</a>
										</div>
									}
								</ul>
								:
								<div className='grid sd:grid-cols-3 xz:grid-cols-1 gap-4'>
									<div className='sd:col-span-2 xz:col-span-1 bg-white/85 rounded-3xl sd:py-8 xz:py-5 sd:px-10 xz:px-2'>
										<h1 className='sd:text-2xl xz:text-lg xy:text-xl font-semibold px-2'>
											{data.title} ({data.article})
										</h1>
										<p className='pl-2 text-gray-400 text-xs uppercase mt-2'>
											id: {data.id}
										</p>
										<GalleryComponent images={typeof data.images === 'string' ? JSON.parse(data.images) : []} title={data.title} />
										<article className='sd:hidden xz:block bg-slate-50 sd:py-8 xz:py-5 sd:px-6 xz:px-2'>
											<div className=''>
												<div className='mb-4'>
													<h2 className='text-[10px] text-gray-700'>
														Артикул: <span className='font-semibold'>{data.article}</span>
													</h2>
												</div>
												<div className=''>
													{
														user?.isAuth ?
															<p className='text-4xl font-semibold text-gray-800'>
																{dataApp.currency === 'USD' ? `$${data.price} ` : `${convertPrice(data.price)} BYN`}
															</p>
															:
															<Link href='/login' className='flex underline text-sm text-gray-700'>
																Узнать цену <Image src='/svg/arrow-right.svg' className='-rotate-45 ml-2' alt='Переход для регистрации' width={15} height={15} />
															</Link>
													}

													<div className={`flex items-center ${data.status === 'В наличии' ? 'text-green-500' : 'text-orange-500'} mt-3`}>
														<div className={`w-1 h-1 rounded-full ${data.status === 'В наличии' ? 'bg-green-500' : 'bg-orange-500'} bg-green-500`} />
														<p className='ml-1 text-xs'>
															{data.status}
														</p>
													</div>

													<div className='flex space-x-2 mt-8'>
														<div className="join rounded-sm">
															<button
																className="join-item btn btn-sm px-2 border border-gray-300"
																onClick={() => handleQuantityChange(data.id, -1)}
															>
																<RiSubtractFill fontSize={20} />
															</button>
															<button
																className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300"
															>
																{quantities[data.id] || 1}
															</button>
															<button
																className="join-item btn btn-sm px-2 border border-gray-300"
																onClick={() => handleQuantityChange(data.id, 1)}
															>
																<RiAddFill fontSize={20} />
															</button>
														</div>

														{
															dataApp.dataKorzina.some(item => item.id === data.id)
																?

																<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/korzina`}>
																	<button
																		className="btn btn-success btn-sm rounded-sm font-light text-white"
																	>
																		В корзине
																	</button>
																</Link>
																:
																<button
																	className="btn btn-primary btn-sm rounded-sm font-light text-white"
																	onClick={() => handleAddToCart(data)}
																>
																	В корзину
																</button>
														}
													</div>

													<div className='mt-8'>
														<div className='flex space-x-1'>
															<Image src='/svg/delivery.svg' alt='Доставка' width={20} height={20} />
															<p className='border-b-2 border-dotted text-sm text-gray-600'>
																Рассчитать доставку
															</p>
														</div>
														<div className='mt-3 text-sm text-gray-600'>
															<div className='flex space-x-1'>
																<Image src='/svg/info.svg' alt='Доставка' width={20} height={20} />
																<p className=''>
																	Самовывоз сегодня - Гродно
																</p>
															</div>
															<p className='pl-6'>
																Доставка на завтра
															</p>
														</div>
														<p className='text-xs font-light text-gray-500 mt-5'>
															Цена действительна только для партнеров
														</p>
													</div>

												</div>
											</div>
										</article>

										<article className='sd:mt-16 xz:mt-7 w-full'>
											<Tabs
												type="card"
												items={tabsContent}
											/>
										</article>
									</div>

									<article className='sd:block xz:hidden bg-slate-50 sd:py-8 xz:py-5 sd:px-6 xz:px-2'>
										<div className=''>
											<div className='mb-4'>
												<h2 className='text-xs text-gray-700'>
													Артикул: <span className='font-semibold'>{data.article}</span>
												</h2>
											</div>
											<div className='sd:block xz:hidden'>
												{
													user?.isAuth ?
														<p className='text-4xl font-semibold text-gray-800'>
															{dataApp.currency === 'USD' ? `$${data.price} ` : `${convertPrice(data.price)} BYN`}
														</p>
														:
														<Link href='/login' className='flex underline text-sm text-gray-700'>
															Узнать цену <Image src='/svg/arrow-right.svg' className='-rotate-45 ml-2' alt='Переход для регистрации' width={15} height={15} />
														</Link>
												}

												<div className={`flex items-center ${data.status === 'В наличии' ? 'text-green-500' : 'text-orange-500'} mt-3`}>
													<div className={`w-1 h-1 rounded-full ${data.status === 'В наличии' ? 'bg-green-500' : 'bg-orange-500'} bg-green-500`} />
													<p className='ml-1 text-xs'>
														{data.status}
													</p>
												</div>

												<div className='flex space-x-2 mt-8'>
													<div className="join rounded-sm">
														<button
															className="join-item btn btn-sm px-2 border border-gray-300"
															onClick={() => handleQuantityChange(data.id, -1)}
														>
															<RiSubtractFill fontSize={20} />
														</button>
														<button
															className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300"
														>
															{quantities[data.id] || 1}
														</button>
														<button
															className="join-item btn btn-sm px-2 border border-gray-300"
															onClick={() => handleQuantityChange(data.id, 1)}
														>
															<RiAddFill fontSize={20} />
														</button>
													</div>

													{
														dataApp.dataKorzina.some(item => item.id === data.id)
															?

															<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/korzina`}>
																<button
																	className="btn btn-success btn-sm rounded-sm font-light text-white"
																>
																	В корзине
																</button>
															</Link>
															:
															<button
																className="btn btn-primary btn-sm rounded-sm font-light text-white"
																onClick={() => handleAddToCart(data)}
															>
																В корзину
															</button>
													}
												</div>

												<div className='mt-8'>
													<div className='flex space-x-1'>
														<Image src='/svg/delivery.svg' alt='Доставка' width={20} height={20} />
														<p className='border-b-2 border-dotted text-sm text-gray-600'>
															Рассчитать доставку
														</p>
													</div>
													<div className='mt-3 text-sm text-gray-600'>
														<div className='flex space-x-1'>
															<Image src='/svg/info.svg' alt='Доставка' width={20} height={20} />
															<p className=''>
																Самовывоз сегодня - Гродно
															</p>
														</div>
														<p className='pl-6'>
															Доставка на завтра
														</p>
													</div>
													<p className='text-xs font-light text-gray-500 mt-5'>
														Цена действительна только для партнеров
													</p>
												</div>

											</div>
										</div>
									</article>
								</div>
						}
					</div>
				</div>
			</div>
		</section >
	)
})



export default OneProductPage