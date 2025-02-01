// import { Days_One } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/footer/Footer";
import { MyContextProvider } from "@/contexts/MyContextProvider";
// import { GoogleTagManager } from '@next/third-parties/google'

// const inter = Days_One({ subsets: ["latin",], weight: ["400"] });

export const metadata = {
  title: "Купить бу авто в Минске | Лизинг и Кредит на авто с пробегом | Покупка, продажа, обмен",
  description: "ᐈ ⭐ Автосалон «AvtoCar»: Купить или продать автомобиль быстро ⚡ Кредит и лизинг на б/у авто ⚡ Большой выбор автомобилей ⚡ Помощь в выборе авто ⭐ Офомление в день подачи ⭐ Без взоса ✓ Без справок и поручителей ➤➤➤ До 10 лет ☎️ (33) 355-88-55 Автосалон «АвтоКар» ⭐ Нас советуют друзьям 🔥 Звоните прямо сейчас!",
  keywords: "кредит на авто, лизинг авто, автосалон, кредит на покупку авто, автокредит, машина в лизинг, купить авто в лизинг, кредит на покупку авто бу, лизинг без первого взноса, кредит на авто бу, автолизинг, обмен, продажа, покупка, Минск, Автокар, AvtoCar",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/`
  },
  ogTitle: 'Автосалон в Минске | Лизинг и Кредит на авто б/у | Покупка, продажа, обмен',
  ogDescription: 'ᐈ ⭐ Автосалон: Купить или продать автомобиль быстро ⚡ Кредит и лизинг на б/у авто ⚡ Большой выбор автомобилей ⚡ Помощь в выборе авто ⭐ Офомление в день подачи ⭐ Без взоса ✓ Без справок и поручителей ➤➤➤ До 10 лет ☎️ (33) 355-88-55 ⭐ Нас советуют друзьям 🔥 Звоните прямо сейчас!',
  twitterTitle: 'Автосалон в Минске | Лизинг и Кредит на авто б/у | Покупка, продажа, обмен',
  twitterDescription: 'ᐈ ⭐ Автосалон: Купить или продать автомобиль быстро ⚡ Кредит и лизинг на б/у авто ⚡ Большой выбор автомобилей ⚡ Помощь в выборе авто ⭐ Офомление в день подачи ⭐ Без взоса ✓ Без справок и поручителей ➤➤➤ До 10 лет ☎️ (33) 355-88-55 ⭐ Нас советуют друзьям 🔥 Звоните прямо сейчас!',
  twitterImage: 'public/logo/logo.webp',
  ogType: 'website',
  ogUrl: '',
  twitterCard: 'public/logo/logo.webp'
};


export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        {/* <GoogleTagManager gtmId="GTM-NN2CR9Z5" /> */}
      </head>

      <MyContextProvider>
        <body
        //  className={inter.className}
        >
          <Header />
          {children}
          <Footer />
        </body>
      </MyContextProvider>
    </html>
  );
}
