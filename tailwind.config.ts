import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7C3AED",
          dark: "#0F0B1A",
          card: "#1A1528",
          border: "#2D2545",
        },
      },
    },
  },
  plugins: [],
};

export default config;
