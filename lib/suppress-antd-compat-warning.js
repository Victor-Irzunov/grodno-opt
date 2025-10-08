"use client";

// Тихо подавляем только совместимый ворнинг antd для React 19
if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args) => {
    const msg = args?.[0];
    if (typeof msg === "string" && msg.includes("[antd: compatible]")) {
      return;
    }
    origWarn(...args);
  };
}
