import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#0A0E17",
          surface: "#121826",
          surface2: "#1A2233",
          border: "#232C40",
        },
        ink: {
          primary: "#F3F5F9",
          muted: "#8B93A7",
          faint: "#5B6478",
        },
        signal: {
          orange: "#FF6B35",
          orangeDim: "#CC4E22",
          mint: "#00E5A0",
          amber: "#FFC145",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "circuit-fade":
          "radial-gradient(circle at 20% 20%, rgba(255,107,53,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(0,229,160,0.10), transparent 35%)",
      },
    },
  },
  plugins: [],
};
export default config;
