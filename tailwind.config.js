/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      colors: {
        primary: {
          DEFAULT: '#50C878', // Emerald Green (User Requested)
          dark: '#0B6E4F',    // Royal Amethyst (Darker Teal for hover)
          light: '#82E0AA',   // Lighter Emerald
          pale: '#E8F8F5',    // Very light mint for backgrounds
        },
        navy: {
          DEFAULT: '#1E293B', // Slate 800 (Neutral Dark Blue-Grey) - Less "Green"
          800: '#0F172A',     // Slate 900
          900: '#020617',     // Slate 950
        },
        background: '#F8FAFC',
        text: {
          main: '#111827',
          light: '#64748b',
        },
        success: '#50C878', // Emerald Green
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}
