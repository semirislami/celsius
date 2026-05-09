import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem"
      },
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        celsius: {
          50: "#EEF2FF",
          100: "#DCE3FF",
          200: "#B5C2FF",
          300: "#8497FF",
          400: "#4F69FF",
          500: "#1B45FF",
          600: "#0F2FE0",
          700: "#0A23B3",
          800: "#0A1F8F",
          900: "#0B1C72"
        },
        heating: {
          50: "#FFF3EC",
          100: "#FFE1D0",
          200: "#FFBC9C",
          300: "#FF9265",
          400: "#F26F3D",
          500: "#E85D2C",
          600: "#C24818",
          700: "#993814",
          800: "#7A2E12",
          900: "#5F2510"
        },
        ink: {
          DEFAULT: "#0A0A0A",
          soft: "#1F2024",
          muted: "#5A5F6A"
        },
        canvas: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F8FB",
          muted: "#EEF1F6"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 47, 224, 0.18)",
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
        "card-lg": "0 4px 16px rgba(15, 23, 42, 0.06), 0 24px 56px rgba(15, 23, 42, 0.10)"
      },
      backgroundImage: {
        "celsius-gradient":
          "linear-gradient(135deg, #1B45FF 0%, #0F2FE0 50%, #0A23B3 100%)",
        "soft-radial":
          "radial-gradient(1200px 600px at 80% -10%, rgba(27,69,255,0.10), transparent 60%), radial-gradient(900px 500px at -10% 30%, rgba(232,93,44,0.08), transparent 60%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "fade-up": "fade-up 600ms ease-out both",
        shimmer: "shimmer 2.4s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
