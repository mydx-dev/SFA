import { createTheme } from "@mui/material/styles";

/**
 * The Digital Curator Theme
 * Based on Stitch Project ID: 11576318200795443616
 * 
 * Design philosophy:
 * - Executive minimalism with breathing room
 * - Tonal layering instead of heavy shadows
 * - Never use pure black (#000000), use #181c1e instead
 * - No 1px solid borders in primary color, use ghost borders
 */

declare module "@mui/material/styles" {
    interface Palette {
        tertiary: Palette["primary"];
        surface: Palette["primary"];
    }
    interface PaletteOptions {
        tertiary?: PaletteOptions["primary"];
        surface?: PaletteOptions["primary"];
    }
}

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#002045", // Deep navy - executive authority
            light: "#003066",
            dark: "#001830",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#555f71", // Muted slate - professional restraint
            light: "#6b7589",
            dark: "#3f4757",
            contrastText: "#ffffff",
        },
        tertiary: {
            main: "#002715", // Dark forest green - growth symbolism
            light: "#003920",
            dark: "#001d0f",
            contrastText: "#ffffff",
        },
        surface: {
            main: "#f7fafc", // Light grey - breathable background
            light: "#ffffff",
            dark: "#e5e7eb",
            contrastText: "#181c1e",
        },
        success: {
            main: "#10b981", // Emerald green
        },
        warning: {
            main: "#f59e0b", // Amber
        },
        error: {
            main: "#ef4444", // Red
        },
        info: {
            main: "#3b82f6", // Blue
        },
        background: {
            default: "#f7fafc",
            paper: "#ffffff",
        },
        text: {
            primary: "#181c1e", // Almost black, never pure #000000
            secondary: "#555f71",
        },
        divider: "rgba(85, 95, 113, 0.15)", // Ghost border
    },
    typography: {
        fontFamily: "'Inter', sans-serif", // Body & UI text
        h1: {
            fontFamily: "'Manrope', sans-serif", // Display headlines
            fontSize: "2rem", // 32px
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
        },
        h2: {
            fontFamily: "'Manrope', sans-serif",
            fontSize: "1.5rem", // 24px
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: "-0.02em",
        },
        h3: {
            fontFamily: "'Manrope', sans-serif",
            fontSize: "1.25rem", // 20px
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontFamily: "'Manrope', sans-serif",
            fontSize: "1.125rem", // 18px
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontFamily: "'Manrope', sans-serif",
            fontSize: "1rem", // 16px
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.875rem", // 14px
            fontWeight: 600,
            lineHeight: 1.5,
        },
        subtitle1: {
            fontSize: "0.875rem", // 14px
            fontWeight: 600,
            letterSpacing: "0.04em", // Wider for contrast
            textTransform: "uppercase",
        },
        subtitle2: {
            fontSize: "0.75rem", // 12px
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
        },
        body1: {
            fontSize: "1rem", // 16px
            lineHeight: 1.6,
            fontWeight: 400,
        },
        body2: {
            fontSize: "0.875rem", // 14px
            lineHeight: 1.5,
            fontWeight: 400,
        },
        caption: {
            fontSize: "0.75rem", // 12px
            lineHeight: 1.4,
            fontWeight: 400,
        },
        button: {
            fontWeight: 600,
            textTransform: "none", // No all-caps buttons
        },
    },
    shape: {
        borderRadius: 8, // Consistent rounded corners
    },
    spacing: 8, // 8px base grid
    shadows: [
        "none",
        "0 2px 8px rgba(0, 32, 69, 0.04)", // Level 1 - subtle
        "0 4px 12px rgba(0, 32, 69, 0.06)", // Level 2
        "0 6px 16px rgba(0, 32, 69, 0.08)", // Level 3
        "0 8px 24px rgba(0, 32, 69, 0.08)", // Level 4
        "0 8px 32px rgba(0, 32, 69, 0.08)", // Ambient shadow
        "0 12px 40px rgba(0, 32, 69, 0.10)",
        "0 16px 48px rgba(0, 32, 69, 0.12)",
        "0 20px 56px rgba(0, 32, 69, 0.14)",
        "0 24px 64px rgba(0, 32, 69, 0.16)",
        "0 28px 72px rgba(0, 32, 69, 0.18)",
        "0 32px 80px rgba(0, 32, 69, 0.20)",
        "0 36px 88px rgba(0, 32, 69, 0.22)",
        "0 40px 96px rgba(0, 32, 69, 0.24)",
        "0 44px 104px rgba(0, 32, 69, 0.26)",
        "0 48px 112px rgba(0, 32, 69, 0.28)",
        "0 52px 120px rgba(0, 32, 69, 0.30)",
        "0 56px 128px rgba(0, 32, 69, 0.32)",
        "0 60px 136px rgba(0, 32, 69, 0.34)",
        "0 64px 144px rgba(0, 32, 69, 0.36)",
        "0 68px 152px rgba(0, 32, 69, 0.38)",
        "0 72px 160px rgba(0, 32, 69, 0.40)",
        "0 76px 168px rgba(0, 32, 69, 0.42)",
        "0 80px 176px rgba(0, 32, 69, 0.44)",
        "0 84px 184px rgba(0, 32, 69, 0.46)",
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: "'Inter', sans-serif",
                    color: "#181c1e",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontWeight: 600,
                    textTransform: "none",
                },
                contained: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0 4px 12px rgba(0, 32, 69, 0.16)",
                        transform: "scale(1.02)",
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #002045 0%, #003066 100%)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #003066 0%, #004588 100%)",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: "1px solid rgba(85, 95, 113, 0.15)", // Ghost border
                    boxShadow: "none",
                    borderRadius: "12px",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: "1px solid rgba(85, 95, 113, 0.15)",
                    boxShadow: "none",
                },
                elevation1: {
                    boxShadow: "0 2px 8px rgba(0, 32, 69, 0.04)",
                },
                elevation2: {
                    boxShadow: "0 4px 12px rgba(0, 32, 69, 0.06)",
                },
                elevation3: {
                    boxShadow: "0 8px 24px rgba(0, 32, 69, 0.08)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    borderBottom: "1px solid rgba(85, 95, 113, 0.15)",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "1px solid rgba(85, 95, 113, 0.15)",
                    padding: "16px",
                },
                head: {
                    backgroundColor: "#f7fafc",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    letterSpacing: "0.02em",
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: "rgba(0, 32, 69, 0.04)",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        "& fieldset": {
                            borderColor: "rgba(85, 95, 113, 0.2)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(85, 95, 113, 0.3)",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#002045",
                        },
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: "3px",
                    borderRadius: "3px 3px 0 0",
                },
            },
        },
    },
});
