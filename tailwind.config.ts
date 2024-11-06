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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      textColor: {
        base: "var(--text-base)",
        secondary: "var(--text-secondary)"
      },
      backgroundColor: {
        'btn-primary': "var(--button-primary)",
        'btn-secondary': "var(--button-secondary)",
        'btn-hover': "var(--button-hover)",
        'btn-accent': "var(--button-accent)"
      },
      borderColor: {
        primary: "var(--border-primary)",
        secondary: "var(--border-secondary)",
      },
      fontFamily: {
        jomolhari: ['Jomolhari', 'serif'],
      }
    },
  },
  plugins: [],
};
export default config;
