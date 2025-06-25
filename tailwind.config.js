module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            600: '#d7281f',
            700: '#b32018',
          },
          secondary: {
            500: '#ff7b00',
            600: '#e06d00',
          },
        },
      },
    },
    plugins: [],
  }