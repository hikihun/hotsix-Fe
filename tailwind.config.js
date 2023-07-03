/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        "main-100": "#EEF1FF",
        "main-200": "#D2DAFF",
        "main-300": "#AAC4FF",
        "main-400": "#8F92FF",
      },
      maxWidth:{
        '4/5':'80%',
      }
    },
  },
  screens: {
    sm: "640px",

    md: "1024px",

    lg: "1280px",
  },
  plugins: [],
};
