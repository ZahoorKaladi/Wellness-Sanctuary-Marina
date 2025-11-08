/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Add a custom font family (for font-poppins utility)
     fontFamily: {
        poppins: ['Inter', 'sans-serif'],
      },
      // Add a new keyframe animation
      keyframes: {
        pulseLight: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
          '50%': { transform: 'scale(1.05)', opacity: 1 },
        }
      },
      // Apply the keyframe animation
      animation: {
        pulseLight: 'pulseLight 4s ease-in-out infinite',
      },
      // Optional: Extend screens if you commonly use 'xs' in classes (e.g., xs:text-2xl)
      // This adds a custom breakpoint at 480px (between mobile and sm:640px)
      screens: {
        xs: '480px',
      },
    },
    // Moved the sans override here (inside theme) for validity
    // This sets the default sans font to Inter (used in font-sans utility)
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
};