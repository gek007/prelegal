/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#ecad0a',      // Yellow - highlights, notifications
        primary: '#209dd7',     // Blue - primary buttons, links
        secondary: '#753991',   // Purple - submit buttons, CTAs
        navy: '#032147',        // Dark Navy - headings, primary text
        graytext: '#888888',    // Gray Text - secondary text, placeholders
      }
    },
  },
  plugins: [],
}
