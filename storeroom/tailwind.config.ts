import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        // Maps Tailwind's 'font-sans' class to your new Plus Jakarta Sans variable
        sans: ["var(--font-sans)", "sans-serif"],
        // Maps Tailwind's 'font-mono' class to your new JetBrains Mono variable
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },

  plugins: [],
};

export default config;
