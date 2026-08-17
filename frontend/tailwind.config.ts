import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f4f7fb",
        signal: "#2563eb",
        mint: "#00c89b",
        coral: "#ff7a59"
      }
    }
  },
  plugins: []
};

export default config;
