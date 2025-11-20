import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          blue: "#0b1c34",
          dark: "#050b16",
          black: "#000000",
        },
        beige: {
          DEFAULT: "#f5f1eb",
          dark: "#d4c5b9",
          black: "#3d3a35",
        },
        silver: {
          DEFAULT: "#c0c0c0",
          light: "#e8e8e8",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-dark": "linear-gradient(45deg, #040914 0%, #0b1c34 35%, #000000 100%)",
        "gradient-beige": "linear-gradient(135deg, #d4c5b9 0%, #3d3a35 100%)",
        "gradient-hero": "linear-gradient(135deg, #1a365d 0%, #0f2027 100%)",
        "gradient-silver": "linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 100%)",
      },
    },
  },
  plugins: [],
};
export default config;

