/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["plasmo-class"],
  content: ["./src/**/*.{ts,tsx}", "./src/lib/components/ui/*.{ts,tsx}"],
  prefix: "plasmo-",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "plasmo-2xl": "1400px"
      }
    },
    extend: {
      colors: {
        "plasmo-border": "hsl(var(--plasmo-border))",
        "plasmo-input": "hsl(var(--plasmo-input))",
        "plasmo-ring": "hsl(var(--plasmo-ring))",
        "plasmo-background": "hsl(var(--plasmo-background))",
        "plasmo-foreground": "hsl(var(--plasmo-foreground))",
        "plasmo-primary": {
          DEFAULT: "hsl(var(--plasmo-primary))",
          foreground: "hsl(var(--plasmo-primary-foreground))"
        },
        "plasmo-secondary": {
          DEFAULT: "hsl(var(--plasmo-secondary))",
          foreground: "hsl(var(--plasmo-secondary-foreground))"
        },
        "plasmo-destructive": {
          DEFAULT: "hsl(var(--plasmo-destructive))",
          foreground: "hsl(var(--plasmo-destructive-foreground))"
        },
        "plasmo-muted": {
          DEFAULT: "hsl(var(--plasmo-muted))",
          foreground: "hsl(var(--plasmo-muted-foreground))"
        },
        "plasmo-accent": {
          DEFAULT: "hsl(var(--plasmo-accent))",
          foreground: "hsl(var(--plasmo-accent-foreground))"
        },
        "plasmo-popover": {
          DEFAULT: "hsl(var(--plasmo-popover))",
          foreground: "hsl(var(--plasmo-popover-foreground))"
        },
        "plasmo-card": {
          DEFAULT: "hsl(var(--plasmo-card))",
          foreground: "hsl(var(--plasmo-card-foreground))"
        }
      },
      "plasmo-borderRadius": {
        "plasmo-lg": "var(--plasmo-radius)",
        "plasmo-md": "calc(var(--plasmo-radius) - 2px)",
        "plasmo-sm": "calc(var(--plasmo-radius) - 4px)"
      },
      "plasmo-keyframes": {
        "plasmo-accordion-down": {
          from: { height: "0" },
          to: { height: "var(--plasmo-radix-accordion-content-height)" }
        },
        "plasmo-accordion-up": {
          from: { height: "var(--plasmo-radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      "plasmo-animation": {
        "plasmo-accordion-down": "plasmo-accordion-down 0.2s ease-out",
        "plasmo-accordion-up": "plasmo-accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
