/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        colors: {
            primary: "#1B1B1B",
            secondary: "#0B0B0B",
            header: {
                background: "#28282A",
                text: "#D8FFFB",
                "text-hover": "#00DAC6",  // kebab-case key here
            },
            text: {
                primary: "#FFFFFF",
                secondary: "#A2A2A2",
            },
            category: {
                bg1: "#222255",
                text1: "#C09BF9",
                bg2: "#682C2B",
                text2: "#DA0016",
                bg3: "#6F2751",
                text3: "#F11F99",
                bg4: "#124241",
                text4: "#00DAC6",
            },
        },
    },
  },
  plugins: [],
}

