import type { Config } from "tailwindcss";
import { brandTokens } from "./lib/brand-tokens";

const semantic = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        credlytic: {
          night: brandTokens.colors.night,
          midnight: brandTokens.colors.midnight,
          sidebar: brandTokens.colors.sidebar,
          navy: {
            950: brandTokens.colors.navy950,
            900: brandTokens.colors.navy900,
            850: brandTokens.colors.navy850,
            800: brandTokens.colors.navy800
          },
          paper: brandTokens.colors.paper,
          "paper-raised": brandTokens.colors.paperRaised,
          blue: brandTokens.colors.blue,
          "blue-hover": brandTokens.colors.blueHover,
          "blue-bright": brandTokens.colors.blueBright,
          cyan: brandTokens.colors.cyan,
          emerald: brandTokens.colors.emerald,
          amber: brandTokens.colors.amber,
          red: brandTokens.colors.red
        },
        canvas: semantic("--cl-canvas"),
        surface: {
          DEFAULT: semantic("--cl-panel"),
          raised: semantic("--cl-panel-raised")
        },
        content: {
          DEFAULT: semantic("--cl-content-primary"),
          secondary: semantic("--cl-content-secondary"),
          muted: semantic("--cl-content-muted")
        },
        status: {
          positive: brandTokens.colors.emerald,
          caution: brandTokens.colors.amber,
          risk: brandTokens.colors.red,
          intelligence: brandTokens.colors.cyan
        }
      },
      fontFamily: {
        sans: [...brandTokens.typography.fontFamily.sans],
        display: [...brandTokens.typography.fontFamily.display]
      },
      fontSize: {
        "display-xl": [brandTokens.typography.fontSize.displayXl, { lineHeight: "0.92", fontWeight: "400" }],
        "display-lg": [brandTokens.typography.fontSize.displayLg, { lineHeight: "1", fontWeight: "400" }],
        "display-md": [brandTokens.typography.fontSize.displayMd, { lineHeight: "1.04", fontWeight: "400" }],
        "product-xl": [brandTokens.typography.fontSize.productXl, { lineHeight: "1.1", fontWeight: "640" }],
        "product-lg": [brandTokens.typography.fontSize.productLg, { lineHeight: "1.2", fontWeight: "620" }],
        "product-md": [brandTokens.typography.fontSize.productMd, { lineHeight: "1.35", fontWeight: "620" }],
        "body-lg": [brandTokens.typography.fontSize.bodyLg, { lineHeight: "1.64", fontWeight: "400" }],
        "body-md": [brandTokens.typography.fontSize.bodyMd, { lineHeight: "1.7", fontWeight: "400" }],
        "body-sm": [brandTokens.typography.fontSize.bodySm, { lineHeight: "1.6", fontWeight: "400" }],
        caption: [brandTokens.typography.fontSize.caption, { lineHeight: "1.5", fontWeight: "600" }],
        micro: [brandTokens.typography.fontSize.micro, { lineHeight: "1.45", fontWeight: "600" }]
      },
      spacing: {
        "section-mobile": brandTokens.layout.sectionMobile,
        section: brandTokens.layout.sectionDesktop
      },
      maxWidth: {
        "brand-content": brandTokens.layout.content,
        "brand-navigation": brandTokens.layout.navigation,
        "brand-application": brandTokens.layout.application
      },
      borderRadius: {
        label: brandTokens.radius.label,
        control: brandTokens.radius.control,
        panel: brandTokens.radius.panel,
        round: brandTokens.radius.round
      },
      borderColor: {
        subtle: brandTokens.border.default,
        strong: brandTokens.border.strong,
        "paper-divider": brandTokens.border.darkOnPaper
      },
      boxShadow: {
        panel: brandTokens.shadow.panel,
        floating: brandTokens.shadow.floating,
        primary: brandTokens.shadow.primary
      },
      letterSpacing: {
        index: "0.12em"
      },
      transitionDuration: {
        fast: brandTokens.motion.fast,
        control: brandTokens.motion.control,
        standard: brandTokens.motion.standard
      },
      transitionTimingFunction: {
        credlytic: brandTokens.motion.easing
      },
      screens: {
        compact: brandTokens.breakpoints.compact,
        tablet: brandTokens.breakpoints.tablet,
        product: brandTokens.breakpoints.product,
        wide: brandTokens.breakpoints.wide,
        canvas: brandTokens.breakpoints.canvas
      },
      backgroundImage: {
        "signal-line": "linear-gradient(90deg, #287CFF, #32C6D4)",
        "intelligence-glow": "radial-gradient(circle, rgba(50, 198, 212, 0.16), transparent 62%)"
      },
      keyframes: {
        "signal-draw": {
          from: { opacity: "0", transform: "scaleX(0)" },
          to: { opacity: "1", transform: "scaleX(1)" }
        },
        "progress-reveal": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" }
        },
        "credlytic-float": {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-5px) rotate(0)" }
        },
        "orbit-slow": {
          to: { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "signal-draw": `signal-draw ${brandTokens.motion.reveal} ${brandTokens.motion.easing} both`,
        "progress-reveal": `progress-reveal ${brandTokens.motion.reveal} ${brandTokens.motion.easing} both`,
        "credlytic-float": "credlytic-float 10s ease-in-out infinite",
        "orbit-slow": `orbit-slow ${brandTokens.motion.orbit} linear infinite`
      }
    }
  },
  plugins: []
};

export default config;
