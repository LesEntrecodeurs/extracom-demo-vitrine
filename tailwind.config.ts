import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#295795",
          50: "#EBF1F9",
          100: "#D6E3F3",
          200: "#ADC7E7",
          300: "#85ABDB",
          400: "#5C8FCF",
          500: "#295795",
          600: "#21467A",
          700: "#19355E",
          800: "#112443",
          900: "#081227",
        },
        secondary: {
          DEFAULT: "#00ADEF",
          50: "#E6F7FE",
          100: "#CCEFFD",
          200: "#99DFFB",
          300: "#66CFF9",
          400: "#33BFF7",
          500: "#00ADEF",
          600: "#008BBF",
          700: "#00688F",
          800: "#004660",
          900: "#002330",
        },
        accent: {
          DEFAULT: "#00ADEF",
          light: "#E6F7FE",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8F9FA",
        },
        border: {
          DEFAULT: "#E5E7EB",
        },
        text: {
          DEFAULT: "#1A1A2E",
          secondary: "#6B7280",
          inverse: "#FFFFFF",
        },
        success: "#10B981",
        danger: "#EF4444",
      },
      borderRadius: {
        DEFAULT: "6px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
