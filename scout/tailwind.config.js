const config = {
  content: ["./src/pages/**/*.{js, ts, jsx, tsx, mdx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        darkblue: "rgba(var(--darkblue))",

        lred: "rgba(var(--lred))",
        borderred: "rgba(var(--borderred))",
        lblue: "rgba(var(--lblue))",
        borderblue: "rgba(var(--borderblue))",
      },
    },
  },
  plugins: [],
};
export default config;
