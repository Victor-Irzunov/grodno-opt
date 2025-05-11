import phoneNumbers from "@/config/config";

export const metadata = {
	title: "",
	description: `⭐  ☎ Звоните: ${phoneNumbers.phone1} — !`,
	keywords: "",
	alternates: {
	  canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/oplata/`
	},
	ogTitle: "",
	ogDescription: `. Свяжитесь с нами по телефону: ${phoneNumbers.phone1}`,
	ogImage: '/logo/logo-jpg3.jpg',
	twitterTitle: "Контакты | Грузовичок.бел",
	twitterDescription: `. Звоните: ${phoneNumbers.phone1}`,
	twitterImage: '/logo/logo-jpg3.jpg'
 };
 

export default function Layout({ children }) {
	return (
		<>
			{children}
		</>
	);
}
