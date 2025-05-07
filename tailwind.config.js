/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // ⛔ перемещаем опцию СЮДА
    unstable_defaultOkLchColors: false,

    extend: {
      screens: {
        xz: "320px",
        xy: "376px",
        xx: "415px",
        xs: "480px",
        xm: "575px",
        ss: "620px",
        sm: "768px",
        sd: "991px",
        md: "1060px",
        lg: "1200px",
        xl: "1700px",
      },
      boxShadow: {
        'inner-amber': 'inset 0 0 20px #A926D1',
        'hover-amber': '0 4px 15px rgba(169, 38, 209, 0.7)',
      },
      colors: {
        'color-black': '0,0,0',
        'color-white': '255,255,255',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,1) 50%, rgba(0,0,0,0) 100%)',
      },
      opacity: {
        '30': '0.3',
      },
      backdropInvert: {
        15: '.15',
        25: '.25',
        50: '.50',
        75: '.75',
      },
      scale: {
        '175': '1.75',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#0171E3",
          "secondary": "#0171E3",
          "accent": "#FAFAFC",
          "neutral": "#F1F1F3",
          "base-100": "#ffffff",
          "base-200": "#F1F1F3",
        },
      },
    ],
  },
}
