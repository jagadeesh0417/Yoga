/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        wine: { DEFAULT: "#8B1E3F", 50: "#FDF2F4", 100: "#F9D6DE", 200: "#F0A5B5", 300: "#E7748B", 400: "#DE4362", 500: "#8B1E3F", 600: "#6E1632", 700: "#511025", 800: "#350A18", 900: "#1A050C" },
        purple: { DEFAULT: "#5B2A9D", 50: "#F5F0FB", 100: "#DFD0F0", 200: "#BF9DE0", 300: "#9F6AD0", 400: "#7D37C0", 500: "#5B2A9D", 600: "#49227E", 700: "#371A5E", 800: "#24113E", 900: "#12091F" },
        gold: { DEFAULT: "#D4A373", 50: "#FCF7F1", 100: "#F5E6D3", 200: "#EACDA7", 300: "#DFB47B", 400: "#D4A373", 500: "#C48E4E", 600: "#9E6E3A", 700: "#784F26", 800: "#523012", 900: "#2C1A08" },
        ivory: { DEFAULT: "#FFF9F7", 50: "#FFFFFF", 100: "#FFF9F7", 200: "#FFEDE5", 300: "#FFE1D3", 400: "#FFD5C1", 500: "#F5C4A8", 600: "#E0A07A", 700: "#CC7C4C", 800: "#A85E2E", 900: "#70401E" },
      },
    },
  },
  plugins: [],
};
