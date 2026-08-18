import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A73E8",
        primaryDark: "#1557B0",
        secondary: "#00BCD4",
        accent: "#7C3AED",
        midnight_text: "#0D1B2A",
        gray: "#64748B",
        border: "#E2E8F0",
        light: "#F8FAFF",
        section: "#F1F5F9",
        darkmode: "#080F1A",
        semidark: "#0D1A2E",
        darklight: "#132038",
        dark_border: "#1E3A5F",
        herobg: "#D6E9FF",
        cyan: "#00BCD4",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        lightgray: "#E2E8F0",
        darkgray: "#374151",
        skyBlue: "#38BDF8",
      },
      boxShadow: {
        property: "0 0px 30px #1817171a",
        detail_shadow: "0px 20px 80px 0px #68758D26",
        darkmd:
          "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
        glow: "0 0 40px rgba(26, 115, 232, 0.25)",
        "glow-success": "0 0 30px rgba(16, 185, 129, 0.2)",
        "glow-warning": "0 0 30px rgba(245, 158, 11, 0.2)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #080F1A 0%, #0D1B2E 50%, #0A1628 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(26,115,232,0.08) 0%, rgba(124,58,237,0.08) 100%)",
        "cta-gradient": "linear-gradient(135deg, #1A73E8 0%, #7C3AED 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
