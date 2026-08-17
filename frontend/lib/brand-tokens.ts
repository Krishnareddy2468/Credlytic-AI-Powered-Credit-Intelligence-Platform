export const brandTokens = {
  colors: {
    night: "#03070D",
    midnight: "#050910",
    sidebar: "#050C16",
    navy950: "#07101D",
    navy900: "#0B1524",
    navy850: "#101C2E",
    navy800: "#16243A",
    paper: "#EEF3F8",
    paperRaised: "#F7F9FC",
    textPrimary: "#F6F8FB",
    textSecondary: "#A8B4C5",
    textMuted: "#718096",
    ink: "#102033",
    blue: "#287CFF",
    blueHover: "#3989FF",
    blueBright: "#4DA3FF",
    cyan: "#32C6D4",
    emerald: "#38D996",
    amber: "#F0B85A",
    red: "#EF6A75"
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      display: ["Georgia", "Times New Roman", "serif"]
    },
    fontSize: {
      displayXl: "7.8rem",
      displayLg: "5.1rem",
      displayMd: "4rem",
      productXl: "2.75rem",
      productLg: "1.55rem",
      productMd: "1.125rem",
      bodyLg: "1.2rem",
      bodyMd: "0.95rem",
      bodySm: "0.82rem",
      caption: "0.68rem",
      micro: "0.58rem"
    }
  },
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
    28: "112px"
  },
  radius: {
    label: "4px",
    small: "6px",
    control: "8px",
    panel: "12px",
    round: "9999px"
  },
  border: {
    default: "rgba(182, 204, 232, 0.13)",
    strong: "rgba(182, 204, 232, 0.22)",
    darkOnPaper: "rgba(31, 52, 78, 0.11)"
  },
  shadow: {
    panel: "0 20px 60px rgba(0, 0, 0, 0.25)",
    floating: "0 32px 80px rgba(11, 23, 40, 0.25)",
    primary: "0 12px 34px rgba(40, 124, 255, 0.23)"
  },
  motion: {
    fast: "120ms",
    control: "180ms",
    standard: "240ms",
    reveal: "900ms",
    signal: "1800ms",
    orbit: "40s",
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
  },
  layout: {
    content: "1180px",
    navigation: "1380px",
    application: "1420px",
    sectionDesktop: "112px",
    sectionMobile: "78px"
  },
  breakpoints: {
    compact: "480px",
    tablet: "768px",
    product: "1024px",
    wide: "1181px",
    canvas: "1440px"
  }
} as const;

export const dataVisualizationTokens = {
  primarySeries: brandTokens.colors.blueBright,
  intelligenceSeries: brandTokens.colors.cyan,
  positiveSeries: brandTokens.colors.emerald,
  cautionSeries: brandTokens.colors.amber,
  riskSeries: brandTokens.colors.red,
  gridDark: "rgba(148, 163, 184, 0.13)",
  gridLight: "rgba(46, 67, 94, 0.13)"
} as const;
