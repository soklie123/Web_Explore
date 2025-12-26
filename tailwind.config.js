/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",        // App folder (Next.js 13 app router)
    "./pages/**/*.{ts,tsx,js,jsx}",      // Pages folder (if used)
    "./components/**/*.{ts,tsx,js,jsx}", // Components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",    // Example: primary color
        secondary: "#F59E0B",  // Example: secondary color
      },
      fontFamily: {
        sans: ["Arial", "sans-serif"], // Customize your font
      },
    },
  },
  plugins: [],
};
