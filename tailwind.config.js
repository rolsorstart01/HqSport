/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'], // New Luxury Font
            },
            colors: {
                gold: {
                    100: '#FCEFA4',
                    200: '#FFE5A0',
                    400: '#D4AF37', // Classic Gold
                    500: '#C5A028',
                    600: '#B8860B',
                    800: '#996515',
                    900: '#754B0B',
                },
                obsidian: {
                    DEFAULT: '#020408', // Deepest Black/Blue
                    light: '#0A0F1C',
                }
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #FFE5A0 0%, #D4AF37 40%, #B8860B 70%, #996515 100%)',
                'radial-highlight': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
            },
            animation: {
                'shine': 'shine 3s infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'scale-in': 'scaleIn 0.5s ease-out forwards',
            },
            keyframes: {
                shine: {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
