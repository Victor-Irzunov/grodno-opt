// /app/layout.js
// import { Days_One } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/footer/Footer";
import { MyContextProvider } from "@/contexts/MyContextProvider";
import AntdProvider from "./providers/AntdProvider";

// const inter = Days_One({ subsets: ["latin",], weight: ["400"] });

export const metadata = {
  title: "Запчасти для телефонов, смартфонов купить оптом | ProParts",
  description:
    "ᐈ ⭐ ProParts - купить запчасти и комплектующие для мобильных телефонов, смартфонов в Беларуси оптом: Аккумулятор ⚡ Динамик ⚡ Тачскрины и дисплеи ⚡ Задняя крышка ⚡ Защитное стекло ⚡ Инструменты ⚡ Скотч для монтажа дисплея ⚡ Шлейфы и много другое ⭐ Большой выбор запчастей 🔥 Продажа оригинальных запчастей и аналогов для ремонта техники Apple, Xiaomi, Samsung, Huawei, Realme ✓ Звоните для консультации ➤➤➤ ☎️ (44) 740-00-01 ✌ Оптовый склад",
  keywords:
    "запчасти для телефонов, запчасти для смартфонов, запчасти для мобильных телефонов, запчасти для телефонов оптом, запчасти для iphone, запчасти для huawei, запчасти для samsung, запчасти для xiaomi, запчасти на телефон, опт, proparts",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  },
  ogTitle:
    "Запчасти для телефонов, смартфонов купить оптом | ProParts",
  ogDescription:
    "ᐈ ⭐ ProParts - купить запчасти и комплектующие для мобильных телефонов, смартфонов в Беларуси оптом: Аккумулятор ⚡ Динамик ⚡ Тачскрины и дисплеи ⚡ Задняя крышка ⚡ Защитное стекло ⚡ Инструменты ⚡ Скотч для монтажа дисплея ⚡ Шлейфы и много другое ⭐ Большой выбор запчастей 🔥 Продажа оригинальных запчастей и аналогов для ремонта техники Apple, Xiaomi, Samsung, Huawei, Realme ✓ Звоните для консультации ➤➤➤ ☎️ (44) 740-00-01 ✌ Оптовый склад",
  twitterTitle:
    "Запчасти для телефонов, смартфонов купить оптом | ProParts",
  twitterDescription:
    "ᐈ ⭐ ProParts - купить запчасти и комплектующие для мобильных телефонов, смартфонов в Беларуси оптом: Аккумулятор ⚡ Динамик ⚡ Тачскрины и дисплеи ⚡ Задняя крышка ⚡ Защитное стекло ⚡ Инструменты ⚡ Скотч для монтажа дисплея ⚡ Шлейфы и много другое ⭐ Большой выбор запчастей 🔥 Продажа оригинальных запчастей и аналогов для ремонта техники Apple, Xiaomi, Samsung, Huawei, Realme ✓ Звоните для консультации ➤➤➤ ☎️ (44) 740-00-01 ✌ Оптовый склад",
  twitterImage: "public/logo/logo.webp",
  ogType: "website",
  ogUrl: "",
  twitterCard: "public/logo/logo.webp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>{/* мета/скрипты */}</head>
      <body>
        <MyContextProvider>
          <AntdProvider>
            <Header />
            {children}
            <Footer />
          </AntdProvider>
        </MyContextProvider>
      </body>
    </html>
  );
}
