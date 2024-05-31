/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  corePlugins: {
    preflight: false, // Disable Tailwind's preflight to avoid conflicts with Chakra UI
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  prefix: 'tw-', // Add a prefix to avoid conflict
};
