"use client";

// В браузере глушим только совместимый ворнинг antd про React 19
if (typeof window !== "undefined") {
  const origWarn = window.console.warn;
  window.console.warn = (...args) => {
    const msg = args?.[0];
    if (typeof msg === "string" && msg.includes("[antd: compatible] antd v5 support React is 16 ~ 18")) {
      return;
    }
    origWarn(...args);
  };
}
