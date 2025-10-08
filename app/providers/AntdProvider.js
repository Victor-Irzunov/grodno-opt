// /app/providers/AntdProvider.js
"use client";

import { App as AntdApp, ConfigProvider } from "antd";
import "antd/dist/reset.css";

export default function AntdProvider({ children }) {
  return (
    <ConfigProvider>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
