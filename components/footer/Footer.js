"use client"
import Image from "next/image";
import Link from "next/link";
import phoneNumbers from "@/config/config";
import { observer } from "mobx-react-lite";
import { MyContext } from "@/contexts/MyContextProvider";
import { useContext } from "react";
import { usePathname } from "next/navigation";


const Footer = observer(() => {
	const { user } = useContext(MyContext)
	const pathname = usePathname()
	return (
		<footer className={`py-40 pb-2 relative ${pathname === '/super-admin'? 'hidden': 'block'}`} id='contacts'>

			<aside className="border-t border-gray-800 pt-1 mt-6">
				<div className='container mx-auto text-center '>
					<p className='text-blue-950/15 text-[10px]' >
						Copyright © 2024 | Разработка и Продвижение
						<a href='https://vi-tech.by' target='_blank' rel="noreferrer" className=''> VI:TECH</a>.
						{' '}Информация на сайте не является публичной офертой и предоставляется исключительно в информационных целях.
					</p>
				</div>
			</aside>
		</footer>
	)
})

export default Footer