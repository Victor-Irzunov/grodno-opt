import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const AsideMenu = ({ data, kategoriya, searchResults }) => {
	const [loadedData, setLoadedData] = useState([]);

	useEffect(() => {
		if (data.length) {
			setLoadedData(data);
		}
	}, [data]);

	if (!loadedData.length) return null; // Ждём загрузки данных

	return (
		<aside className="sd:block xz:hidden sd:w-1/5 xz:w-full">
			<div className='sticky top-24'>
				<div className="flex space-x-2">
					<Image src="/svg/catalog.svg" alt="Каталог" width={12} height={12} />
					<span className="text-xs text-gray-500">Каталог</span>
				</div>
				<div className="mt-4">
					<ul className="border text-sm text-gray-800">
						{loadedData.map((el) => (
							<li
								key={el.id}
								className={`p-2 border-b ${el.link === kategoriya && !searchResults ? "font-semibold" : ""
									} ${searchResults ? "opacity-55 hover:opacity-100" : ""
									} hover:bg-slate-50 hover-transition`}
							>
								<Link href={`/catalog/${el.id}`} className="flex space-x-1">
									<h2 className="">{el.title}</h2>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</aside>
	);
};
