// /app/login/page.jsx
import { Suspense } from "react";
import LoginRegistrationClient from "./LoginRegistrationClient";

export const dynamic = "force-dynamic"; // не пытаться пререндерить страницу

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10">Загрузка…</div>}>
      <LoginRegistrationClient />
    </Suspense>
  );
}
