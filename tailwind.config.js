/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0D2F6F",
          900: "#0A2456",
          700: "#173C80",
        },
        brand: { red: "#E30613" },
        surface: { soft: "#F4F5F7", dim: "#EAECEF" },
        ink: {
          DEFAULT: "#0A0E14",
          soft: "#4B5563",
          muted: "#9CA3AF",
        },
        gold: { DEFAULT: "#B8893D", soft: "#C89B54" },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      maxWidth: { content: "1200px" },
      boxShadow: {
        card: "0 1px 3px rgba(13,21,38,0.04), 0 8px 24px rgba(13,21,38,0.06)",
        cardHover: "0 4px 12px rgba(13,21,38,0.08), 0 16px 40px rgba(13,21,38,0.10)",
      },
    },
  },
  plugins: [],
}
