/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      xxl: { max: "1399px" },
      xl: { max: "1199px" },
      lg: { max: "991px" },
      md: { max: "767px" },
      sm: { max: "575px" },

    },
    extend: {
      colors: {
        primary: {
          dark: '#A8CD19',
          light: '#D2ED69'
        }
        ,
        white: '#FFFFFF',
        gray: '#999999',
        black: {
          0: '#000000',
          9: '#161616',
          12: '#1F1F1F',
          20: '#333333',
          50: '#666666',
        },
        borderColor: '#4D4D4D',
        lightBorder: '#B3B3B3'


      },
      borderRadius: {
        100: '100px',
      },
      gap: {
        100: '100px',
      },
      padding: {
        60: '60px',
        100: '100px',
        150: '150px',
      },
      fontFamily: {
        'chill': ['Chillax'],
        'bebas': ['Bebas Neue', 'cursive']
      },
      fontSize: {
        '2.5xl': '28px',
        '3.2xl': '32px',  //32px clamp(28px, 32px, 1.667vw )
        '3.5xl': '34px', //34px
        '5.5xl': 'clamp(32px, 50px, 2.60vw)', //50px
        '10xl': 'clamp(98px,198px,10.313vw)' //198px
      },

      width: {
        100: '100px',
      },
      minWidth: {
        100: '100vw',
      },
      minHeight: {
        100: '100vh',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'right-pull': 'rightPull 1s  ease 1s infinite ',
      },
      keyframes: {
        'rightPull': {
          '0%, 100%': { transform: 'translateX(100%) translateY(-50%)' },
          '50%': { transform: 'translateX(0) translateY(-50%)' }
        }
      },
      transition: {
        'img-reveal': 'transform 2s cubic-bezier(.19,1,.22,1)',
      }
    },
  },
  plugins: [],
}

