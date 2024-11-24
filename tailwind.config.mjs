import defaultTheme from "tailwindcss/defaultTheme";
const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        fontFamily: {
            sans: ["Geist", defaultTheme.fontFamily.sans],
            mono: [defaultTheme.fontFamily.mono],
        },
        extend: {
            backgroundImage: {
                "hero-landscape": "url('/svgs/hero-landscape.svg')",
            },
            colors: {
                "vivid-violet": {
                    50: "#fdf6fd",
                    100: "#f9edfa",
                    200: "#f4daf4",
                    300: "#ebbcea",
                    400: "#de94db",
                    500: "#cb6ac7",
                    600: "#ae4ba8",
                    700: "#a04298",
                    800: "#76326f",
                    900: "#622d5c",
                    950: "#3e1439",
                },

                amaranth: {
                    50: "#ffeff2",
                    100: "#ffe0e7",
                    200: "#ffc6d6",
                    300: "#ff97b3",
                    400: "#ff5d8c",
                    500: "#ff246a",
                    600: "#f50057",
                    700: "#d7004c",
                    800: "#b40048",
                    900: "#990244",
                    950: "#570020",
                },
                "san-juan": {
                    50: "#f4f6fb",
                    100: "#e8edf6",
                    200: "#cddaea",
                    300: "#a1bad8",
                    400: "#6e95c2",
                    500: "#4c79ab",
                    600: "#395f90",
                    700: "#32517b",
                    800: "#2a4262",
                    900: "#283a52",
                    950: "#1a2537",
                },
                shark: {
                    50: "#f4f6f7",
                    100: "#e3e7ea",
                    200: "#cbd3d6",
                    300: "#a6b4ba",
                    400: "#7a8c96",
                    500: "#5f717b",
                    600: "#515f69",
                    700: "#465058",
                    800: "#3e454c",
                    900: "#373d42",
                    950: "#212529",
                },
                "star-dust": {
                    50: "#f7f7f7",
                    100: "#ededed",
                    200: "#dfdfdf",
                    300: "#c8c8c8",
                    400: "#adadad",
                    500: "#9f9f9f",
                    600: "#888888",
                    700: "#7b7b7b",
                    800: "#676767",
                    900: "#545454",
                    950: "#363636",
                },
                bunker: {
                    50: "#f3f8f8",
                    100: "#e0ebed",
                    200: "#c5d9dc",
                    300: "#9dbdc3",
                    400: "#6d99a3",
                    500: "#527d88",
                    600: "#466974",
                    700: "#3e5760",
                    800: "#384b52",
                    900: "#324047",
                    950: "#11171a",
                },
            },
        },
    },
    plugins: [nextui()],
};
