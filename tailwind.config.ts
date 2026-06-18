import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ton: { DEFAULT: "#0098EA", bright: "#33BBFF", deep: "#0066BB" },
        space: { 950: "#04070D", 900: "#060A12", 800: "#0A101C", 700: "#0D1626" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        "glow-sm": "0 0 18px rgba(0,152,234,0.35)",
        "glow-md": "0 0 32px rgba(0,152,234,0.45)",
        "glow-lg": "0 0 60px rgba(0,152,234,0.55)",
      },
      animation: {
        float: "float 4.5s ease-in-out infinite",
        "spin-slow": "spin 9s linear infinite",
        flicker: "flicker 1.6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        flicker: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", opacity: "1" },
          "50%": { transform: "scaleY(1.06) scaleX(0.97)", opacity: "0.92" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
