import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crm: {
          dark: "#0A0A0A",
          surface: "#121212",
          card: "#181818",
          border: "#262626",
          won: "#16C89E",
          lead: "#FFDB4B",
          negotiation: "#9668FE",
          lost: "#FE4A8E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
