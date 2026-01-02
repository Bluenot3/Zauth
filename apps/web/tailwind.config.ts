import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.1)"
      }
    }
  },
  plugins: []
};

export default config;
