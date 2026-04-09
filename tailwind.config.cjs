module.exports = {
    content: ["./src/frontend/**/*.{ts,tsx,html}"],
    theme: {
        extend: {
            colors: {
                primary: "#002045",
                secondary: "#555f71",
                tertiary: "#002715",
                surface: "#f7fafc",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f1f5f9",
                "surface-container": "#e2e8f0",
                "surface-container-high": "#e5e7eb",
                "surface-container-highest": "#d1d5db",
                outline: "#8b95a5",
                "outline-variant": "#d0d5dd",
                "on-surface": "#181c1e",
                "on-surface-variant": "#555f71",
                "primary-container": "#d6e3ff",
                "tertiary-container": "#c8f2dc",
                "primary-fixed": "#d6e3ff",
                "secondary-fixed": "#d6e0f6",
                "tertiary-fixed": "#9ff5c1",
                "surface-tint": "#002045",
                error: "#ef4444",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                headline: ["Manrope", "sans-serif"],
            },
        },
    },
    plugins: [],
};
