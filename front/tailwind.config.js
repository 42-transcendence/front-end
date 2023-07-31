/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: "jit",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary), <alpha-value>)",
                priVar: "rgb(var(--color-primary-varient), <alpha-value>)",
                secondary: "rgb(var(--color-secondary), <alpha-value>)",
                windowGlass: "rgb(var(--windows-glass), <alpha-value>)",
                controlsHover: "rgb(var(--controls-hover), <alpha-value>)",
                controlsSelected: "rgb(var(--controls-selected), <alpha-value)",
                ultraDark: "var(--views-ultra-dark)",
                iconTrinary: "var(--icon-trinary)",
                darker: "var(--color-darker)",
            },
            backgroundImage: {},
        },
    },
    plugins: [],
};
