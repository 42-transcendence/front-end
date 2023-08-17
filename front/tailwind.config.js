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
                seconVar: "rgb(var(--color-secondary-varient), <alpha-value>)",
                seconVar2:
                    "rgb(var(--color-secondary-varient2), <alpha-value>)",
                windowGlass: "rgb(var(--windows-glass), <alpha-value>)",
                controlsHover: "rgb(var(--controls-hover), <alpha-value>)",
                controlsSelected:
                    "rgb(var(--controls-selected), <alpha-value>)",
                ultraDark: "rgb(197 197 197 / <alpha-value>)",
                iconTrinary: "color-mix(in srgb, #5e5e5e 64%, #ffffff 22%)",
                iconSecondary: "rgb(105 105 105 / <alpha-value>)",
                iconPrimary: "rgb(230 230 230 / <alpha-value>)",
                darker: "color-mix(in srgb, #000000 8%, #d6d6d6 45%)",
            },

            animation: {
                "spin-slow": "spin 2s ease-in-out infinite",
            },
            backgroundImage: {
                game: "url(/background-game.jpg)",
                main: "url(/background-main.jpg)",
            },
        },
    },
    plugins: [],
};
