/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#060B1F",
        navy: {
          DEFAULT: "#0E1836",
          light: "#16224A",
          border: "#22305C",
        },
        electric: "#2E6BFF",
        cyan: "#22D3EE",
        offwhite: "#F5F7FA",
        slate: {
          soft: "#8B95B3",
        },
        priority: {
          critical: "#FB4B4B",
          high: "#FF9F43",
          medium: "#F5C542",
          low: "#34D399",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(46,107,255,0.45)",
        "glow-cyan": "0 0 40px -10px rgba(34,211,238,0.4)",
        card: "0 20px 60px -20px rgba(0,0,0,0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        "flow": {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        flow: "flow 1s linear infinite",
        "spin-slow": "spin-slow 6s linear infinite",
      },
    },
  },
  plugins: [],
};
