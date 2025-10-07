// /postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // v4: использовать именно этот плагин
  },
};
export default config;
