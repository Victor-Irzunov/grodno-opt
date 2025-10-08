// /app/providers/AntdProvider.js — ФАЙЛ ПОЛНОСТЬЮ
'use client';

import { ConfigProvider } from 'antd';
// ВАЖНО: здесь НЕ импортируем 'antd/dist/reset.css' — он уже в layout

export default function AntdProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          colorPrimary: '#0171E3',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
